"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface NFTMinterProps {
  mintNFT: (name: string, description: string, image: string) => Promise<void>
  isLoading: boolean
}

export default function NFTMinter({ mintNFT, isLoading }: NFTMinterProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImagePreview(result)
      setImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !description || !image) {
      toast({
        title: "Missing information",
        description: "Please fill all fields and select an image",
        variant: "destructive",
      })
      return
    }

    await mintNFT(name, description, image)

    // Reset form
    setName("")
    setDescription("")
    setImage(null)
    setImagePreview(null)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Create New NFT</CardTitle>
        <CardDescription>Upload your artwork and mint it as an NFT</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">NFT Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome NFT"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your NFT..."
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="image">Upload Image</Label>
            {imagePreview ? (
              <div className="mt-2 relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="NFT Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImage(null)
                    setImagePreview(null)
                  }}
                  disabled={isLoading}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <Label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </Label>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !image || !name || !description}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting NFT...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Mint NFT
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
