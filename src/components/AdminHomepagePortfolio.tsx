import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Plus, ArrowUpDown } from "lucide-react";
import { 
  fetchHomepagePortfolio, 
  addToHomepagePortfolio, 
  removeFromHomepagePortfolio, 
  updateHomepagePortfolioOrder,
  type HomepagePortfolio 
} from "@/services/homepagePortfolio";
import { fetchPortfolioImages, type PortfolioImage } from "@/services/portfolio";

interface HomepagePortfolioWithImage extends HomepagePortfolio {
  portfolio_image: PortfolioImage;
}

export default function AdminHomepagePortfolio() {
  const [homepageItems, setHomepageItems] = useState<HomepagePortfolioWithImage[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [homepageData, imagesData] = await Promise.all([
        fetchHomepagePortfolio(),
        fetchPortfolioImages()
      ]);
      
      // Join homepage portfolio with portfolio images
      const joinedData = homepageData.map(item => {
        const image = imagesData.find(img => img.id === item.portfolio_image_id);
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
      
      setHomepageItems(joinedData);
      setPortfolioImages(imagesData);
    } catch (error: any) {
      toast({
        title: "خطا در بارگیری داده‌ها",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToHomepage = async () => {
    if (!selectedImageId) {
      toast({
        title: "خطا",
        description: "لطفاً یک تصویر انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    try {
      const newItem = await addToHomepagePortfolio(selectedImageId, displayOrder);
      const image = portfolioImages.find(img => img.id === selectedImageId);
      setHomepageItems(prev => [...prev, {
        ...newItem,
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
      }]);
      setSelectedImageId("");
      setDisplayOrder(0);
      toast({ title: "تصویر به صفحه اصلی اضافه شد" });
    } catch (error: any) {
      toast({
        title: "خطا در افزودن تصویر",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromHomepage = async (id: string) => {
    if (!confirm('آیا از حذف این تصویر از صفحه اصلی اطمینان دارید؟')) {
      return;
    }

    try {
      await removeFromHomepagePortfolio(id);
      setHomepageItems(prev => prev.filter(item => item.id !== id));
      toast({ title: "تصویر از صفحه اصلی حذف شد" });
    } catch (error: any) {
      toast({
        title: "خطا در حذف تصویر",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const updatedItem = await updateHomepagePortfolioOrder(id, newOrder);
      setHomepageItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
      toast({ title: "ترتیب نمایش بروزرسانی شد" });
    } catch (error: any) {
      toast({
        title: "خطا در بروزرسانی ترتیب",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            افزودن تصویر به صفحه اصلی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">انتخاب تصویر</label>
              <Select value={selectedImageId} onValueChange={setSelectedImageId}>
                <SelectTrigger>
                  <SelectValue placeholder="یک تصویر انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioImages.map((image) => (
                    <SelectItem key={image.id} value={image.id}>
                      {image.title} - {image.categories?.name || 'بدون دسته‌بندی'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ترتیب نمایش</label>
              <Input
                type="number"
                placeholder="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min="0"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddToHomepage} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                افزودن به صفحه اصلی
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تصاویر صفحه اصلی ({homepageItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {homepageItems
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
              .map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.portfolio_image?.image_url ? (
                    <img 
                      src={item.portfolio_image.image_url} 
                      alt={item.portfolio_image.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      بدون تصویر
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.portfolio_image?.title || 'بدون عنوان'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.portfolio_image?.categories?.name || 'بدون دسته‌بندی'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      ترتیب: {item.display_order || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={item.display_order || 0}
                      onChange={(e) => {
                        const newOrder = Number(e.target.value);
                        handleUpdateOrder(item.id, newOrder);
                      }}
                      className="w-20 h-8"
                      min="0"
                    />
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFromHomepage(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {homepageItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                هیچ تصویری در صفحه اصلی نمایش داده نمی‌شود
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}