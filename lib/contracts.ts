// Contract addresses and ABIs
// Replace these with your actual deployed contract addresses

export const CONTRACTS = {
  // Replace with your actual contract addresses
  NFT_CONTRACT_ADDRESS: "0x1234567890123456789012345678901234567890",
  TOKEN_CONTRACT_ADDRESS: "0x0987654321098765432109876543210987654321",
}

// Replace with your actual contract ABIs
export const NFT_ABI = [
  "function mint(string memory tokenURI) public returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function totalSupply() public view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
]

export const TOKEN_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function rewardCreator(address to, uint256 amount) public",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]
