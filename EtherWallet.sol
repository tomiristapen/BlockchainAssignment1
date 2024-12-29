// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EtherWallet {
    address public owner;

    // Set the owner of the contract during deployment
    constructor() {
        owner = msg.sender;
    }

    // Function to receive Ether
    receive() external payable {}

    // Fallback function to receive Ether
    fallback() external payable {}

    // Check the contract's balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Withdraw all funds (only owner can call)
    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Transfer a specific amount of Ether to another address
    function transfer(address payable _to, uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can transfer funds");
        require(_amount <= address(this).balance, "Insufficient balance");
        _to.transfer(_amount);
    }
}
