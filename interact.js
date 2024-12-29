const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('http://127.0.0.1:7545'); // Ganache RPC URL

const abi = require('./EtherWalletAbi.json'); // Ensure this ABI includes the withdraw() function
const contractAddress = fs.readFileSync(path.join(__dirname, 'EtherWalletAddress.txt'), 'utf8').trim();

const etherWallet = new web3.eth.Contract(abi, contractAddress);

const interact = async () => {
    const accounts = await web3.eth.getAccounts();
    const owner = accounts[0]; // Deployer (owner)
    const recipient = accounts[1]; // Another Ganache account

    // Check contract balance before any transactions
    const balanceBefore = await etherWallet.methods.getBalance().call();
    console.log('Contract balance before:', web3.utils.fromWei(balanceBefore, 'ether'), 'ETH');

    // Send Ether to the contract
    const sendAmount = web3.utils.toWei('1', 'ether');
    await web3.eth.sendTransaction({ from: owner, to: contractAddress, value: sendAmount });
    console.log('Sent 1 ETH to the contract.');

    // Check updated balance after deposit
    const balanceAfter = await etherWallet.methods.getBalance().call();
    console.log('Contract balance after deposit:', web3.utils.fromWei(balanceAfter, 'ether'), 'ETH');

    // Transfer Ether from contract to another address
    const transferAmount = web3.utils.toWei('0.5', 'ether');
    await etherWallet.methods.transfer(recipient, transferAmount).send({ from: owner, gas: 1000000 });
    console.log(`Transferred 0.5 ETH to ${recipient}`);

    // Check final contract balance
    const finalBalance = await etherWallet.methods.getBalance().call();
    console.log('Contract balance after transfer:', web3.utils.fromWei(finalBalance, 'ether'), 'ETH');

    // Withdraw all funds from the contract by the owner (changed from withdrawAll to withdraw)
    await etherWallet.methods.withdraw().send({ from: owner, gas: 1000000 });
    console.log('Owner has withdrawn all Ether from the contract.');

    // Check contract balance after withdrawal
    const finalBalanceAfterWithdraw = await etherWallet.methods.getBalance().call();
    console.log('Contract balance after withdrawal:', web3.utils.fromWei(finalBalanceAfterWithdraw, 'ether'), 'ETH');
};

interact().catch(console.error);
