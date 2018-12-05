# Verifying the smart contract code

Etherscan allows anyone to publish the source code associated with a smart contract at a certain address simply by providing the parameters used to compile the source code, as well as the source code itself.
The way it works is that it uses those same parameters to compile the provided contract code and then comparing this output with the bytecode at the given smart contract address. If they are identical then the provided source code is shown under the 'code' tab when viewing the smart contract address.

The following verification configuration is valid as of 5th Dec 2018, for the 2.2.0 version of the DocumentStore smart contract.


# Configuration:

Contract Name:	DocumentStore

Compiler Text:	v0.4.25+commit.59dbf8f1

Optimization Enabled:	No

Runs (Optimiser): 	200

# Constructor Parameters
Using: https://abi.hashex.org/#

1. Fill in ABI from below
2. Fill in the name entered when deploying the contract store
3. Get ABI encoded parameters and fill it into Etherscan



# ABI

```
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "issue",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "revoke",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_name",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "DocumentIssued",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "DocumentRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			}
		],
		"name": "OwnershipRenounced",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "getIssuedBlock",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "isIssued",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			},
			{
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "isIssuedBefore",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			}
		],
		"name": "isRevoked",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "document",
				"type": "bytes32"
			},
			{
				"name": "blockNumber",
				"type": "uint256"
			}
		],
		"name": "isRevokedBefore",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
```

# Contract Souce:

```
pragma solidity ^0.4.24;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}


contract DocumentStore is Ownable {
  string public name;
  string public version = "2.2.0";

  /// A mapping of the document hash to the block number that was issued
  mapping(bytes32 => uint) documentIssued;
  /// A mapping of the hash of the claim being revoked to the revocation block number
  mapping(bytes32 => uint) documentRevoked;

  event DocumentIssued(bytes32 indexed document);
  event DocumentRevoked(
    bytes32 indexed document
  );

  constructor(
    string _name
  ) public
  {
    name = _name;
  }

  function issue(
    bytes32 document
  ) public onlyOwner onlyNotIssued(document)
  {
    documentIssued[document] = block.number;
    emit DocumentIssued(document);
  }

  function getIssuedBlock(
    bytes32 document
  ) public onlyIssued(document) view returns (uint)
  {
    return documentIssued[document];
  }

  function isIssued(
    bytes32 document
  ) public view returns (bool)
  {
    return (documentIssued[document] != 0);
  }

  function isIssuedBefore(
    bytes32 document,
    uint blockNumber
  ) public view returns (bool)
  {
    return documentIssued[document] != 0 && documentIssued[document] <= blockNumber;
  }

  function revoke(
    bytes32 document
  ) public onlyOwner onlyNotRevoked(document) returns (bool)
  {
    documentRevoked[document] = block.number;
    emit DocumentRevoked(document);
  }

  function isRevoked(
    bytes32 document
  ) public view returns (bool)
  {
    return documentRevoked[document] != 0;
  }

  function isRevokedBefore(
    bytes32 document,
    uint blockNumber
  ) public view returns (bool)
  {
    return documentRevoked[document] <= blockNumber && documentRevoked[document] != 0;
  }

  modifier onlyIssued(bytes32 document) {
    require(isIssued(document), "Error: Only issued document hashes can be revoked");
    _;
  }

  modifier onlyNotIssued(bytes32 document) {
    require(!isIssued(document), "Error: Only hashes that have not been issued can be issued");
    _;
  }

  modifier onlyNotRevoked(bytes32 claim) {
    require(!isRevoked(claim), "Error: Hash has been revoked previously");
    _;
  }
}
```
