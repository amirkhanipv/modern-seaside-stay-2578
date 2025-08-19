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
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    setBookings(data || []);
  };

  const updateStatus = async (id: string, called: boolean) => {
    await supabase
      .from('bookings')
      .update({ called })
      .eq('id', id);
    
    fetchBookings();
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
                <div className="flex gap-2">
                  <Badge variant={booking.called ? "default" : "secondary"}>
                    {booking.called ? "تماس گرفته شد" : "در انتظار تماس"}
                  </Badge>
                  <Button
                    onClick={() => updateStatus(booking.id, !booking.called)}
                    size="sm"
                  >
                    تغییر وضعیت
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}