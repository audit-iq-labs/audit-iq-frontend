// src/app/(public)/layout.tsx

import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
