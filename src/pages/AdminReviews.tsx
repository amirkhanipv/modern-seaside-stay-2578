import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import AdminCustomerReviews from "@/components/AdminCustomerReviews";
import AdminAuthGuard from "@/components/AdminAuthGuard";

export default function AdminReviews() {
  return (
    <AdminAuthGuard title="ورود به مدیریت نظرات">
      <div className="min-h-screen p-4 animate-fade-in bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-bold">مدیریت نظرات مشتریان</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="bg-card">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  صفحه اصلی
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-card">
                <Link to="/admin" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  بازگشت به داشبورد
                </Link>
              </Button>
            </div>
          </div>
          
          <AdminCustomerReviews />
        </div>
      </div>
    </AdminAuthGuard>
  );
}