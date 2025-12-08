import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          <Button asChild variant="outline" className="bg-card">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>
        </div>
        <GallerySection showViewAllButton={false} />
      </main>
      <Footer />
    </div>
  );
}