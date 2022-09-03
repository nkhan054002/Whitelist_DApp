//SPDX License Identifier:MIT
pragma solidity ^0.8.0;
//use solidity 0.8.4 or 0.8.10 

contract Whitelist{
    //maxm number of addresses that can be whitelisted 
    uint8 public maxWhitelistedAddresses;
    //uint8 is 8 bits wide=

    uint8 public numAddressesWhitelisted;
    //solc initializes it to 0

    mapping (address => bool) public WhitelistedAddresses;
    //this mapping is a hashmap

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    /**
        addAddressToWhitelist - This function adds the address of the sender to the
        whitelist
     */
    function addAddressToWhitelist() public {
        // check if the user has already been whitelisted
        require(!WhitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        // Add the address which called the function to the whitelistedAddress array
        WhitelistedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }

}