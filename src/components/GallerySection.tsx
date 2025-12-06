import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera, Sparkles, Grid3X3, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const galleryCategories = {
  wedding: {
    title: "عروس",
    icon: "💍",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"
    ]
  },
  children: {
    title: "کودک",
    icon: "👶",
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=800&h=600&fit=crop"
    ]
  },
  sport: {
    title: "اسپرت",
    icon: "⚡",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566754219187-f30ba1c0bd5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566844538439-5c1f436b5ea8?w=800&h=600&fit=crop"
    ]
  },
  family: {
    title: "خانوادگی",
    icon: "👨‍👩‍👧‍👦",
    images: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop"
    ]
  }
};

interface GallerySectionProps {
  showViewAllButton?: boolean;
}

export default function GallerySection({ showViewAllButton = true }: GallerySectionProps) {
  const [activeTab, setActiveTab] = useState("wedding");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentCategory = galleryCategories[activeTab as keyof typeof galleryCategories];

  const handleCategoryChange = (category: string) => {
    if (category === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(category);
      setIsTransitioning(false);
    }, 300);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    
    const images = currentCategory.images;
    let newIndex;
    
    if (direction === "prev") {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    } else {
      newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const openLightbox = (image: string, index: number) => {
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("next"); // RTL layout
      } else if (e.key === "ArrowRight") {
        navigateLightbox("prev"); // RTL layout
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentCategory.images, currentImageIndex]);

  return (
    <>
      {/* Hero Header Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-pink-glow/20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-glow/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 animate-slide-in-bottom">
              <Sparkles className="w-5 h-5 text-primary animate-pulse-slow" />
              <span className="text-primary font-medium">گالری نمونه کارها</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-l from-primary via-accent to-deep-pink bg-clip-text text-transparent">
              آثار هنری ما
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              مجموعه‌ای از بهترین کارهای ما در دسته‌بندی‌های مختلف. هر عکس داستانی منحصر به فرد دارد.
            </p>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-16 bg-background">
        <div className="container">
          {/* Category Pills & View Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(galleryCategories).map(([key, category], index) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={cn(
                    "group relative px-6 py-3 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105",
                    "animate-fade-in",
                    activeTab === key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-card hover:bg-secondary border border-border hover:border-primary/30"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.title}</span>
                  </span>
                  {activeTab === key && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-foreground/50 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 bg-card rounded-xl border border-border">
              <button
                onClick={() => setViewMode("masonry")}
                className={cn(
                  "p-2.5 rounded-lg transition-all duration-300",
                  viewMode === "masonry" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title="نمایش Masonry"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2.5 rounded-lg transition-all duration-300",
                  viewMode === "grid" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title="نمایش Grid"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div 
            className={cn(
              "transition-all duration-500",
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}
          >
            {viewMode === "masonry" ? (
              /* Masonry Layout */
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {currentCategory.images.map((image, index) => (
                  <div
                    key={`${activeTab}-${index}`}
                    className="break-inside-avoid group cursor-pointer animate-zoom-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openLightbox(image, index)}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className={cn(
                        "relative",
                        index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                      )}>
                        <img
                          src={image}
                          alt={`${currentCategory.title} ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                              <div className="p-4 bg-card/95 backdrop-blur-sm rounded-full shadow-xl border border-border">
                                <Camera className="w-8 h-8 text-primary" />
                              </div>
                            </div>
                            <p className="mt-4 text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              مشاهده تصویر
                            </p>
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-full text-sm font-medium text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {currentCategory.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentCategory.images.map((image, index) => (
                  <div
                    key={`${activeTab}-${index}`}
                    className="group cursor-pointer animate-slide-in-bottom"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => openLightbox(image, index)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                      <img
                        src={image}
                        alt={`${currentCategory.title} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-primary-foreground font-medium">{currentCategory.title}</span>
                            <div className="p-2 bg-card/90 backdrop-blur-sm rounded-full">
                              <Camera className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View All Button */}
          {showViewAllButton && (
            <div className="text-center mt-16 animate-fade-in">
              <Button
                onClick={() => (window.location.href = "/gallery")}
                size="lg"
                className="px-10 py-6 text-lg rounded-full transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 bg-gradient-to-l from-primary to-accent"
              >
                <Sparkles className="w-5 h-5 ml-2" />
                مشاهده همه آثار
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImage(null);
          }}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-primary-foreground p-3 rounded-full hover:bg-primary-foreground/10 transition-all duration-300 z-10 group"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8 transition-transform duration-300 group-hover:rotate-90" />
            <span className="sr-only">بستن</span>
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium">
            {currentImageIndex + 1} / {currentCategory.images.length}
          </div>
          
          {/* Navigation - Previous */}
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-foreground p-4 rounded-full hover:bg-primary-foreground/10 transition-all duration-300 z-10 group"
            onClick={() => navigateLightbox("prev")}
          >
            <span className="sr-only">قبلی</span>
            <ChevronRight className="h-10 w-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          
          {/* Main Image */}
          <div className="max-w-6xl max-h-[85vh] overflow-hidden animate-zoom-in">
            <img 
              src={selectedImage} 
              alt="نمایش بزرگ"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
          
          {/* Navigation - Next */}
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-foreground p-4 rounded-full hover:bg-primary-foreground/10 transition-all duration-300 z-10 group"
            onClick={() => navigateLightbox("next")}
          >
            <span className="sr-only">بعدی</span>
            <ChevronLeft className="h-10 w-10 transition-transform duration-300 group-hover:-translate-x-1" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl">
            {currentCategory.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentImageIndex(idx);
                  setSelectedImage(img);
                }}
                className={cn(
                  "w-16 h-16 rounded-xl overflow-hidden transition-all duration-300",
                  idx === currentImageIndex 
                    ? "ring-2 ring-primary-foreground scale-110" 
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}