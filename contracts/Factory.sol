// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./FractionVault.sol";

contract Factory {

    FractionVault[] public Vaults; 

    mapping(address=>FractionVault[]) public UserVaults;

    event VaultCreated (
        address user, 
        FractionVault vault
    );

    function createFractionVault(string memory name, string memory description) public {
        FractionVault vault = new FractionVault(msg.sender, name, description);
        UserVaults[msg.sender].push(vault);
        Vaults.push(vault);
        emit VaultCreated(msg.sender, vault);
    }

    function getAllUserVaults(address user) public view returns (FractionVault[] memory) {
        return UserVaults[user];
    }

    function getAllVaults() public view returns (FractionVault[] memory){
       return Vaults;
    }

}