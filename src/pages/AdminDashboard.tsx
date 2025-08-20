import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "dorsa") {
      setIsAuthenticated(true);
      fetchBookings();
    } else {
      alert("رمز عبور اشتباه است");
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        alert('خطا در بارگیری رزروها: ' + error.message);
        return;
      }
      
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در بارگیری رزروها');
    }
  };

  const updateStatus = async (id: string, called: boolean) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ called })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating status:', error);
        alert('خطا در تغییر وضعیت: ' + error.message);
        return;
      }
      
      // Update local state immediately for better UX
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, called } : booking
        )
      );
      
      alert('وضعیت با موفقیت تغییر کرد');
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در تغییر وضعیت');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('آیا از حذف این رزرو اطمینان دارید؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting booking:', error);
        alert('خطا در حذف رزرو: ' + error.message);
        return;
      }
      
      // Update local state immediately for better UX
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== id)
      );
      
      alert('رزرو با موفقیت حذف شد');
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در حذف رزرو');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
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
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">داشبورد ادمین</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{booking.first_name} {booking.last_name}</h3>
                  <p>تلفن: {booking.phone}</p>
                  <p>پکیج: {booking.plan_type}</p>
                  <p>کد: {booking.tracking_code}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateStatus(booking.id, !booking.called)}
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