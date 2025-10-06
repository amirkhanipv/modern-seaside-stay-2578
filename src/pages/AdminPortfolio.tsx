import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, Eye, Trash2, Plus, Edit } from "lucide-react";
import {
  fetchCategories,
  fetchPortfolioImages,
  fetchDiscountPlans,
  createCategory,
  createPortfolioImage,
  createDiscountPlan,
  deleteCategory,
  deletePortfolioImage,
  deleteDiscountPlan,
  type Category,
  type PortfolioImage,
  type DiscountPlan
} from "@/services/portfolio";


export default function AdminPortfolio() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [plans, setPlans] = useState<DiscountPlan[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  
  // Category form states
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  
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
  const [planDuration, setPlanDuration] = useState("");
  const [planConditions, setPlanConditions] = useState("");

  // Load data from database
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, imagesData, plansData] = await Promise.all([
        fetchCategories(),
        fetchPortfolioImages(),
        fetchDiscountPlans()
      ]);
      
      setCategories(categoriesData);
      setImages(imagesData);
      setPlans(plansData);
    } catch (error: any) {
      toast({
        title: "خطا در بارگیری داده‌ها",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName || !categorySlug) {
      toast({
        title: "خطا",
        description: "لطفا نام و شناسه دسته‌بندی را پر کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      const newCategory = await createCategory({
        name: categoryName,
        slug: categorySlug,
        description: categoryDescription
      });

      setCategories([...categories, newCategory]);
      setCategoryName("");
      setCategorySlug("");
      setCategoryDescription("");
      
      toast({
        title: "موفق",
        description: "دسته‌بندی با موفقیت اضافه شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast({
        title: "حذف شد",
        description: "دسته‌بندی با موفقیت حذف شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const handleAddImage = async () => {
    if (!imageUrl || !imageTitle || !imageCategory) {
      toast({
        title: "خطا",
        description: "لطفا تمام فیلدهای اجباری را پر کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      const newImage = await createPortfolioImage({
        image_url: imageUrl,
        title: imageTitle,
        category_id: imageCategory,
        description: imageDescription,
        featured: imageFeatured,
        display_order: 0
      });

      setImages([newImage, ...images]);
      setImageUrl("");
      setImageTitle("");
      setImageCategory("");
      setImageDescription("");
      setImageFeatured(false);
      
      toast({
        title: "موفق",
        description: "عکس با موفقیت اضافه شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('آیا از حذف این عکس اطمینان دارید؟')) {
      return;
    }

    try {
      await deletePortfolioImage(id);
      setImages(images.filter(img => img.id !== id));
      toast({
        title: "حذف شد",
        description: "عکس با موفقیت حذف شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const handleAddPlan = async () => {
    if (!planName || !planOriginalPrice || !planCategory || !planDescription) {
      toast({
        title: "خطا",
        description: "لطفا تمام فیلدهای اجباری را پر کنید",
        variant: "destructive"
      });
      return;
    }

    try {
      const newPlan = await createDiscountPlan({
        plan_name: planName,
        price: parseFloat(planOriginalPrice),
        category_id: planCategory,
        description: planDescription,
        duration_months: planDuration ? parseInt(planDuration) : undefined,
        is_active: true
      });

      setPlans([newPlan, ...plans]);
      setPlanName("");
      setPlanOriginalPrice("");
      setPlanDiscountedPrice("");
      setPlanCategory("");
      setPlanDescription("");
      setPlanFeatures("");
      setPlanDuration("");
      setPlanConditions("");
      
      toast({
        title: "موفق",
        description: "پلن با موفقیت اضافه شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('آیا از حذف این پلن اطمینان دارید؟')) {
      return;
    }

    try {
      await deleteDiscountPlan(id);
      setPlans(plans.filter(plan => plan.id !== id));
      toast({
        title: "حذف شد",
        description: "پلن با موفقیت حذف شد"
      });
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive"
      });
    }
  };

  const filteredImages = selectedCategory === "all" 
    ? images 
    : images.filter(img => img.category_id === selectedCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 animate-fade-in flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">مدیریت نمونه کارها و قیمت‌ها</h1>
          <Button variant="outline" onClick={() => window.location.href = '/admin'}>
            بازگشت به داشبورد
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
            <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
            <TabsTrigger value="portfolio">نمونه کارها</TabsTrigger>
            <TabsTrigger value="pricing">قیمت‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            {/* Add Category Form */}
            <Card>
              <CardHeader>
                <CardTitle>افزودن دسته‌بندی جدید</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryName">نام دسته‌بندی *</Label>
                    <Input
                      id="categoryName"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="عروس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categorySlug">شناسه (انگلیسی) *</Label>
                    <Input
                      id="categorySlug"
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      placeholder="wedding"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="categoryDescription">توضیحات</Label>
                  <Input
                    id="categoryDescription"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    placeholder="توضیحات دسته‌بندی"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  افزودن دسته‌بندی
                </Button>
              </CardContent>
            </Card>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">شناسه: {category.slug}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {category.description && (
                      <p className="text-sm">{category.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

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
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
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
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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
                      src={image.image_url} 
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
                      {image.categories?.name || 'نامشخص'}
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
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planDuration">مدت اعتبار (روز)</Label>
                    <Input
                      id="planDuration"
                      type="number"
                      value={planDuration}
                      onChange={(e) => setPlanDuration(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planConditions">شرایط</Label>
                    <Input
                      id="planConditions"
                      value={planConditions}
                      onChange={(e) => setPlanConditions(e.target.value)}
                      placeholder="قابل استفاده تا پایان ماه"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="planFeatures">ویژگی‌ها (هر خط یک ویژگی)</Label>
                  <Textarea
                    id="planFeatures"
                    value={planFeatures}
                    onChange={(e) => setPlanFeatures(e.target.value)}
                    placeholder="عکاسی 8 ساعته&#10;ویرایش تمام عکس‌ها&#10;آلبوم دیجیتال"
                    className="h-24"
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
                      <CardTitle className="text-xl">{plan.plan_name}</CardTitle>
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? "فعال" : "غیرفعال"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {plan.categories?.name || 'نامشخص'}
                    </p>
                    <p>{plan.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(plan.price)}
                      </span>
                    </div>

                    {/* Additional plan details */}
                    {plan.duration_months && (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>مدت اعتبار: {plan.duration_months} ماه</p>
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