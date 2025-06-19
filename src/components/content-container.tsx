import { cn } from "@/lib/utils";

interface SectionProps {
  span?: number;
  className?: string;
  children: React.ReactNode;
}

export default function SectionContainer({
  className,
  children,
  span = 12,
}: SectionProps) {
  return (
    <div className={cn(`flex flex-col gap-3 col-span-${span}`, className)}>
      {children}
    </div>
  );
}

export const SectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("w-full", className)}>
      <h1 className="font-bold text-base">{children}</h1>
    </div>
  );
};

export const SectionBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("w-full", className)}>{children}</div>;
};

export const SectionFooter = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full border-b-2 border-border py-2 drop-shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};
