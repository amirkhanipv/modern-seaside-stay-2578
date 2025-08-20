import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Calendar, Phone, User, Package, CheckCircle, Clock } from "lucide-react";

interface Booking {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  plan_type: string;
  plan_price: number;
  tracking_code: string;
  status: string;
  called: boolean;
  created_at: string;
}

export default function BookingStatus() {
  const [trackingCode, setTrackingCode] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingCode.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً کد پیگیری را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('tracking_code', trackingCode.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "رزرو یافت نشد",
            description: "کد پیگیری وارد شده صحیح نمی‌باشد",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        setBooking(null);
      } else {
        setBooking(data);
        toast({
          title: "رزرو یافت شد",
          description: "اطلاعات رزرو شما نمایش داده شد"
        });
      }
    } catch (error) {
      toast({
        title: "خطا در جستجو",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlanName = (planType: string) => {
    const plans = {
      children: "پکیج کودک",
      wedding: "پکیج عروس", 
      family: "پکیج خانوادگی"
    };
    return plans[planType as keyof typeof plans] || planType;
  };

  const getStatusBadge = (status: string, called: boolean) => {
    if (called) {
      return <Badge className="bg-green-100 text-green-800">تماس گرفته شد</Badge>;
    }
    
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">تایید شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">در انتظار تماس</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">پیگیری رزرو</h1>
          <p className="text-muted-foreground">
            برای مشاهده وضعیت رزرو خود، کد پیگیری را وارد کنید
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              جستجوی رزرو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="trackingCode">کد پیگیری</Label>
                <Input
                  id="trackingCode"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="مثال: NR123456"
                  className="text-center"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "در حال جستجو..." : "جستجو"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {booking && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>جزئیات رزرو</span>
                {getStatusBadge(booking.status, booking.called)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">نام</p>
                    <p className="font-medium">{booking.first_name} {booking.last_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">شماره تماس</p>
                    <p className="font-medium">{booking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">نوع پکیج</p>
                    <p className="font-medium">{getPlanName(booking.plan_type)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاریخ رزرو</p>
                    <p className="font-medium">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">قیمت:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(booking.plan_price)} تومان
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-secondary/30 rounded-lg p-4">
                {booking.called ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>با شما تماس گرفته شده است. منتظر دیدار شما هستیم!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-700">
                    <Clock className="w-5 h-5" />
                    <span>رزرو شما در انتظار تماس است. به زودی با شما تماس می‌گیریم.</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  onClick={() => window.location.href = "/"} 
                  variant="outline" 
                  className="flex-1"
                >
                  بازگشت به صفحه اصلی
                </Button>
                <Button 
                  onClick={() => window.location.href = "/booking"} 
                  className="flex-1"
                >
                  رزرو جدید
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}