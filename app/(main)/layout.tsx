import Footer from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-hidden relative flex flex-col min-h-screen pb-[80px] md:pb-0">
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
