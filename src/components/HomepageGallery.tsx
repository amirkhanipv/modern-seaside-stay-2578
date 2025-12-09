import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchHomepagePortfolio, type HomepagePortfolio } from "@/services/homepagePortfolio";
import { fetchPortfolioImages, type PortfolioImage } from "@/services/portfolio";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface HomepagePortfolioWithImage extends HomepagePortfolio {
  portfolio_image: PortfolioImage;
}

interface HomepageGalleryProps {
  showViewAllButton?: boolean;
}

export default function HomepageGallery({ showViewAllButton = true }: HomepageGalleryProps) {
  const [homepageImages, setHomepageImages] = useState<HomepagePortfolioWithImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Embla carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      direction: "rtl"
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

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
        setHomepageImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadHomepagePortfolio();
  }, []);

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
      <section id="portfolio" className="py-20 bg-white">
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
      <section id="portfolio" className="py-20 bg-white">
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
      <section id="portfolio" className="py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">نمونه کارها</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">گالری آثار</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">نمونه‌ای از بهترین کارهای ما در نورا استودیو</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl h-12 w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl h-12 w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Carousel Container */}
            <div className="overflow-hidden mx-8 md:mx-0" ref={emblaRef}>
              <div className="flex gap-6">
                {homepageImages.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex-shrink-0 w-full md:w-[calc(60%-12px)] lg:w-[calc(50%-12px)]"
                  >
                    <div 
                      className={cn(
                        "group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer transition-all duration-700",
                        index === selectedIndex 
                          ? "shadow-2xl shadow-primary/20 scale-100" 
                          : "shadow-lg scale-95 opacity-70"
                      )}
                      onClick={() => setSelectedImage(item.portfolio_image?.image_url || null)}
                    >
                      <img 
                        src={item.portfolio_image?.image_url || ''}
                        alt={item.portfolio_image?.title || `تصویر ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white font-bold text-xl mb-1">{item.portfolio_image?.title}</h3>
                        {item.portfolio_image?.description && (
                          <p className="text-white/80 text-sm line-clamp-2">{item.portfolio_image?.description}</p>
                        )}
                      </div>
                      
                      {/* Camera icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-500 shadow-lg">
                          <Camera className="w-8 h-8 text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-10 gap-2">
              {homepageImages.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-500",
                    index === selectedIndex 
                      ? "bg-gradient-to-r from-primary to-primary/70 w-10 shadow-lg shadow-primary/30" 
                      : "bg-muted-foreground/20 hover:bg-primary/40 w-2.5"
                  )}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`رفتن به اسلاید ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Thumbnail preview */}
            <div className="flex justify-center gap-3 mt-8">
              {homepageImages.slice(0, 6).map((item, index) => (
                <button
                  key={`thumb-${item.id}`}
                  className={cn(
                    "w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 ring-2 ring-offset-2 ring-offset-background",
                    index === selectedIndex 
                      ? "ring-primary scale-110 shadow-lg" 
                      : "ring-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  )}
                  onClick={() => emblaApi?.scrollTo(index)}
                >
                  <img 
                    src={item.portfolio_image?.image_url || ''}
                    alt={item.portfolio_image?.title || `تصویر ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {showViewAllButton && (
            <div className="text-center mt-14 animate-fade-in">
              <Button
                onClick={() => (window.location.href = "/gallery")}
                size="lg"
                className="px-10 py-5 text-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Sparkles className="ml-2 h-5 w-5" />
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