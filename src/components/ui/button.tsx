"use client";

import * as React from "react";

type Variant = "default" | "outline" | "ghost" | "link" | "hero";
type Size = "default" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

function cx(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

// Compose handlers so both child + Button can run (common with Links)
function composeEventHandlers<E>(
  theirs?: (event: E) => void,
  ours?: (event: E) => void
) {
  return (event: E) => {
    theirs?.(event);
    // @ts-expect-error - React synthetic event compatibility
    if (event?.defaultPrevented) return;
    ours?.(event);
  };
}

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  default: "bg-black text-white hover:bg-black/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "underline-offset-4 hover:underline",
  hero: "bg-primary text-primary-foreground hover:bg-primary/90",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cx(base, variants[variant], sizes[size], className);

  // ✅ asChild path: clone the only child and merge props + className
  if (asChild) {
    const child = React.Children.only(props.children) as React.ReactElement<any>;

    if (!React.isValidElement(child)) return null;

    const childProps = (child.props ?? {}) as Record<string, any>;
    const { children, ...rest } = props;

    return React.cloneElement(
      child,
      {
        ...rest,
        ...childProps,
        className: cx(classes, childProps.className),
        onClick: composeEventHandlers(childProps.onClick, onClick),
      } as any
    );
  }

  // ✅ normal button path (don’t leak asChild to DOM)
  return (
    <button
      type={type ?? "button"}
      className={classes}
      onClick={onClick}
      {...props}
    />
  );
}
