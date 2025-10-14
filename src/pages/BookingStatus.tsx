import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Phone, User, Package, CheckCircle, Clock, Home } from "lucide-react";

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
  const navigate = useNavigate();

  // Real-time updates for booking status
  useEffect(() => {
    if (!booking) return;

    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${booking.id}`
        },
        (payload) => {
          console.log('Booking updated:', payload);
          if (payload.new) {
            const updatedBooking = payload.new as Booking;
            setBooking(updatedBooking);
            
            // Show specific notification based on what changed
            if (updatedBooking.called !== booking.called) {
              toast({
                title: updatedBooking.called ? "تماس گرفته شد!" : "وضعیت تماس تغییر کرد",
                description: updatedBooking.called 
                  ? "با شما تماس گرفته شده است. منتظر دیدار شما هستیم!" 
                  : "وضعیت تماس به‌روزرسانی شد"
              });
            } else if (updatedBooking.status !== booking.status) {
              toast({
                title: "وضعیت رزرو تغییر کرد",
                description: `وضعیت جدید: ${updatedBooking.status === 'confirmed' ? 'تایید شده' : 'در انتظار'}`
              });
            } else {
              toast({
                title: "وضعیت رزرو به‌روزرسانی شد",
                description: "اطلاعات جدید رزرو دریافت شد"
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking, toast]);

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
      return <Badge className="bg-green-100 text-green-800 border-green-300">✅ تماس گرفته شد</Badge>;
    }
    
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">تایید شده</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⏳ در انتظار تماس</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
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
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in anim-delay-80">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">پیگیری رزرو</h1>
          <p className="text-muted-foreground leading-relaxed">
            برای مشاهده وضعیت رزرو خود، کد پیگیری را وارد کنید
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 animate-fade-in anim-delay-120 bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Search className="w-5 h-5 text-primary" />
              جستجوی رزرو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingCode" className="text-foreground">کد پیگیری</Label>
                <Input
                  id="trackingCode"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="مثال: NR123456"
                  className="text-center bg-background border-4 border-gray-300 text-foreground text-lg py-3"
                />
              </div>
              <Button type="submit" className="w-full btn-primary py-3" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    در حال جستجو...
                  </>
                ) : (
                  <>
                    <Search className="ml-2 h-4 w-4" />
                    جستجو
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {booking && (
          <Card className="animate-fade-in anim-delay-160 bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  جزئیات رزرو
                </span>
                {getStatusBadge(booking.status, booking.called)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">نام</p>
                    <p className="font-medium text-foreground">{booking.first_name} {booking.last_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">شماره تماس</p>
                    <p className="font-medium text-foreground">{booking.phone}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                  <Package className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">نوع پکیج</p>
                    <p className="font-medium text-foreground">{getPlanName(booking.plan_type)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">تاریخ رزرو</p>
                    <p className="font-medium text-foreground">{formatDate(booking.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-foreground">قیمت:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(booking.plan_price)} تومان
                  </span>
                </div>
              </div>

              {/* Status Message */}
              <div className={`rounded-lg p-6 border ${
                booking.called 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                {booking.called ? (
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">رزرو شما تایید شد!</p>
                      <p className="text-sm">با شما تماس گرفته شده است. منتظر دیدار شما هستیم!</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-yellow-700">
                    <Clock className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">رزرو شما در انتظار تماس است</p>
                      <p className="text-sm">به زودی با شما تماس می‌گیریم. لطفاً منتظر بمانید.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      navigate("/");
                    }} 
                    variant="outline" 
                    className="flex-1 bg-card"
                  >
                  <Home className="ml-2 h-4 w-4" />
                  بازگشت به صفحه اصلی
                </Button>
                <Button 
                  onClick={() => {
                    setBooking(null);
                    setTrackingCode("");
                  }} 
                  className="flex-1 btn-primary"
                >
                  جستجوی رزرو جدید
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!booking && (
          <Card className="mt-8 animate-fade-in anim-delay-200 bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">راهنما</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• کد پیگیری در زمان رزرو به شما ارائه شده است</li>
                <li>• کد پیگیری با حروف NR شروع می‌شود</li>
                <li>• در صورت فراموشی کد، با شماره تماس ۰۹۹۹۹۹۹۹۹۹۹ تماس بگیرید</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}