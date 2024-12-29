const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://127.0.0.1:7545'); // Ganache RPC URL

// Load ABI and Bytecode from files
const abi = require('./EtherWalletAbi.json'); // Ensure this file is generated during compilation
const bytecode = fs.readFileSync(path.join(__dirname, 'EtherWalletBytecode.bin'), 'utf8'); // Ensure this file is generated during compilation

const deploy = async () => {
    try {
        // Fetch accounts from Ganache
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0]; // Use the first account as the deployer

        console.log(`Deployer account: ${deployer}`);

        // Estimate gas required for deployment
        const gasEstimate = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode })
            .estimateGas({ from: deployer });
        console.log(`Estimated gas: ${gasEstimate}`);

        // Deploy the contract
        const contract = await new web3.eth.Contract(abi)
            .deploy({ data: bytecode })
            .send({ from: deployer, gas: gasEstimate });

        // Log deployed contract address
        console.log(`Contract deployed at address: ${contract.options.address}`);

        // Save the deployed contract address for later use
        fs.writeFileSync('EtherWalletAddress.txt', contract.options.address);
        console.log('Contract address saved to EtherWalletAddress.txt');
    } catch (error) {
        console.error('Deployment failed:', error.message);
    }
};

deploy().catch(console.error);
