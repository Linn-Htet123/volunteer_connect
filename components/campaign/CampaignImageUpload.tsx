/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CampaignImageUploadProps {
  form: any;
  imagePreview: string;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
}

export const CampaignImageUpload: React.FC<CampaignImageUploadProps> = ({
  form,
  imagePreview,
  handleImageChange,
  removeImage,
}) => {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Cover Image</h2>
        </div>

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormControl>
                {!imagePreview ? (
                  <label className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[300px] lg:min-h-[400px]">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2 text-center">
                      Click to upload image
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      PNG, JPG up to 5MB
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-full min-h-[300px] lg:min-h-[400px] rounded-lg overflow-hidden border border-border group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
