"use client";

import { toast } from "sonner";

// Simple wrapper to maintain compatibility with existing code
export function useToast() {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (options.variant === "destructive") {
        toast.error(options.title || "Error", {
          description: options.description,
        });
      } else {
        toast.success(options.title || "Success", {
          description: options.description,
        });
      }
    },
    dismiss: toast.dismiss,
  };
}

// Export toast directly for more advanced usage
export { toast };
