/* eslint-disable @typescript-eslint/no-explicit-any */
// IPFS integration using Pinata
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!;

export const uploadToIPFS = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      uploadedBy: "nft-platform",
      timestamp: new Date().toISOString(),
    },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinata upload failed: ${errorData.error}`);
    }

    const result = await response.json();
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw new Error("Failed to upload file to IPFS");
  }
};

export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
  try {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `${metadata.name}-metadata`,
            keyvalues: {
              type: "nft-metadata",
              timestamp: new Date().toISOString(),
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pinata metadata upload failed: ${errorData.error}`);
    }

    const result = await response.json();
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error("Metadata upload error:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
};

export const fetchFromIPFS = async (ipfsUrl: string): Promise<any> => {
  try {
    // Convert IPFS URL to HTTP gateway URL
    const httpUrl = ipfsUrl.replace(
      "ipfs://",
      "https://gateway.pinata.cloud/ipfs/"
    );

    const response = await fetch(httpUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("IPFS fetch error:", error);
    throw new Error("Failed to fetch data from IPFS");
  }
};
