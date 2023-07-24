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
    },
    async handler(argv) {
        const {path} = argv
        await deploySmartContract(path)
    },
});

yargs.parse();
