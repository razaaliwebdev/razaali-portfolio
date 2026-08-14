import { BootSplash } from "@/components/TerminalLoader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAdminSession } from "@/lib/session";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <>
      <BootSplash />
      <Header isAdmin={Boolean(session)} />
      {children}
      <Footer />
    </>
  );
}
