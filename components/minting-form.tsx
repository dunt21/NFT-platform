/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { useContract } from "@/hooks/use-contract";
import { uploadToIPFS, uploadMetadataToIPFS } from "@/lib/ipfs-pinata";

export default function MintingForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mintNFT } = useContract();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image || !formData.name || !formData.description) {
      toast.error("Missing fields", {
        description: "Please fill in all fields and select an image",
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      toast.loading("Uploading to IPFS...", { id: "minting" });

      // Upload image to IPFS
      const imageUri = await uploadToIPFS(formData.image);
      setUploadProgress(50);

      // Create metadata
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: imageUri,
        attributes: [
          {
            trait_type: "Created",
            value: new Date().toISOString(),
          },
        ],
      };

      // Upload metadata to IPFS
      const metadataUri = await uploadMetadataToIPFS(metadata);
      setUploadProgress(80);

      setIsUploading(false);
      setIsMinting(true);

      toast.loading("Minting NFT...", { id: "minting" });

      // Mint NFT
      const txHash = await mintNFT(metadataUri);

      toast.success("NFT Minted Successfully!", {
        id: "minting",
        description: `Transaction: ${txHash.slice(0, 10)}...`,
        action: {
          label: "View",
          onClick: () =>
            window.open(
              `https://sepolia-blockscout.lisk.com/tx/${txHash}`,
              "_blank"
            ),
        },
      });

      // Reset form
      setFormData({ name: "", description: "", image: null });
      setImagePreview(null);
    } catch (error: any) {
      console.error("Minting error:", error);
      toast.error("Minting failed", {
        id: "minting",
        description:
          error.message ||
          "There was an error minting your NFT. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setIsMinting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl w-fit">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            Create Your NFT
          </CardTitle>
          <CardDescription className="text-base">
            Upload your digital artwork and mint it as an NFT. You&apos;ll
            automatically earn Creator Tokens!
          </CardDescription>
          <div className="flex items-center justify-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Earn Creator Tokens with every mint!
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label htmlFor="image" className="text-base font-medium">
                Artwork Image
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors duration-200">
                {imagePreview ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full h-64 object-cover mx-auto rounded-xl shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                          className="bg-white/90 hover:bg-white text-gray-900"
                        >
                          Change Image
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="mx-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image")?.click()
                        }
                        className="h-12 px-8 border-2 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Choose Image
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        PNG, JPG, GIF up to 10MB • Recommended: 1:1 aspect ratio
                      </p>
                    </div>
                  </div>
                )}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* NFT Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">
                  NFT Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter a catchy name for your NFT"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-12 text-base border-2 focus:border-purple-400"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your artwork, inspiration, or story behind it..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="text-base border-2 focus:border-purple-400 resize-none"
                />
              </div>
            </div>

            {/* Upload Progress */}
            {(isUploading || isMinting) && (
              <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading to IPFS..." : "Minting NFT..."}
                  </span>
                  <span>
                    {isUploading ? `${uploadProgress}%` : "Processing..."}
                  </span>
                </div>
                <Progress
                  value={isUploading ? uploadProgress : undefined}
                  className="h-2"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
              disabled={isUploading || isMinting}
            >
              {isUploading || isMinting ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  {isUploading ? "Uploading..." : "Minting..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  Mint NFT & Earn Tokens
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
