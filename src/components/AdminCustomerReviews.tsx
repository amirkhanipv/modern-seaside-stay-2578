import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Plus, Star, Edit, ImageIcon, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  fetchAllCustomerReviews, 
  createCustomerReview, 
  updateCustomerReview, 
  deleteCustomerReview,
  type CustomerReview 
} from "@/services/customerReviews";

export default function AdminCustomerReviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_name_en: "",
    customer_name_it: "",
    customer_location: "",
    review_text: "",
    review_text_en: "",
    review_text_it: "",
    rating: 5,
    avatar_url: "",
    featured: false,
    display_order: 0,
    active: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomerReviews();
      setReviews(data);
    } catch (error: any) {
      toast({
        title: "خطا در بارگیری نظرات",
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

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_name_en: "",
      customer_name_it: "",
      customer_location: "",
      review_text: "",
      review_text_en: "",
      review_text_it: "",
      rating: 5,
      avatar_url: "",
      featured: false,
      display_order: 0,
      active: true
    });
    setEditingReview(null);
  };

  const handleSubmit = async () => {
    if (!formData.customer_name.trim() || !formData.review_text.trim()) {
      toast({
        title: "خطا",
        description: "نام مشتری و متن نظر الزامی است",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingReview) {
        const updated = await updateCustomerReview(editingReview.id, formData);
        setReviews(prev => prev.map(review => 
          review.id === editingReview.id ? { ...review, ...updated } : review
        ));
        toast({ title: "نظر با موفقیت بروزرسانی شد" });
      } else {
        const newReview = await createCustomerReview(formData);
        setReviews(prev => [newReview, ...prev]);
        toast({ title: "نظر با موفقیت اضافه شد" });
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: editingReview ? "خطا در بروزرسانی نظر" : "خطا در افزودن نظر",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: CustomerReview) => {
    setEditingReview(review);
    setFormData({
      customer_name: review.customer_name,
      customer_name_en: review.customer_name_en || "",
      customer_name_it: review.customer_name_it || "",
      customer_location: review.customer_location || "",
      review_text: review.review_text,
      review_text_en: review.review_text_en || "",
      review_text_it: review.review_text_it || "",
      rating: review.rating,
      avatar_url: review.avatar_url || "",
      featured: review.featured || false,
      display_order: review.display_order || 0,
      active: review.active || true
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      return;
    }

    try {
      await deleteCustomerReview(id);
      setReviews(prev => prev.filter(review => review.id !== id));
      toast({ title: "نظر حذف شد" });
    } catch (error: any) {
      toast({
        title: "خطا در حذف نظر",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
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
      {/* Image Size Guide */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>راهنمای سایز تصاویر:</strong> عکس آواتار نظرات باید حداقل <strong>150×150 پیکسل</strong> و ترجیحاً <strong>مربعی</strong> باشد. فرمت‌های پیشنهادی: JPG یا PNG
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingReview ? "ویرایش نظر" : "افزودن نظر جدید"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">نام مشتری *</label>
              <Input
                placeholder="نام و نام خانوادگی"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">موقعیت مکانی</label>
              <Input
                placeholder="تهران، ایران"
                value={formData.customer_location}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_location: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">امتیاز</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">لینک عکس آواتار</label>
              <Input
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ترتیب نمایش</label>
              <Input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: Number(e.target.value) }))}
              />
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <label className="text-sm font-medium">ویژه</label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <label className="text-sm font-medium">فعال</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">متن نظر *</label>
            <Textarea
              placeholder="متن نظر مشتری..."
              rows={4}
              value={formData.review_text}
              onChange={(e) => setFormData(prev => ({ ...prev, review_text: e.target.value }))}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              <Plus className="h-4 w-4 mr-2" />
              {editingReview ? "بروزرسانی نظر" : "افزودن نظر"}
            </Button>
            {editingReview && (
              <Button variant="outline" onClick={resetForm}>
                انصراف
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>نظرات مشتریان ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {reviews
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
              .map((review) => (
              <div key={review.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      {review.avatar_url ? (
                        <img 
                          src={review.avatar_url} 
                          alt={review.customer_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          بدون عکس
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{review.customer_name}</h3>
                      {review.customer_location && (
                        <p className="text-sm text-muted-foreground">{review.customer_location}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      {review.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">ویژه</span>
                      )}
                      {!review.active && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">غیرفعال</span>
                      )}
                      <span className="bg-muted px-2 py-1 rounded">
                        ترتیب: {review.display_order || 0}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm leading-relaxed">{review.review_text}</p>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                هیچ نظری ثبت نشده است
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}