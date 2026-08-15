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
    <div className="flex min-h-dvh flex-col">
      <Header isAdmin={Boolean(session)} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
