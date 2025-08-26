import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { fetchBookings as apiFetchBookings, updateBookingCalled, deleteBookingById, type Booking } from "@/services/bookings";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (password === "dorsa") {
      setIsAuthenticated(true);
      await loadBookings();
    } else {
      toast({
        title: "ورود ناموفق",
        description: "رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
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
      await deleteBookingById(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      toast({ title: "رزرو حذف شد" });
    } catch (error: any) {
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
            <Button onClick={handleLogin} className="w-full">
              ورود
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center animate-fade-in anim-delay-80">داشبورد ادمین</h1>
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