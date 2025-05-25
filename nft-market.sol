// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorToken is ERC20, Ownable {
    address public nftContract;
    event NFTAddrUpdated(address indexed oldAddr, address indexed newAddr);

    constructor(address _nftContract)
        ERC20("Reward", "RWD")
        Ownable(msg.sender)
    {
     nftContract = _nftContract;
    }

    modifier onlyNFTContract() {
        require(
            msg.sender == nftContract,
            "Only the NFT contract can use this function"
        );
        _;
    }

    function mint(address to, uint256 amount) external onlyNFTContract {
      require(to != address(0) , "Invalid recipient address");
      require(amount > 0 , "Amount must be greater than 0");

        _mint(to, amount);
    }

    function updateNFTContractAddr(address _newContract) external onlyOwner {
      require(_newContract != address(0), "Invalid contract address");
        emit NFTAddrUpdated(nftContract, _newContract);
        nftContract = _newContract;
    }
}

contract ArtNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public constant REWARD_AMT = 50 * 10**18;
    CreatorToken public rewardToken;

    mapping(uint256 => address) public creators;

    event NFTCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string tokenURI
    );
    event CreatorRewarded(uint256 amount, address indexed creator);

    constructor(address tokenAddr)
        ERC721("ArtNFT", "ANFT")
        Ownable(msg.sender)
    {
        tokenCounter = 0;
        require(tokenAddr != address(0), "Invalid address");
        rewardToken = CreatorToken(tokenAddr);
    }

    function mintNft(string memory _tokenURI) external {
        uint256 newTokenID = tokenCounter;
        tokenCounter++;

        _safeMint(msg.sender, newTokenID);
        _setTokenURI(newTokenID, _tokenURI);

        rewardToken.mint(msg.sender, REWARD_AMT);
        creators[newTokenID] = msg.sender;

        emit NFTCreated(newTokenID, msg.sender, _tokenURI);
        emit CreatorRewarded(REWARD_AMT, msg.sender);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
        override
    {
        super._setTokenURI(tokenId, _tokenURI);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
      
        return super.tokenURI(tokenId);
    }

    function getNFTsByCreator(address creator)
        external
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(creator);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 0; i < tokenCounter; i++) {
            if (ownerOf(i) == creator) {
                tokenIds[index] = i;
                index++;
            }
        }
        return tokenIds;
    }
}
