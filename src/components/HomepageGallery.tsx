import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchHomepagePortfolio, type HomepagePortfolio } from "@/services/homepagePortfolio";
import { fetchPortfolioImages, type PortfolioImage } from "@/services/portfolio";

interface HomepagePortfolioWithImage extends HomepagePortfolio {
  portfolio_image: PortfolioImage;
}

interface HomepageGalleryProps {
  showViewAllButton?: boolean;
}

export default function HomepageGallery({ showViewAllButton = true }: HomepageGalleryProps) {
  const [homepageImages, setHomepageImages] = useState<HomepagePortfolioWithImage[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomepagePortfolio = async () => {
      try {
        const [homepageData, allImages] = await Promise.all([
          fetchHomepagePortfolio(),
          fetchPortfolioImages()
        ]);
        
        // Join homepage portfolio with portfolio images
        const joinedData = homepageData.map(item => {
          const image = allImages.find(img => img.id === item.portfolio_image_id);
          return {
            ...item,
            portfolio_image: image || {
              id: '',
              title: 'تصویر یافت نشد',
              image_url: '',
              description: '',
              featured: false,
              category_id: null,
              display_order: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              categories: { id: '', name: '', slug: '' }
            }
          };
        });
        
        setHomepageImages(joinedData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
      } catch (error) {
        console.error('خطا در بارگیری تصاویر صفحه اصلی:', error);
        // Fallback to static data if database fails
        setHomepageImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomepagePortfolio();
  }, []);

  const goToNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % homepageImages.length);
  };

  const goToPreviousSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + homepageImages.length) % homepageImages.length);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    
    const currentIndex = homepageImages.findIndex(item => item.portfolio_image?.image_url === selectedImage);
    let newIndex;
    
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : homepageImages.length - 1;
    } else {
      newIndex = currentIndex < homepageImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(homepageImages[newIndex]?.portfolio_image?.image_url || null);
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
  }, [selectedImage, homepageImages]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (homepageImages.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">گالری آثار</h2>
            <p className="text-muted-foreground">هنوز تصویری در صفحه اصلی انتخاب نشده است</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">گالری آثار</h2>
            <p className="text-muted-foreground">نمونه‌ای از بهترین کارهای ما</p>
          </div>

          <div className="w-full animate-fade-in">
            <div className="max-w-4xl mx-auto">
              {/* Main slide */}
              <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-2xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(${activeSlideIndex * -100}%)` }}
                >
                  {homepageImages.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="w-full h-full flex-shrink-0 relative cursor-pointer group"
                      onClick={() => setSelectedImage(item.portfolio_image?.image_url || null)}
                    >
                      <img 
                        src={item.portfolio_image?.image_url || ''}
                        alt={item.portfolio_image?.title || `تصویر ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm rounded-full p-4 transform group-hover:scale-110 transition-transform border border-border">
                          <Camera className="w-8 h-8 text-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation arrows - Fixed for RTL */}
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 border border-border"
                  onClick={goToPreviousSlide}
                  aria-label="قبلی"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-foreground p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 border border-border"
                  onClick={goToNextSlide}
                  aria-label="بعدی"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex justify-center gap-4 mb-8">
                {homepageImages.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    className={cn(
                      "transition-all duration-500 hover:scale-110",
                      index === activeSlideIndex 
                        ? "w-10 h-3 bg-primary rounded-full shadow-md" 
                        : "w-3 h-3 bg-primary/30 rounded-full hover:bg-primary/60"
                    )}
                    onClick={() => setActiveSlideIndex(index)}
                    aria-label={`رفتن به اسلاید ${index + 1}`}
                  />
                ))}
              </div>

              {/* Thumbnail grid */}
              <div className="grid grid-cols-4 gap-4">
                {homepageImages.map((item, index) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105",
                      index === activeSlideIndex 
                        ? "ring-4 ring-primary ring-offset-2 ring-offset-background" 
                        : "hover:shadow-lg"
                    )}
                    onClick={() => {
                      setActiveSlideIndex(index);
                      setTimeout(() => setSelectedImage(item.portfolio_image?.image_url || null), 100);
                    }}
                  >
                    <img 
                      src={item.portfolio_image?.image_url || ''}
                      alt={item.portfolio_image?.title || `تصویر ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

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
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("prev")}
          >
            <span className="sr-only">قبلی</span>
            <ChevronRight className="h-10 w-10" />
          </button>
          
          <div className="max-w-6xl max-h-[85vh] overflow-hidden animate-scale-in">
            <img 
              src={selectedImage} 
              alt="نمایش بزرگ"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("next")}
          >
            <span className="sr-only">بعدی</span>
            <ChevronLeft className="h-10 w-10" />
          </button>
        </div>
      )}
    </>
  );
}