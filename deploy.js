const {Mina, PrivateKey, fetchAccount, AccountUpdate} = require("snarkyjs");

const deploySmartContract = async (path) => {
    let Berkeley = Mina.Network('https://berkeley.minascan.io/graphql');
    Mina.setActiveInstance(Berkeley);

    let feePayerKey = PrivateKey.random()
    let feePayerAddress = feePayerKey.toPublicKey();
    let response = await fetchAccount({publicKey: feePayerAddress});
    if (response.error) throw Error(response.error.statusText);

    let zkappKey = PrivateKey.random()
    let zkappAddress = zkappKey.toPublicKey();

    let transactionFee = 100_000_000;

    const {Add} = await import(path)

    let {verificationKey} = await Add.compile();

    let zkapp = new Add(zkappAddress);

    let transaction = await Mina.transaction(
        {sender: feePayerAddress, fee: transactionFee},
        () => {
            AccountUpdate.fundNewAccount(feePayerAddress);
            zkapp.deploy({verificationKey});
        }
    );

    await transaction.sign([feePayerKey, zkappKey]).send();
}

module.exports = {
    deploySmartContract
}
