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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomepageGallery from "@/components/HomepageGallery";
import heroImage from "@/assets/hero-model.jpg";

// ----- Types -----
type PortfolioCategoryKey = "children" | "wedding" | "sport" | "family";

type PortfolioCategory = {
  title: string;
  images: string[];
};

type Testimonial = {
  name: string;
  image: string;
  review: string;
  rating: number;
};

type PricingPlan = {
  title: string;
  price: string;
  features: string[];
  category: PortfolioCategoryKey;
  popular?: boolean;
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

const TESTIMONIALS: Testimonial[] = [
  {
    name: "فاطمه احمدی",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    review:
      "آتلیه نورا بهترین تجربه عکاسی که داشتم. عکس‌های عروسی‌ام فوق‌العاده زیبا شد.",
    rating: 5,
  },
  {
    name: "علی رضایی",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
    review: "عکس‌های خانوادگی ما خیلی طبیعی و زیبا شد. کیفیت کار عالی بود.",
    rating: 5,
  },
  {
    name: "مریم کریمی",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
    review:
      "برای عکس‌های بچه‌ام به آتلیه نورا رفتم و خیلی راضی بودم. حرفه‌ای و دقیق.",
    rating: 5,
  },
];

const PRICING_PLANS: PricingPlan[] = [
  {
    title: "پکیج کودک",
    price: "۲,۵۰۰,۰۰۰",
    features: ["۳۰ عکس ویرایش شده", "۲ ست لباس", "آتلیه لوکس", "چاپ ۱۰ عکس"],
    category: "children",
  },
  {
    title: "پکیج عروس",
    price: "۸,۰۰۰,۰۰۰",
    features: [
      "۱۰۰ عکس ویرایش شده",
      "عکاسی در آتلیه و بیرون",
      "آلبوم لوکس",
      "فیلم کوتاه",
      "لوازم جانبی کامل",
    ],
    category: "wedding",
    popular: true,
  },
  {
    title: "پکیج خانوادگی",
    price: "۴,۰۰۰,۰۰۰",
    features: ["۵۰ عکس ویرایش شده", "عکاسی در آتلیه", "چاپ ۲۰ عکس", "فایل‌های دیجیتال"],
    category: "family",
  },
];

// ----- Component -----
export default function NoraStudio() {
  const [activeCategoryKey, setActiveCategoryKey] = useState<PortfolioCategoryKey>(
    "children"
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [lightboxImageSrc, setLightboxImageSrc] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              className="btn-primary text-lg px-8 py-4 bg-white text-charcoal hover:bg-white/90"
              onClick={() =>
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Camera className="ml-2 h-5 w-5" />
              مشاهده نمونه کارها
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

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in anim-delay-80">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">نظرات مشتریان</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              تجربه‌های واقعی از مشتریان ما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card
                key={`testimonial-${index}`}
                className="bg-white border-2 border-border shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${80 + index * 80}ms`, animationFillMode: "both" }}
              >
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex mb-2">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={`star-${index}-${i}`}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{testimonial.name}</h3>
                    <p className="text-white/90 leading-relaxed text-sm">{testimonial.review}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section bg-gradient-to-b from-white to-soft-pink">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in anim-delay-80">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">پکیج‌های عکاسی</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              انتخاب مناسب برای سلیقه و بودجه شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, index) => (
              <Card
                key={`plan-${index}`}
                className={`bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-300 relative overflow-hidden border-2 hover:-translate-y-2 ${
                  plan.popular ? "border-primary scale-105" : "border-border"
                } animate-fade-in`}
                style={{ 
                  animationDelay: `${100 + index * 80}ms`, 
                  animationFillMode: "both",
                  transform: plan.popular ? 'perspective(1000px) rotateY(0deg)' : 'none'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ محبوب‌ترین
                    </span>
                  </div>
                )}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
                )}
                <CardHeader className="pb-4 pt-8">
                  <CardTitle className="text-2xl text-foreground font-bold text-center">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="mb-8 text-center pb-6 border-b-2 border-border">
                    <span className="text-4xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{plan.price}</span>
                    <span className="text-muted-foreground mr-2 text-lg">تومان</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={`feature-${index}-${i}`} className="flex items-center gap-3 text-foreground">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="w-4 h-4 text-primary fill-primary" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <p className="text-sm text-white font-bold bg-gradient-to-r from-primary to-accent rounded-xl p-4 text-center shadow-md">
                      🎁 تخفیف ویژه رزرو آنلاین
                    </p>
                    <Button 
                      className={`w-full text-lg py-6 rounded-xl font-bold shadow-lg transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:scale-105' 
                          : 'bg-primary hover:bg-primary/90 hover:shadow-xl'
                      }`}
                      onClick={() => (window.location.href = "/booking")}
                    >
                      رزرو این پکیج
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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