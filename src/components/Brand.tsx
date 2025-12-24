// src/components/Brand.tsx

import Link from "next/link";
import Image from "next/image";

type BrandSize = "marketing" | "app" | "compact";

const SIZE_MAP: Record<BrandSize, { h: number; w: number; className: string }> =
  {
    marketing: {
      h: 44,
      w: 220,
      className: "h-11", // 44px
    },
    app: {
      h: 28,
      w: 140,
      className: "h-11", // 28px
    },
    compact: {
      h: 24,
      w: 120,
      className: "h-6", // 24px
    },
  };

type BrandProps = {
  href?: string;
  size?: BrandSize;
  priority?: boolean;
};

export default function Brand({
  href = "/",
  size = "app",
  priority = false,
}: BrandProps) {
  const cfg = SIZE_MAP[size];

  return (
    <Link href={href} className="flex items-center shrink-0">
      <Image
        src="/assets/audit-iq-logo-horizontal.png"
        alt="Audit-IQ"
        height={cfg.h}
        width={cfg.w}
        priority={priority}
        className={`${cfg.className} w-auto`}
      />
    </Link>
  );
}
