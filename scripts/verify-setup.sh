{
  "deployment_checklist": {
    "pre_deployment": [
      {
        "task": "Verify contract addresses",
        "description": "Ensure both ERC20 and ERC721 contract addresses are correct",
        "critical": true
      },
      {
        "task": "Test contract ABIs",
        "description": "Verify ABIs match deployed contracts",
        "critical": true
      },
      {
        "task": "Test IPFS integration",
        "description": "Upload test image and metadata to IPFS",
        "critical": true
      },
      {
        "task": "Test wallet connection",
        "description": "Connect MetaMask on Lisk Sepolia",
        "critical": true
      },
      {
        "task": "Test NFT minting",
        "description": "Complete end-to-end minting process",
        "critical": true
      },
      {
        "task": "Verify reward tracking",
        "description": "Check if reward events are captured",
        "critical": false
      }
    ],
    "environment_variables": [
      {
        "name": "NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS",
        "required": true,
        "description": "ERC20 Creator Token contract address"
      },
      {
        "name": "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS",
        "required": true,
        "description": "ERC721 NFT contract address"
      },
      {
        "name": "NEXT_PUBLIC_CHAIN_ID",
        "required": true,
        "default": "4202",
        "description": "Lisk Sepolia chain ID"
      },
      {
        "name": "NEXT_PUBLIC_PINATA_API_KEY",
        "required": false,
        "description": "Pinata API key for IPFS uploads"
      },
      {
        "name": "NEXT_PUBLIC_PINATA_SECRET_KEY",
        "required": false,
        "description": "Pinata secret key for IPFS uploads"
      },
      {
        "name": "NEXT_PUBLIC_NFT_STORAGE_API_KEY",
        "required": false,
        "description": "Alternative to Pinata for IPFS"
      }
    ],
    "post_deployment": [
      {
        "task": "Test production wallet connection",
        "description": "Verify MetaMask connects on production"
      },
      {
        "task": "Test production minting",
        "description": "Mint test NFT on production"
      },
      {
        "task": "Verify IPFS uploads work",
        "description": "Check image and metadata uploads"
      },
      {
        "task": "Test gallery functionality",
        "description": "Verify NFTs display correctly"
      },
      {
        "task": "Check reward tracking",
        "description": "Verify reward events are shown"
      },
      {
        "task": "Test block explorer links",
        "description": "Ensure all explorer links work"
      }
    ]
  }
