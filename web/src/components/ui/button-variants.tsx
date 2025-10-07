import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom inventory app variants
        tile: "bg-card text-card-foreground shadow-md hover:shadow-lg border border-border h-32 w-32 flex-col text-center transition-all duration-300 hover:scale-105",
        success: "bg-success text-success-foreground shadow hover:bg-success/90",
        warning: "bg-warning text-warning-foreground shadow hover:bg-warning/90",
        count: "bg-accent text-accent-foreground shadow hover:bg-accent/90 h-8 w-8 p-0 rounded-full",
        reorder: "bg-primary text-primary-foreground shadow hover:bg-primary/90 text-xs py-1 px-3 h-auto",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        tile: "h-32 w-32",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);