# easy-mina-deploy

Easy Mina Deploy is a command-line tool that simplifies the deployment process for Mina Protocol smart contracts. It allows you to deploy contracts with ease using various parameters like `path`, `className`, `feePayerKey`, and `zkAppKey`. 

## Installation

To install `easy-mina-deploy`, you need to have [Node.js](https://nodejs.org/) installed on your system. Then, you can install the package globally using npm:

```bash
npm install -g easy-mina-deploy
```

or use npx:

```bash
npx easy-mina-deploy deploy
```

## Usage
Without providing your own keys:
```bash
npx easy-mina-deploy deploy --path /path/to/your/smart-contract.js --className MySmartContract
```

With your own fee payer key:
```bash
npx easy-mina-deploy deploy --path /path/to/your/smart-contract.js --className MySmartContract --feePayerKey <your_fee_payer_key>
```

With your own zkApp key:
```bash
npx easy-mina-deploy deploy --path /path/to/your/smart-contract.js --className MySmartContract --zkAppKey <your_zkApp_key>
```

With your own fee payer key and zkApp key:
```bash
npx easy-mina-deploy deploy --path /path/to/your/smart-contract.js --className MySmartContract --feePayerKey <your_fee_payer_key> --zkAppKey <your_zkApp_key>
```

### 1. `path`

The `path` command is used to specify the file path of the smart contract you want to deploy. It should point to the contract's JavaScript file.

```bash
--path /path/to/your/smart-contract.js
```

### 2. `className`

The `className` command is used to specify the name of the contract's main class. This is required for deploying the contract correctly.

```bash
--className MySmartContract
```

### 3. `feePayerKey` (optional)

The `feePayerKey` command is optional and allows you to set the fee payer key. If not provided, a random generated fee payer key will be used.

```bash
--feePayerKey <your_fee_payer_key>
```

### 4. `zkAppKey` (optional)

The `zkAppKey` command is optional and allows you to set the zkApp key. If not provided, a random generated zkApp key will be used.

```bash
--zkAppKey <your_zkApp_key>
```

## Contributions

Contributions to `easy-mina-deploy` are welcome! If you find any issues or want to add new features, feel free to open a pull request.
