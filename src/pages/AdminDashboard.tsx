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
    console.log('Fetching bookings...');
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Fetch result:', { data, error });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        alert('خطا در بارگیری رزروها: ' + error.message);
        return;
      }
      
      setBookings(data || []);
      console.log('Bookings loaded:', data?.length || 0);
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در بارگیری رزروها');
    }
  };

  const updateStatus = async (id: string, called: boolean) => {
    console.log('Attempting to update booking:', id, 'called:', called);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ called })
        .eq('id', id)
        .select();
      
      console.log('Update result:', { data, error });
      
      if (error) {
        console.error('Error updating status:', error);
        alert('خطا در تغییر وضعیت: ' + error.message);
        return;
      }
      
      if (data && data.length > 0) {
        // Update local state with the actual returned data
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === id ? { ...booking, ...data[0] } : booking
          )
        );
        
        alert('وضعیت با موفقیت تغییر کرد');
        console.log('Status updated successfully:', data[0]);
      } else {
        console.warn('No data returned from update');
        // Refresh bookings to get latest state
        fetchBookings();
      }
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
      const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error deleting booking:', error);
        alert('خطا در حذف رزرو: ' + error.message);
        return;
      }
      
      // If deletion returned the deleted row, data will have length 1
      if (data && data.length > 0) {
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking.id !== id)
        );
        alert('رزرو با موفقیت حذف شد');
      } else {
        // If no data returned (policy may prevent returning rows), refetch
        await fetchBookings();
        alert('رزرو با موفقیت حذف شد');
      }
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
                  <p className="text-sm text-gray-500">ID: {booking.id}</p>
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