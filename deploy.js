const deploySmartContract = async (path, className, customFeePayerKey, customZkAppKey) => {
    const snarkyjsImportPath = `${process.cwd()}/node_modules/snarkyjs/dist/node/index.js`;
    const {PrivateKey, Mina, AccountUpdate, fetchAccount} = await import(snarkyjsImportPath);
    const Berkeley = Mina.Network('https://berkeley.minascan.io/graphql');
    Mina.setActiveInstance(Berkeley);

    const feePayerKey = customFeePayerKey ? PrivateKey.fromBase58(customFeePayerKey) : PrivateKey.random();
    const feePayerAddress = feePayerKey.toPublicKey();
    const response = await fetchAccount({publicKey: feePayerAddress});
    if (response.error) throw Error(response.error.statusText);

    const zkappKey = customZkAppKey ? PrivateKey.fromBase58(customZkAppKey) : PrivateKey.random();
    const zkappAddress = zkappKey.toPublicKey();

    const transactionFee = 100_000_000;

    const smartContract = await import(`${process.cwd()}/${path}`);

    if (!(className in smartContract)) {
        console.error(`Failed to find the "${className}" smart contract in your build directory.\n Check that you have exported your smart contract class using a named export and try again.`);
        process.exit(1);
    }
    const smartContractClass = smartContract[className]
    const {verificationKey} = await smartContractClass.compile();
    const zkapp = new smartContractClass(zkappAddress);

    const transaction = await Mina.transaction(
        {sender: feePayerAddress, fee: transactionFee},
        () => {
            AccountUpdate.fundNewAccount(feePayerAddress);
            zkapp.deploy({verificationKey});
        }
    );

    await transaction.sign([feePayerKey, zkappKey]).send();
    console.log(zkappAddress.toBase58())
}

module.exports = {
    deploySmartContract
}
