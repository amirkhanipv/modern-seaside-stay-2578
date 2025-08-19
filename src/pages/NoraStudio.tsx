import { useState, useEffect } from "react";
import { Camera, Instagram, Phone, Star, Users, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-model.jpg";

export default function NoraStudio() {
  const [activeTab, setActiveTab] = useState("children");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioCategories = {
    children: {
      title: "کودک",
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400&h=400&fit=crop"
      ]
    },
    wedding: {
      title: "عروس",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=400&fit=crop"
      ]
    },
    sport: {
      title: "اسپرت",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1594736797933-d0ed94ac1274?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566754219187-f30ba1c0bd5f?w=400&h=400&fit=crop"
      ]
    },
    family: {
      title: "خانوادگی",
      images: [
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop"
      ]
    }
  };

  const testimonials = [
    {
      name: "فاطمه احمدی",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      review: "آتلیه نورا بهترین تجربه عکاسی که داشتم. عکس‌های عروسی‌ام فوق‌العاده زیبا شد.",
      rating: 5
    },
    {
      name: "علی رضایی", 
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
      review: "عکس‌های خانوادگی ما خیلی طبیعی و زیبا شد. کیفیت کار عالی بود.",
      rating: 5
    },
    {
      name: "مریم کریمی",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop", 
      review: "برای عکس‌های بچه‌ام به آتلیه نورا رفتم و خیلی راضی بودم. حرفه‌ای و دقیق.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      title: "پکیج کودک",
      price: "۲,۵۰۰,۰۰۰",
      features: [
        "۳۰ عکس ویرایش شده",
        "۲ ست لباس",
        "آتلیه لوکس",
        "چاپ ۱۰ عکس"
      ],
      category: "children"
    },
    {
      title: "پکیج عروس",
      price: "۸,۰۰۰,۰۰۰",
      features: [
        "۱۰۰ عکس ویرایش شده",
        "عکاسی در آتلیه و بیرون",
        "آلبوم لوکس",
        "فیلم کوتاه",
        "لوازم جانبی کامل"
      ],
      category: "wedding",
      popular: true
    },
    {
      title: "پکیج خانوادگی",
      price: "۴,۰۰۰,۰۰۰",
      features: [
        "۵۰ عکس ویرایش شده",
        "عکاسی در آتلیه",
        "چاپ ۲۰ عکس",
        "فایل‌های دیجیتال"
      ],
      category: "family"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              آتلیه نورا
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              لحظه‌های خاص شما در قاب هنر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary text-lg px-8 py-4" onClick={() => window.location.href = '#portfolio'}>
                <Camera className="ml-2 h-5 w-5" />
                مشاهده نمونه‌کارها
              </Button>
              <Button variant="outline" className="text-lg px-8 py-4 border-white/80 text-white bg-black/20 backdrop-blur-sm hover:bg-white hover:text-black" onClick={() => window.location.href = '/booking'}>
                رزرو آنلاین
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="section bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">نمونه کارها</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              مجموعه‌ای از بهترین عکس‌های ما در زمینه‌های مختلف عکاسی
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-12 bg-white/50 backdrop-blur-sm">
              {Object.entries(portfolioCategories).map(([key, category]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(portfolioCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {category.images.map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 persian-shadow"
                    >
                      <img 
                        src={image}
                        alt={`${category.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">نظرات مشتریان</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              تجربه مشتریان ما از کار با آتلیه نورا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card overflow-hidden">
                <div className="relative">
                  <img 
                    src={testimonial.image}
                    alt={`نمونه کار ${testimonial.name}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{testimonial.name}</h4>
                    <p className="text-gray-200 leading-relaxed">
                      "{testimonial.review}"
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="section bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">پکیج‌های عکاسی</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              پکیج‌های متنوع برای تمام نیازهای عکاسی شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-card relative ${plan.popular ? 'border-primary border-2' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    محبوب‌ترین
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground mr-2">تومان</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Heart className="w-5 h-5 text-primary ml-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3">
                    <p className="text-sm text-white font-medium bg-primary rounded-lg p-3 text-center">
                      تخفیف ویژه به دلیل رزرو از سایت
                    </p>
                    <Button className="w-full btn-primary" onClick={() => window.location.href = '/booking'}>
                      رزرو آنلاین
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">تماس با ما</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="tel:09999999999"
                className="flex items-center bg-primary text-white rounded-xl px-8 py-4 hover:shadow-lg transition-all duration-300"
              >
                <Phone className="ml-3 h-6 w-6" />
                <span className="text-lg font-medium">۰۹۹۹۹۹۹۹۹۹۹</span>
              </a>
              <a 
                href="https://instagram.com/Nora_Stu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-8 py-4 hover:shadow-lg transition-all duration-300"
              >
                <Instagram className="ml-3 h-6 w-6" />
                <span className="text-lg font-medium">Nora_Stu</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}