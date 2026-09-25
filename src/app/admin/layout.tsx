import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
