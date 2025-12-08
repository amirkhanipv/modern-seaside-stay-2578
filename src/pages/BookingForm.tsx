import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchDiscountPlans, type DiscountPlan } from "@/services/portfolio";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    planType: "",
    planPrice: 0
  });
  const [plans, setPlans] = useState<DiscountPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await fetchDiscountPlans();
        setPlans(plansData.filter(p => p.is_active));
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const handlePlanChange = (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      setFormData({
        ...formData, 
        planType: selectedPlan.plan_name,
        planPrice: selectedPlan.price
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            plan_type: formData.planType,
            plan_price: formData.planPrice,
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
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in anim-delay-80">
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
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in anim-delay-80">
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
              <Select 
                value={plans.find(p => p.plan_name === formData.planType)?.id || ""} 
                onValueChange={handlePlanChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "در حال بارگیری..." : "پکیج مورد نظر را انتخاب کنید"} />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.plan_name} - {new Intl.NumberFormat('fa-IR').format(plan.price)} تومان
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!formData.planType}>
              ثبت رزرو
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
