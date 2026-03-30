import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type ArabicTextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function ArabicText<T extends ElementType = "p">({
  as,
  children,
  className = "",
  ...props
}: ArabicTextProps<T>) {
  const Component = (as ?? "p") as ElementType;

  return (
    <Component
      dir="rtl"
      lang="ar"
      className={`font-arabic ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
