import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Camera,
  Instagram,
  Phone,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  X,
  Quote,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomepageGallery from "@/components/HomepageGallery";
import heroImage from "@/assets/hero-model.jpg";
import { fetchCustomerReviews, type CustomerReview } from "@/services/customerReviews";
import { fetchDiscountPlans, type DiscountPlan } from "@/services/portfolio";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

// ----- Types -----
type PortfolioCategoryKey = "children" | "wedding" | "sport" | "family";

type PortfolioCategory = {
  title: string;
  images: string[];
};

// ----- Static Content (same data, structured more clearly) -----
const PORTFOLIO_CATEGORIES: Record<PortfolioCategoryKey, PortfolioCategory> = {
  children: {
    title: "کودک",
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400&h=400&fit=crop",
    ],
  },
  wedding: {
    title: "عروس",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop",
    ],
  },
  sport: {
    title: "اسپرت",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1566754219187-f30ba1c0bd5f?w=400&h=400&fit=crop",
    ],
  },
  family: {
    title: "خانوادگی",
    images: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop",
    ],
  },
};

// ----- Component -----
export default function NoraStudio() {
  const [activeCategoryKey, setActiveCategoryKey] = useState<PortfolioCategoryKey>(
    "children"
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [lightboxImageSrc, setLightboxImageSrc] = useState<string | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [pricingPlans, setPricingPlans] = useState<DiscountPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewSelectedIndex, setReviewSelectedIndex] = useState(0);

  // Embla carousel for reviews
  const [reviewEmblaRef, reviewEmblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      direction: "rtl"
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const scrollReviewPrev = useCallback(() => {
    if (reviewEmblaApi) reviewEmblaApi.scrollPrev();
  }, [reviewEmblaApi]);

  const scrollReviewNext = useCallback(() => {
    if (reviewEmblaApi) reviewEmblaApi.scrollNext();
  }, [reviewEmblaApi]);

  const onReviewSelect = useCallback(() => {
    if (!reviewEmblaApi) return;
    setReviewSelectedIndex(reviewEmblaApi.selectedScrollSnap());
  }, [reviewEmblaApi]);

  useEffect(() => {
    if (!reviewEmblaApi) return;
    onReviewSelect();
    reviewEmblaApi.on('select', onReviewSelect);
    return () => {
      reviewEmblaApi.off('select', onReviewSelect);
    };
  }, [reviewEmblaApi, onReviewSelect]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Load data from database
    const loadData = async () => {
      try {
        const [reviewsData, plansData] = await Promise.all([
          fetchCustomerReviews(),
          fetchDiscountPlans()
        ]);
        setReviews(reviewsData);
        setPricingPlans(plansData.filter(p => p.is_active));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Reset slide index on tab change
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [activeCategoryKey]);

  const activeCategory = useMemo(
    () => PORTFOLIO_CATEGORIES[activeCategoryKey],
    [activeCategoryKey]
  );
  const activeCategoryImageCount = activeCategory.images.length;

  const goToNextSlide = useCallback(() => {
    setActiveSlideIndex((prev) => (prev + 1) % activeCategoryImageCount);
  }, [activeCategoryImageCount]);

  const goToPreviousSlide = useCallback(() => {
    setActiveSlideIndex(
      (prev) => (prev - 1 + activeCategoryImageCount) % activeCategoryImageCount
    );
  }, [activeCategoryImageCount]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in anim-delay-60">
            آتلیه نورا
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in anim-delay-120">
            لحظه‌های خاص شما در قاب هنر
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in anim-delay-180">
            <Button
              className="text-lg px-8 py-4 bg-white hover:bg-white/95 border border-white/40 transition-all duration-300"
              onClick={() =>
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{ color: '#000000' }}
            >
              <Camera className="ml-2 h-5 w-5" style={{ color: '#000000' }} />
              <span style={{ color: '#000000' }}>مشاهده نمونه کارها</span>
            </Button>
            <Button
              className="text-lg px-8 py-4 bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
              onClick={() => (window.location.href = "/booking")}
            >
              رزرو نوبت
            </Button>
            <Button
              className="text-lg px-8 py-4 bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm"
              onClick={() => (window.location.href = "/booking-status")}
            >
              پیگیری رزرو
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <HomepageGallery />

      {/* Testimonials - Slideshow Style */}
      {reviews.length > 0 && (
        <section className="section bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 overflow-hidden relative">
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container relative z-10">
            <div className="text-center mb-14 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Quote className="h-4 w-4" />
                <span className="text-sm font-medium">نظرات مشتریان</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">تجربه‌های واقعی</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                آنچه مشتریان ما درباره خدمات نورا استودیو می‌گویند
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                onClick={scrollReviewPrev}
                className="absolute right-0 md:-right-6 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl h-12 w-12"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={scrollReviewNext}
                className="absolute left-0 md:-left-6 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl h-12 w-12"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Carousel Container */}
              <div className="overflow-hidden mx-8 md:mx-0" ref={reviewEmblaRef}>
                <div className="flex gap-6">
                  {reviews.map((review, index) => (
                    <div 
                      key={review.id} 
                      className="flex-shrink-0 w-full md:w-[calc(60%-12px)] lg:w-[calc(50%-12px)]"
                    >
                      <div 
                        className={cn(
                          "group relative overflow-hidden rounded-2xl transition-all duration-700 bg-card border border-border",
                          index === reviewSelectedIndex 
                            ? "shadow-2xl shadow-primary/20 scale-100" 
                            : "shadow-lg scale-95 opacity-70"
                        )}
                      >
                        {/* Review content */}
                        <div className="p-8 text-center">
                          {/* Quote decoration */}
                          <div className="absolute top-4 right-4 opacity-10">
                            <Quote className="h-16 w-16 text-primary" />
                          </div>
                          
                          {/* Rating Stars */}
                          <div className="flex justify-center mb-5 gap-1">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className="h-5 w-5 text-yellow-400 fill-current drop-shadow-sm" 
                              />
                            ))}
                          </div>

                          {/* Review Text */}
                          <blockquote className="text-lg text-foreground/90 mb-6 leading-relaxed relative z-10">
                            <span className="text-primary/70 text-xl">"</span>
                            {review.review_text}
                            <span className="text-primary/70 text-xl">"</span>
                          </blockquote>

                          {/* Divider */}
                          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-5" />

                          {/* Customer Info - Smaller */}
                          <div className="flex items-center justify-center gap-3">
                            {review.avatar_url ? (
                              <img 
                                src={review.avatar_url} 
                                alt={review.customer_name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">
                                  {review.customer_name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="text-right">
                              <div className="font-bold text-foreground">
                                {review.customer_name}
                              </div>
                              {review.customer_location && (
                                <div className="text-xs text-muted-foreground">
                                  {review.customer_location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-10 gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-500",
                      index === reviewSelectedIndex 
                        ? "bg-gradient-to-r from-primary to-primary/70 w-10 shadow-lg shadow-primary/30" 
                        : "bg-muted-foreground/20 hover:bg-primary/40 w-2.5"
                    )}
                    onClick={() => reviewEmblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Plans */}
      {pricingPlans.length > 0 && (
        <section className="section bg-gradient-to-b from-white to-soft-pink">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in anim-delay-80">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">پکیج‌های عکاسی</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                انتخاب مناسب برای سلیقه و بودجه شما
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {pricingPlans.map((plan, index) => (
                <div
                  key={`plan-${plan.id}`}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${100 + index * 80}ms`, 
                    animationFillMode: "both"
                  }}
                >
                  <Card
                    className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 relative hover:-translate-y-2 h-full flex flex-col border-2 border-border rounded-2xl"
                  >
                    <CardHeader className="pb-4 pt-8 relative z-10">
                      <CardTitle className="text-2xl text-foreground font-bold text-center">{plan.plan_name}</CardTitle>
                      {plan.duration_months && (
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          <Clock className="inline-block w-4 h-4 ml-1" />
                          مدت اعتبار: {plan.duration_months} ماه
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 pt-4 flex-1 flex flex-col relative z-10">
                      <div className="mb-6 text-center pb-6 border-b-2 border-border">
                        <span className="text-4xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{formatPrice(plan.price)}</span>
                        <span className="text-muted-foreground mr-2 text-lg">تومان</span>
                      </div>
                      
                      {plan.description && (
                        <p className="text-muted-foreground text-sm mb-4 text-center leading-relaxed">
                          {plan.description}
                        </p>
                      )}
                      
                      {/* Features List */}
                      {plan.features && (
                        <ul className="space-y-2 mb-6">
                          {plan.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="space-y-3 mt-auto">
                        <span className="block text-xs text-muted-foreground font-medium bg-muted/50 rounded-lg p-2 text-center border border-border/50">
                          🎁 تخفیف ویژه رزرو آنلاین
                        </span>
                        <Button
                          className="w-full text-lg py-6 rounded-xl font-bold shadow-lg transition-all duration-300 bg-primary hover:bg-primary/90 hover:shadow-xl"
                          onClick={() => (window.location.href = "/booking")}
                        >
                          رزرو این پکیج
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in anim-delay-80">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">تماس با ما</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Phone & Address */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Phone className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">تماس تلفنی</h3>
              <a
                href="tel:09999999999"
                className="inline-flex items-center bg-blue-600 text-white rounded-xl px-4 py-2 hover:bg-blue-700 hover:shadow-lg transition-all duration-300 mb-4 text-sm font-bold"
              >
                <Phone className="ml-1 h-4 w-4" />
                <span className="font-medium">۰۹۹۹۹۹۹۹۹۹۹</span>
              </a>

              <div className="space-y-2 text-foreground text-sm border-t-2 border-blue-200 pt-4 mt-4">
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 ml-1 text-blue-600" />
                  <span>تهران، خیابان مثال، پلاک ۱۲</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 ml-1 text-blue-600" />
                  <span>همه روزه از ۱۰ صبح تا ۱۹</span>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">واتساپ</h3>
              <a
                href="https://wa.me/989999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 text-white rounded-xl px-4 py-2 hover:bg-green-700 hover:shadow-lg transition-all duration-300 mb-4 text-sm font-bold"
              >
                <MessageCircle className="ml-1 h-4 w-4" />
                <span className="font-medium">پیام واتساپ</span>
              </a>
              <p className="text-foreground text-sm leading-relaxed border-t-2 border-green-200 pt-4 mt-4">
                برای مشاوره سریع و رزرو آنلاین در واتساپ با ما در تماس باشید
              </p>
            </div>

            {/* Telegram */}
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-6 text-center border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Send className="w-10 h-10 text-sky-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">تلگرام</h3>
              <a
                href="https://t.me/NoraStudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-sky-600 text-white rounded-xl px-4 py-2 hover:bg-sky-700 hover:shadow-lg transition-all duration-300 mb-4 text-sm font-bold"
              >
                <Send className="ml-1 h-4 w-4" />
                <span className="font-medium">@NoraStudio</span>
              </a>
              <p className="text-foreground text-sm leading-relaxed border-t-2 border-sky-200 pt-4 mt-4">
                برای چت و مشاوره سریع در تلگرام با ما در ارتباط باشید
              </p>
            </div>

            {/* Instagram */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <Instagram className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-3 text-foreground">اینستاگرام</h3>
              <a
                href="https://instagram.com/Nora_Stu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:shadow-lg transition-all duration-300 mb-4 text-sm font-bold"
              >
                <Instagram className="ml-1 h-4 w-4" />
                <span className="font-medium">Nora_Stu</span>
              </a>
              <p className="text-foreground text-sm leading-relaxed border-t-2 border-purple-200 pt-4 mt-4">
                نمونه‌کارهای روزانه و آخرین اخبار آتلیه را دنبال کنید
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}