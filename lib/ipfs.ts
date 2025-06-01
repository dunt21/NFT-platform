// IPFS integration utilities
// Replace with your actual Pinata or NFT.Storage configuration

export const uploadToIPFS = async (file: File): Promise<string> => {
  // Example with Pinata
  const formData = new FormData()
  formData.append("file", file)

  const pinataMetadata = JSON.stringify({
    name: file.name,
  })
  formData.append("pinataMetadata", pinataMetadata)

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  })
  formData.append("pinataOptions", pinataOptions)

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer YOUR_PINATA_JWT_TOKEN`,
      },
      body: formData,
    })

    const result = await response.json()
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    throw error
  }
}

export const uploadJSONToIPFS = async (metadata: any): Promise<string> => {
  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_PINATA_JWT_TOKEN`,
      },
      body: JSON.stringify(metadata),
    })

    const result = await response.json()
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error)
    throw error
  }
}
