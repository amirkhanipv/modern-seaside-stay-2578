import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Extended gallery images with more items per category
const allWorksImages = {
  wedding: {
    title: "عروس",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525258934283-7f6ca8c4b8e7?w=600&h=600&fit=crop"
    ]
  },
  children: {
    title: "کودک",
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518307117445-f4a9f0e93c8d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612924618369-2ef2d8b8c01e?w=600&h=600&fit=crop"
    ]
  },
  sport: {
    title: "اسپرت",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566754219187-f30ba1c0bd5f?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566844538439-5c1f436b5ea8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566219538388-7844b8a6b49e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518307117445-f4a9f0e93c8d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1553835973-dec43bfb62b0?w=600&h=600&fit=crop"
    ]
  },
  family: {
    title: "خانوادگی",
    images: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566498235407-4e8e97e69b15?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604736193798-ee87f8cc3ddb?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop"
    ]
  }
};

export default function AllWorks() {
  const [activeTab, setActiveTab] = useState("wedding");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState(allWorksImages.wedding.images);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const category = allWorksImages[activeTab as keyof typeof allWorksImages];
    setFilteredImages(category.images);
  }, [activeTab]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-secondary/20 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in anim-delay-80">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              مجموعه کامل آثار
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              نگاهی به تمام دسته‌بندی‌های عکاسی آتلیه نورا
            </p>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="outline"
              className="mb-4"
            >
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
          <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-secondary/50 blur-3xl" />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12 bg-card shadow-lg">
              {Object.entries(allWorksImages).map(([key, category]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:bg-primary/10"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(allWorksImages).map(([key, category]) => (
              <TabsContent key={key} value={key} className="animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {category.images.map((image, index) => (
                    <div 
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer animate-fade-in hover-scale"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image}
                        alt={`${category.title} ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-4">
                          <Camera className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
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