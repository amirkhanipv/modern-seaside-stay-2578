import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { fetchBookings as apiFetchBookings, updateBookingCalled, updateBookingStatus, deleteBookingById, type Booking } from "@/services/bookings";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in anim-delay-80">
          <CardHeader>
            <CardTitle>ورود ادمین</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="w-full p-2 border rounded mb-4"
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              مرا به‌خاطر بسپار
            </label>
            <Button onClick={handleLogin} className="w-full">
              ورود
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in bg-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-center animate-fade-in anim-delay-80">داشبورد ادمین</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/admin/portfolio'}>
            مدیریت نمونه کارها
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin/reviews'}>
            مدیریت نظرات
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/admin/homepage'}>
            مدیریت صفحه اصلی
          </Button>
          <Button variant="outline" onClick={handleLogout}>خروج</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {bookings.map((booking, index) => (
          <Card 
            key={booking.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{booking.first_name} {booking.last_name}</h3>
                  <p>تلفن: {booking.phone}</p>
                  <p>پکیج: {booking.plan_type}</p>
                  <p>کد: {booking.tracking_code}</p>
                  <p className="text-sm text-gray-500">ID: {booking.id}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleCalled(booking.id, !booking.called)}
                      size="sm"
                      variant={booking.called ? "destructive" : "default"}
                    >
                      {booking.called ? "علامت‌گذاری نشده" : "علامت‌گذاری شده"}
                    </Button>
                    <Button
                      onClick={() => deleteBooking(booking.id)}
                      size="sm"
                      variant="destructive"
                    >
                      حذف
                    </Button>
                  </div>
                  <Badge 
                    className={`${
                      booking.called 
                        ? "bg-green-100 text-green-800 border-green-300" 
                        : "bg-red-100 text-red-800 border-red-300"
                    } text-center`}
                  >
                    {booking.called ? "✅ تماس گرفته شد" : "❌ در انتظار تماس"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}