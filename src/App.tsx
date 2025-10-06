
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingPage } from "@/components/ui/loading";
import NoraStudio from "./pages/NoraStudio";
import BookingForm from "./pages/BookingForm";
import BookingStatus from "./pages/BookingStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminReviews from "./pages/AdminReviews";
import AdminHomepage from "./pages/AdminHomepage";
import AllWorks from "./pages/AllWorks";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";

// Create a react-query client
const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Check if environment variables are loaded
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-destructive">⚠️ Environment Not Loaded</h2>
          <p className="text-muted-foreground">
            The preview environment hasn't picked up your backend configuration yet.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Please try:</p>
            <ul className="list-disc list-inside text-left">
              <li>Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)</li>
              <li>Wait 1-2 minutes for the backend to initialize</li>
              <li>Check your backend status if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<NoraStudio />} />
              <Route path="/booking" element={<BookingForm />} />
              <Route path="/booking-status" element={<BookingStatus />} />
              <Route path="/gallery" element={<AllWorks />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/portfolio" element={<AdminPortfolio />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/homepage" element={<AdminHomepage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
