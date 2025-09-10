import GallerySection from "@/components/GallerySection";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background">
      <GallerySection showViewAllButton={false} />
    </div>
  );
}