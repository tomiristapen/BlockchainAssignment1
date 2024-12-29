const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Specify the contract and file name
const contractName = 'EtherWallet';
const fileName = `${contractName}.sol`;

// Read and compile the contract
const contractPath = path.resolve(__dirname, fileName);
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        [fileName]: { content: source },
    },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const compiled = output.contracts[fileName][contractName];

// Save ABI and Bytecode
fs.writeFileSync(`${contractName}Abi.json`, JSON.stringify(compiled.abi));
fs.writeFileSync(`${contractName}Bytecode.bin`, compiled.evm.bytecode.object);

console.log('Contract compiled successfully!');
