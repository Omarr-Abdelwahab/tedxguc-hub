import type { ButtonHTMLAttributes } from "react";
import type { ButtonVariantProps } from "@/components/ui/variants/buttonVariants";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps & {
  asChild?: boolean;
};
