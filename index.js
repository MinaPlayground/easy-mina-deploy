#!/usr/bin/env node
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const {deploySmartContract} = require("./deploy");

yargs(hideBin(process.argv)).command({
    command: 'deploy',
    describe: 'Deploy a Smart Contract',
    builder: {
        path: {
            describe: 'Path of your Smart Contract',
            demandOption: true,
            type: 'string',
        },
        className: {
            describe: 'Class name of the Smart Contract you want to deploy',
            demandOption: true,
            type: 'string',
        },
        feePayerKey: {
            describe: 'Private key of the fee payer',
            type: 'string',
        },
        zkAppKey: {
            describe: 'Private key of the zkApp',
            type: 'string',
        },
    },
    async handler(argv) {
        const {path, className, feePayerKey, zkAppKey} = argv
        await deploySmartContract(path, className, feePayerKey, zkAppKey)
    },
}).strict();

yargs.parse();
