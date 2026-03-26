import { SimpleSiteHeader } from "@/components/layout/simple-site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SimpleSiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  );
}