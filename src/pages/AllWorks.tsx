import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, X, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { fetchCategories, fetchPortfolioImages, type Category, type PortfolioImage } from "@/services/portfolio";

export default function AllWorks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, imagesData] = await Promise.all([
          fetchCategories(),
          fetchPortfolioImages()
        ]);
        setCategories(categoriesData);
        setImages(imagesData);
        if (categoriesData.length > 0) {
          setActiveTab(categoriesData[0].slug);
        }
      } catch (error) {
        console.error('Error loading gallery data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredImages = images.filter(img => img.categories?.slug === activeTab);

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.image_url === selectedImage);
    let newIndex;
    
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]?.image_url || null);
  };

  // Handle keyboard navigation
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-r from-muted/30 to-background overflow-hidden">
        <div className="container relative z-10">
          <div className="mb-6">
            <Button asChild variant="outline" className="bg-card">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                بازگشت به صفحه اصلی
              </Link>
            </Button>
          </div>
          <div className="max-w-3xl mx-auto text-center animate-fade-in anim-delay-80">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              مجموعه کامل آثار
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              نگاهی به تمام دسته‌بندی‌های عکاسی آتلیه نورا
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-muted blur-3xl" />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container">
          {categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">هنوز دسته‌بندی یا تصویری اضافه نشده است.</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={cn(
                "grid w-full max-w-2xl mx-auto mb-12 bg-white shadow-lg border-2 border-border h-auto p-2",
                `grid-cols-${Math.min(categories.length, 4)}`
              )}>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.slug}
                    className="text-lg font-medium py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-300 hover:bg-primary/10 rounded-md"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => {
                const categoryImages = images.filter(img => img.categories?.slug === category.slug);
                return (
                  <TabsContent key={category.id} value={category.slug} className="animate-fade-in">
                    {categoryImages.length === 0 ? (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground">در این دسته‌بندی تصویری وجود ندارد.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categoryImages.map((image, index) => (
                          <div 
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer animate-fade-in hover-scale"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => setSelectedImage(image.image_url)}
                          >
                            <img 
                              src={image.image_url}
                              alt={image.title}
                              className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4">
                                <Camera className="w-6 h-6 text-gray-800" />
                              </div>
                            </div>
                            {/* Title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <p className="text-white text-sm font-medium">{image.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <button 
            className="absolute top-4 right-4 text-white p-3 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">بستن</span>
          </button>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("prev")}
          >
            <span className="sr-only">قبلی</span>
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="max-w-5xl max-h-[80vh] overflow-hidden animate-scale-in">
            <img 
              src={selectedImage} 
              alt="نمایش بزرگ"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => navigateLightbox("next")}
          >
            <span className="sr-only">بعدی</span>
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
