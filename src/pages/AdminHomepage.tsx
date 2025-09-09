import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminHomepagePortfolio from "@/components/AdminHomepagePortfolio";

export default function AdminHomepage() {
  return (
    <div className="min-h-screen p-4 animate-fade-in bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">مدیریت صفحه اصلی</h1>
          <Button asChild variant="outline">
            <Link to="/admin" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              بازگشت به داشبورد
            </Link>
          </Button>
        </div>
        
        <AdminHomepagePortfolio />
      </div>
    </div>
  );
}