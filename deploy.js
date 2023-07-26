const logMessages = (info, details) => {
    console.log(`Info: ${info}`);
    console.log(`Details: ${details}`);
}

const throwError = (error) => {
    console.log(`Error: ${error}`);
    process.exit(1);
}

const deploySmartContract = async (path, className, customFeePayerKey, customZkAppKey) => {
    const snarkyjsImportPath = `${process.cwd()}/node_modules/snarkyjs/dist/node/index.js`;
    const {PrivateKey, Mina, AccountUpdate, fetchAccount} = await import(snarkyjsImportPath);
    const Berkeley = Mina.Network('https://berkeley.minascan.io/graphql');
    Mina.setActiveInstance(Berkeley);

    const feePayerKey = customFeePayerKey ? PrivateKey.fromBase58(customFeePayerKey) : PrivateKey.random();
    const feePayerAddress = feePayerKey.toPublicKey();
    const response = await fetchAccount({publicKey: feePayerAddress});
    if (response.error) {
        const feePayerKeys = {
            feePayerPublicKey: feePayerAddress.toBase58(),
            feePayerPrivateKey: feePayerKey.toBase58()
        }
        logMessages(`Please fund the following address: ${feePayerAddress.toBase58()}`, JSON.stringify(feePayerKeys));
        throwError('Fee payer not found');
    }

    const zkappKey = customZkAppKey ? PrivateKey.fromBase58(customZkAppKey) : PrivateKey.random();
    const zkappAddress = zkappKey.toPublicKey();

    const transactionFee = 100_000_000;

    try {
        const smartContract = await import(`${process.cwd()}/${path}`);
        if (!(className in smartContract)) {
            throw new Error(`Failed to find the "${className}" smart contract in your build directory.`);
        }
        const smartContractClass = smartContract[className];
        const {verificationKey} = await smartContractClass.compile();
        const zkapp = new smartContractClass(zkappAddress);

        const transaction = await Mina.transaction(
            {sender: feePayerAddress, fee: transactionFee},
            () => {
                AccountUpdate.fundNewAccount(feePayerAddress);
                zkapp.deploy({verificationKey});
            }
        );
        const {isSuccess, hash} = await transaction.sign([feePayerKey, zkappKey]).send();
        if (isSuccess) {
            logMessages(`Deployment successful`, JSON.stringify({transactionHash: hash()}));
        }
    } catch (e) {
        throwError(e.message);
    }
}

module.exports = {
    deploySmartContract
}
