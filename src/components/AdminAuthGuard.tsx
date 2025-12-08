import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { LoadingPage } from "@/components/ui/loading";

interface AdminAuthGuardProps {
  children: ReactNode;
  title?: string;
}

export default function AdminAuthGuard({ children, title = "ورود به پنل مدیریت" }: AdminAuthGuardProps) {
  const {
    isAuthenticated,
    isLoading,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    handleLogin,
  } = useAdminAuth();

  const onLogin = () => {
    const success = handleLogin(password);
    if (!success) {
      toast({
        title: "ورود ناموفق",
        description: "رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in bg-card border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
            <p className="text-muted-foreground">برای دسترسی به این صفحه وارد شوید</p>
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
                onKeyPress={(e) => e.key === 'Enter' && onLogin()}
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
            <Button onClick={onLogin} className="w-full btn-primary">
              ورود
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              بازگشت به صفحه اصلی
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
