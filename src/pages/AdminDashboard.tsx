import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { fetchBookings as apiFetchBookings, updateBookingCalled, updateBookingStatus, deleteBookingById, type Booking } from "@/services/bookings";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_REMEMBER_KEY = "admin_remembered";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    const remembered = localStorage.getItem(ADMIN_REMEMBER_KEY);
    if (remembered === "true") {
      setIsAuthenticated(true);
      loadBookings();
    }
  }, []);

  const handleLogin = async () => {
    if (password === "dorsa") {
      setIsAuthenticated(true);
      if (rememberMe) localStorage.setItem(ADMIN_REMEMBER_KEY, "true");
      await loadBookings();
    } else {
      toast({
        title: "ورود ناموفق",
        description: "رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem(ADMIN_REMEMBER_KEY);
  };

  const loadBookings = async () => {
    try {
      const data = await apiFetchBookings();
      setBookings(data);
    } catch (error: any) {
      toast({
        title: "خطا در بارگیری رزروها",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const toggleCalled = async (id: string, called: boolean) => {
    try {
      const updated = await updateBookingCalled(id, called);
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
      toast({ title: "وضعیت بروزرسانی شد" });
    } catch (error: any) {
      toast({
        title: "خطا در تغییر وضعیت",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('آیا از حذف این رزرو اطمینان دارید؟')) {
      return;
    }

    try {
      console.log('Deleting booking with ID:', id);
      await deleteBookingById(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      toast({ title: "رزرو حذف شد" });
      console.log('Booking deleted successfully');
    } catch (error: any) {
      console.error('Delete booking error:', error);
      toast({
        title: "خطا در حذف رزرو",
        description: error?.message ?? "مشکلی پیش آمد",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
      
      // Set up real-time subscription for bookings
      const channel = supabase
        .channel('admin-bookings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings'
          },
          (payload) => {
            console.log('Real-time booking change:', payload);
            if (payload.eventType === 'DELETE') {
              setBookings(prev => prev.filter(b => b.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setBookings(prev => prev.map(b => 
                b.id === payload.new.id ? { ...b, ...payload.new } : b
              ));
            } else if (payload.eventType === 'INSERT') {
              setBookings(prev => [payload.new as Booking, ...prev]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in anim-delay-80 bg-card border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">ورود ادمین</CardTitle>
            <p className="text-muted-foreground">برای دسترسی به پنل مدیریت وارد شوید</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور را وارد کنید"
                className="bg-background border-input text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-input"
              />
              مرا به‌خاطر بسپار
            </label>
            <Button onClick={handleLogin} className="w-full btn-primary">
              ورود
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground animate-fade-in anim-delay-80">داشبورد ادمین</h1>
            <p className="text-muted-foreground mt-2">مدیریت رزروها و محتوای سایت</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/admin/portfolio'} className="bg-card">
              مدیریت نمونه کارها
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/reviews'} className="bg-card">
              مدیریت نظرات
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/homepage'} className="bg-card">
              مدیریت صفحه اصلی
            </Button>
            <Button variant="destructive" onClick={handleLogout}>خروج</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">کل رزروها</p>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xl">📅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">تماس گرفته شده</p>
                  <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.called).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">در انتظار تماس</p>
                  <p className="text-2xl font-bold text-yellow-600">{bookings.filter(b => !b.called).length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">لیست رزروها</h2>
          {bookings.length === 0 ? (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">هیچ رزروی یافت نشد</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking, index) => (
              <Card 
                key={booking.id}
                className="bg-card border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">نام مشتری</p>
                          <p className="font-bold text-foreground">{booking.first_name} {booking.last_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تلفن</p>
                          <p className="text-foreground">{booking.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">پکیج</p>
                          <p className="text-foreground">{booking.plan_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">کد پیگیری</p>
                          <p className="font-mono text-primary">{booking.tracking_code}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">ID: {booking.id}</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => toggleCalled(booking.id, !booking.called)}
                          size="sm"
                          variant={booking.called ? "destructive" : "default"}
                          className="flex-1 lg:flex-none"
                        >
                          {booking.called ? "برگردان به انتظار" : "علامت‌گذاری شده"}
                        </Button>
                        <Button
                          onClick={() => deleteBooking(booking.id)}
                          size="sm"
                          variant="destructive"
                          className="flex-1 lg:flex-none"
                        >
                          حذف
                        </Button>
                      </div>
                      <Badge 
                        className={`${
                          booking.called 
                            ? "bg-green-100 text-green-800 border-green-300" 
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        } text-center justify-center`}
                      >
                        {booking.called ? "✅ تماس گرفته شد" : "⏳ در انتظار تماس"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}