import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    planType: ""
  });
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planPrices = {
        children: 2500000,
        wedding: 8000000,
        family: 4000000
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            plan_type: formData.planType,
            plan_price: planPrices[formData.planType as keyof typeof planPrices],
            tracking_code: 'NR' + Math.random().toString().substr(2, 6)
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTrackingCode(data.tracking_code);
      setIsSubmitted(true);
      toast({
        title: "رزرو با موفقیت ثبت شد",
        description: `کد پیگیری شما: ${data.tracking_code}`
      });
    } catch (error) {
      toast({
        title: "خطا در ثبت رزرو",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">رزرو تکمیل شد!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">کد پیگیری شما:</p>
            <div className="text-3xl font-bold text-primary mb-6">{trackingCode}</div>
            <Button onClick={() => window.location.href = "/"}>
              بازگشت به صفحه اصلی
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">فرم رزرو آنلاین</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName">نام</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">شماره تماس</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="plan">نوع پکیج</Label>
              <Select value={formData.planType} onValueChange={(value) => setFormData({...formData, planType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="پکیج مورد نظر را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="children">پکیج کودک</SelectItem>
                  <SelectItem value="wedding">پکیج عروس</SelectItem>
                  <SelectItem value="family">پکیج خانوادگی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              ثبت رزرو
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}