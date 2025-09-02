import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const galleryCategories = {
  wedding: {
    title: "عروس",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"
    ]
  },
  children: {
    title: "کودک", 
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=800&h=600&fit=crop"
    ]
  },
  sport: {
    title: "اسپرت",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566754219187-f30ba1c0bd5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566844538439-5c1f436b5ea8?w=800&h=600&fit=crop"
    ]
  },
  family: {
    title: "خانوادگی",
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState(galleryCategories.wedding.images);

  useEffect(() => {
    const category = galleryCategories[activeTab as keyof typeof galleryCategories];
    setFilteredImages(category.images);
    setActiveSlideIndex(0);
  }, [activeTab]);

  const goToNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const goToPreviousSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img === selectedImage);
    let newIndex;
    
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]);
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
  }, [selectedImage, filteredImages]);

  return (
    <>
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">گالری آثار</h2>
            <p className="text-muted-foreground">نمونه‌ای از بهترین کارهای ما در دسته‌بندی‌های مختلف</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12 bg-card shadow-lg">
              {Object.entries(galleryCategories).map(([key, category]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 hover:bg-primary/10"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(galleryCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="animate-fade-in">
                <div className="max-w-4xl mx-auto">
                  {/* Main slide */}
                  <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-2xl shadow-2xl">
                    <div 
                      className="flex transition-transform duration-700 ease-in-out h-full"
                      style={{ transform: `translateX(${activeSlideIndex * -100}%)` }}
                    >
                      {category.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img 
                            src={image}
                            alt={`${category.title} ${index + 1}`}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform">
                              <Camera className="w-8 h-8 text-gray-800" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation arrows */}
                    <button 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      onClick={goToPreviousSlide}
                      aria-label="قبلی"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      onClick={goToNextSlide}
                      aria-label="بعدی"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Indicators */}
                  <div className="flex justify-center gap-3 mb-8">
                    {category.images.map((_, index) => (
                      <button
                        key={`${key}-dot-${index}`}
                        className={cn(
                          "transition-all duration-300",
                          index === activeSlideIndex 
                            ? "w-8 h-3 bg-primary rounded-full" 
                            : "w-3 h-3 bg-primary/30 rounded-full hover:bg-primary/50"
                        )}
                        onClick={() => setActiveSlideIndex(index)}
                        aria-label={`رفتن به اسلاید ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Thumbnail grid */}
                  <div className="grid grid-cols-4 gap-4">
                    {category.images.map((image, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105",
                          index === activeSlideIndex 
                            ? "ring-4 ring-primary ring-offset-2 ring-offset-background" 
                            : "hover:shadow-lg"
                        )}
                        onClick={() => {
                          setActiveSlideIndex(index);
                          setTimeout(() => setSelectedImage(image), 100);
                        }}
                      >
                        <img 
                          src={image}
                          alt={`${category.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {showViewAllButton && (
            <div className="text-center mt-12 animate-fade-in anim-delay-160">
              <Button
                onClick={() => (window.location.href = "/gallery")}
                size="lg"
                className="px-8 py-4 text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                مشاهده همه آثار
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <button 
            className="absolute top-6 right-6 text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
            <span className="sr-only">بستن</span>
          </button>
          
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("prev")}
          >
            <span className="sr-only">قبلی</span>
            <ChevronLeft className="h-10 w-10" />
          </button>
          
          <div className="max-w-6xl max-h-[85vh] overflow-hidden animate-scale-in">
            <img 
              src={selectedImage} 
              alt="نمایش بزرگ"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("next")}
          >
            <span className="sr-only">بعدی</span>
            <ChevronRight className="h-10 w-10" />
          </button>
        </div>
      )}
    </>
  );
}