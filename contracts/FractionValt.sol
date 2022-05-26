// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "https://github.com/klaytn/klaytn-contracts/blob/57725120581e27ec469e1c7e497a4008aafff818/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/klaytn/klaytn-contracts/blob/57725120581e27ec469e1c7e497a4008aafff818/contracts/token/ERC721/IERC721.sol";
import "https://github.com/klaytn/klaytn-contracts/blob/57725120581e27ec469e1c7e497a4008aafff818/contracts/token/ERC1155/IERC1155Receiver.sol";
import "https://github.com/klaytn/klaytn-contracts/blob/57725120581e27ec469e1c7e497a4008aafff818/contracts/token/ERC721/IERC721Receiver.sol";

contract FractionVault is ERC1155, IERC721Receiver {

    address public owner;

    // @notice public identifiers
    string public vaultName;
    string public vaultInfo;

    // @notice fraction state
    uint256 public fractionSupply;
    uint256 public fractionPrice;
    uint256 public fractionHolders;
    uint256 public availableSupply;

    // @notice native token indexes
    uint256 public constant NFT = 0;  
    uint256 public constant FRACTION = 1;  

    mapping(address => uint256) public HolderAmount;

    event NFTstatus ( 
        string action,
        uint256 time
    );
    event Purchase (
        address user, 
        uint256 amount
    );
    event Burn ( 
        uint256 amount,
        uint256 remaining
    );

    constructor(address _owner, string memory _vaultName, string memory _vaultInfo) ERC1155("") {
        owner = _owner;
        vaultName = _vaultName;
        vaultInfo = _vaultInfo;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Invalid Access");
        _;
    } 

    // @notice mint a native KIP-37 NFT to fractionalize
    // @param total number of fractions created from the NFT - defined once
    // @param price of each individual fraction in KLAY - can later be changed
    function fractionalizeNative(string memory uri, uint256 supply, uint256 price) public onlyOwner {
        require(balanceOf(address(this), NFT) == 0, "Max of 1 NFT in Contract");
        _mint(address(this), NFT, 1, "");
        _mint(address(this), FRACTION, supply, "");
        fractionSupply += supply;
        availableSupply += supply;
        // account for decimal precision
        fractionPrice = (price * 1e18);
        _setURI(uri);
        emit NFTstatus("Minted", block.timestamp);
    }

    // @notice fractionalize an existing KIP-17 NFT
    function fractionalizeImport(address nftAddress, uint256 supply, uint256 price) public onlyOwner {
        require(balanceOf(address(this), NFT) == 0, "Max of 1 NFT in Contract");
        //if detected inside contract then peg 1:1 with native NFT token index
        if(IERC721(nftAddress).balanceOf(address(this)) > 0){
             _mint(address(this), NFT, 1, "");
             _mint(address(this), FRACTION, supply, "");
             fractionSupply += supply;
             availableSupply += supply;
             // account for decimal precision
             fractionPrice = (price * 1e18);
        } else {
            revert("Specified NFT not Detected in Contract");
        }
        emit NFTstatus("Imported", block.timestamp);
    }

    function changeVaultName(string memory name) public onlyOwner {
        vaultName = name;
    }
    function changeVaultInfo(string memory info) public onlyOwner {
        vaultInfo = info;
    }
    function changeFractionPrice(uint256 price) public onlyOwner {
        fractionPrice = (price * 1e18);
    }

    // @notice reduce the amount of unsold fractions inside vault  
    function burnFractions(uint256 amount) public onlyOwner {
        _burn(address(this), 1, amount);
        fractionSupply -= amount;
        availableSupply -= amount;
        emit Burn(amount, block.timestamp);
    }

    // @notice withdraw KIP-37 NFT minted in this contract
    function withdrawNative(address to, uint256 id, uint256 amount) public onlyOwner {
        require(fractionSupply == 0, "Fractions Minted / Withdraw Disabled");
        _safeTransferFrom(address(this), to, id, amount,"");
        emit NFTstatus("Withdraw", block.timestamp);
    }
    
    // @notice withdraw KIP-17 NFT deposited to this contract
    function withdrawImported(address nft, address to, uint256 id) public onlyOwner {
        require(fractionSupply == 0, "Fractions Minted / Withdraw Disabled");
        IERC721(nft).transferFrom(address(this), to, id);
        // depeg from native nft token index
        _burn(address(this), NFT, 1);
        emit NFTstatus("Withdraw", block.timestamp);
    }

    // @notice withdraw all KLAY made from fraction sales
    function collectFunds() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to Return Funds");
    }

    // @notice purchase fractions with KLAY
    function buyFractions(uint256 amount) public payable {
        require(balanceOf(address(this), 1) >= amount , "No Fractions Available");
        uint256 purchaseTotal = amount * fractionPrice;
        require(msg.value >= purchaseTotal, "Deposit More to Cover buy Amount");
        // if fractions not owned yet increase holder count
        if(HolderAmount[msg.sender] > 0){
            fractionHolders += 1;
        }
        _safeTransferFrom(address(this), msg.sender, 1, amount,"");
        HolderAmount[msg.sender] += amount;
        availableSupply -= amount;
        emit Purchase(msg.sender, amount);
    }

    // @notice token receiver functions 
    function onERC721Received(address , address , uint256 , bytes memory) external pure override returns (bytes4){
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"));
    }
    
}