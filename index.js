#!/usr/bin/env node
const yargs = require('yargs');
const {deploySmartContract} = require("./deploy");

yargs.command({
    command: 'deploy',
    describe: 'Deploy a Smart Contract',
    builder: {
        path: {
            describe: 'Path of your Smart Contract',
            demandOption: true,
            type: 'string',
        },
        feePayerKey: {
            describe: 'Private key of the fee payer',
            demandOption: true,
            type: 'string',
        },
        zkAppKey: {
            describe: 'Private key of the zkApp',
            demandOption: true,
            type: 'string',
        },
    },
    async handler(argv) {
        const {path, feePayerKey, zkAppKey} = argv
        await deploySmartContract(path, feePayerKey, zkAppKey)
    },
});

yargs.parse();
