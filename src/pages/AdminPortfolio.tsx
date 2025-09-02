import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Eye, Trash2 } from "lucide-react";

interface PortfolioImage {
  id: string;
  url: string;
  category: string;
  title: string;
  description?: string;
  featured: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice?: number;
  category: string;
  description: string;
  features: string[];
  active: boolean;
}

const categories = [
  { value: "wedding", label: "عروس" },
  { value: "children", label: "کودک" },
  { value: "sport", label: "اسپرت" },
  { value: "family", label: "خانوادگی" }
];

export default function AdminPortfolio() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Portfolio form states
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageCategory, setImageCategory] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageFeatured, setImageFeatured] = useState(false);
  
  // Pricing form states
  const [planName, setPlanName] = useState("");
  const [planOriginalPrice, setPlanOriginalPrice] = useState("");
  const [planDiscountedPrice, setPlanDiscountedPrice] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");

  // Mock data initialization
  useEffect(() => {
    const mockImages: PortfolioImage[] = [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        category: "wedding",
        title: "عکس عروس کلاسیک",
        featured: true
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
        category: "children",
        title: "پرتره کودک",
        featured: false
      }
    ];

    const mockPlans: PricingPlan[] = [
      {
        id: "1",
        name: "پکیج طلایی عروس",
        originalPrice: 5000000,
        discountedPrice: 4000000,
        category: "wedding",
        description: "پکیج کامل عکاسی عروس",
        features: ["عکاسی 8 ساعته", "ویرایش تمام عکس‌ها", "آلبوم دیجیتال"],
        active: true
      }
    ];

    setImages(mockImages);
    setPlans(mockPlans);
  }, []);

  const handleAddImage = () => {
    if (!imageUrl || !imageTitle || !imageCategory) {
      toast({
        title: "خطا",
        description: "لطفا تمام فیلدهای اجباری را پر کنید",
        variant: "destructive"
      });
      return;
    }

    const newImage: PortfolioImage = {
      id: Date.now().toString(),
      url: imageUrl,
      title: imageTitle,
      category: imageCategory,
      description: imageDescription,
      featured: imageFeatured
    };

    setImages([...images, newImage]);
    setImageUrl("");
    setImageTitle("");
    setImageCategory("");
    setImageDescription("");
    setImageFeatured(false);
    
    toast({
      title: "موفق",
      description: "عکس با موفقیت اضافه شد"
    });
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    toast({
      title: "حذف شد",
      description: "عکس با موفقیت حذف شد"
    });
  };

  const handleAddPlan = () => {
    if (!planName || !planOriginalPrice || !planCategory || !planDescription) {
      toast({
        title: "خطا",
        description: "لطفا تمام فیلدهای اجباری را پر کنید",
        variant: "destructive"
      });
      return;
    }

    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      name: planName,
      originalPrice: parseInt(planOriginalPrice),
      discountedPrice: planDiscountedPrice ? parseInt(planDiscountedPrice) : undefined,
      category: planCategory,
      description: planDescription,
      features: planFeatures.split('\n').filter(f => f.trim()),
      active: true
    };

    setPlans([...plans, newPlan]);
    setPlanName("");
    setPlanOriginalPrice("");
    setPlanDiscountedPrice("");
    setPlanCategory("");
    setPlanDescription("");
    setPlanFeatures("");
    
    toast({
      title: "موفق",
      description: "پلن با موفقیت اضافه شد"
    });
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
    toast({
      title: "حذف شد",
      description: "پلن با موفقیت حذف شد"
    });
  };

  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  return (
    <div className="min-h-screen p-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">مدیریت نمونه کارها و قیمت‌ها</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="portfolio">نمونه کارها</TabsTrigger>
            <TabsTrigger value="pricing">قیمت‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            {/* Add Image Form */}
            <Card>
              <CardHeader>
                <CardTitle>افزودن عکس جدید</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="imageUrl">آدرس عکس *</Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageTitle">عنوان *</Label>
                    <Input
                      id="imageTitle"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      placeholder="عنوان عکس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageCategory">دسته‌بندی *</Label>
                    <Select value={imageCategory} onValueChange={setImageCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="imageDescription">توضیحات</Label>
                    <Input
                      id="imageDescription"
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="توضیحات اختیاری"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={imageFeatured}
                    onChange={(e) => setImageFeatured(e.target.checked)}
                  />
                  <Label htmlFor="featured">عکس ویژه</Label>
                </div>
                <Button onClick={handleAddImage} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  افزودن عکس
                </Button>
              </CardContent>
            </Card>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <Label>فیلتر بر اساس دسته‌بندی:</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه دسته‌ها</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{image.title}</h3>
                      {image.featured && (
                        <Badge variant="secondary">ویژه</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {categories.find(cat => cat.value === image.category)?.label}
                    </p>
                    {image.description && (
                      <p className="text-sm mb-3">{image.description}</p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            {/* Add Plan Form */}
            <Card>
              <CardHeader>
                <CardTitle>افزودن پلن جدید</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planName">نام پلن *</Label>
                    <Input
                      id="planName"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="پکیج طلایی"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planCategory">دسته‌بندی *</Label>
                    <Select value={planCategory} onValueChange={setPlanCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="planOriginalPrice">قیمت اصلی (تومان) *</Label>
                    <Input
                      id="planOriginalPrice"
                      type="number"
                      value={planOriginalPrice}
                      onChange={(e) => setPlanOriginalPrice(e.target.value)}
                      placeholder="5000000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDiscountedPrice">قیمت با تخفیف (تومان)</Label>
                    <Input
                      id="planDiscountedPrice"
                      type="number"
                      value={planDiscountedPrice}
                      onChange={(e) => setPlanDiscountedPrice(e.target.value)}
                      placeholder="4000000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="planDescription">توضیحات *</Label>
                  <Input
                    id="planDescription"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="توضیحات پلن"
                  />
                </div>
                <div>
                  <Label htmlFor="planFeatures">ویژگی‌ها (هر خط یک ویژگی)</Label>
                  <textarea
                    id="planFeatures"
                    value={planFeatures}
                    onChange={(e) => setPlanFeatures(e.target.value)}
                    placeholder="عکاسی 8 ساعته&#10;ویرایش تمام عکس‌ها&#10;آلبوم دیجیتال"
                    className="w-full h-24 p-2 border rounded-md"
                  />
                </div>
                <Button onClick={handleAddPlan} className="w-full">
                  افزودن پلن
                </Button>
              </CardContent>
            </Card>

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? "فعال" : "غیرفعال"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {categories.find(cat => cat.value === plan.category)?.label}
                    </p>
                    <p>{plan.description}</p>
                    
                    <div className="flex items-center gap-2">
                      {plan.discountedPrice ? (
                        <>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(plan.discountedPrice)}
                          </span>
                          <span className="text-lg line-through text-muted-foreground">
                            {formatPrice(plan.originalPrice)}
                          </span>
                          <Badge variant="destructive">
                            {Math.round(((plan.originalPrice - plan.discountedPrice) / plan.originalPrice) * 100)}% تخفیف
                          </Badge>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(plan.originalPrice)}
                        </span>
                      )}
                    </div>

                    {plan.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">ویژگی‌ها:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {plan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف پلن
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}