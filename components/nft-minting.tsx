"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function NFTMinting() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadToIPFS = async (file: File): Promise<string> => {
    // Simulate IPFS upload with progress
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsUploading(false)

    // Return a mock IPFS hash - replace with actual Pinata/NFT.Storage integration
    return `ipfs://QmYourImageHash${Date.now()}`
  }

  const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
    // Simulate metadata upload
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `ipfs://QmYourMetadataHash${Date.now()}`
  }

  const mintNFT = async () => {
    if (!formData.image || !formData.name || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and select an image",
        variant: "destructive",
      })
      return
    }

    try {
      setIsMinting(true)

      // Upload image to IPFS
      const imageUri = await uploadToIPFS(formData.image)

      // Create metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUri,
        attributes: [],
      }

      // Upload metadata to IPFS
      const metadataUri = await uploadMetadataToIPFS(metadata)

      // Here you would call your smart contract's mint function
      // Example with ethers:
      /*
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer)
      const tx = await contract.mint(metadataUri)
      await tx.wait()
      */

      // Simulate contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "NFT Minted Successfully!",
        description: `Your NFT "${formData.name}" has been minted and you've earned creator tokens!`,
      })

      // Reset form
      setFormData({ name: "", description: "", image: null })
      setPreviewUrl("")
    } catch (error) {
      console.error("Minting error:", error)
      toast({
        title: "Minting failed",
        description: "There was an error minting your NFT",
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">NFT Name</Label>
            <Input
              id="name"
              placeholder="Enter NFT name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your NFT"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            <div className="mt-2">
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {formData.image ? formData.image.name : "Click to upload image"}
                </span>
              </Label>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Label>Uploading to IPFS...</Label>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>

        <div>
          <Label>Preview</Label>
          <Card className="mt-2">
            <CardContent className="p-4">
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="NFT Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{formData.name || "Untitled"}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formData.description || "No description"}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span>No image selected</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Button
        onClick={mintNFT}
        disabled={isMinting || isUploading || !formData.image || !formData.name}
        className="w-full"
        size="lg"
      >
        {isMinting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Minting NFT...
          </>
        ) : (
          "Mint NFT"
        )}
      </Button>
    </div>
  )
}
