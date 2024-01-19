const logInfo = (message, details) => {
    const infoObj = {
        type: 'info',
        message,
        details
    }
    console.log(JSON.stringify(infoObj));
}

const throwError = (message) => {
    const errorObj = {
        type: 'error',
        message
    }
    console.log(JSON.stringify(errorObj));
    process.exit(1);
}

const deploySmartContract = async (path, className, customFeePayerKey, customZkAppKey, contractPath) => {
    const o1jsImportPath = `${process.cwd()}${contractPath && `/${contractPath}`}/node_modules/o1js/dist/node/index.js`;
    const {PrivateKey, Mina, AccountUpdate, fetchAccount} = await import(o1jsImportPath);
    const Berkeley = Mina.Network('https://berkeley.minascan.io/graphql');
    Mina.setActiveInstance(Berkeley);

    const feePayerKey = customFeePayerKey ? PrivateKey.fromBase58(customFeePayerKey) : PrivateKey.random();
    const feePayerAddress = feePayerKey.toPublicKey();
    const response = await fetchAccount({publicKey: feePayerAddress});
    if (response.error) {
        throwError(`Fee payer not found, please fund the following address: ${feePayerAddress.toBase58()}`);
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
        const {isSuccess, hash} = await transaction.sign([zkappKey, feePayerKey]).send();
        if (isSuccess) {
            logInfo(`Deployment successful`, hash())
        }
    } catch (e) {
        throwError(e.message);
    }
}

module.exports = {
    deploySmartContract
}
