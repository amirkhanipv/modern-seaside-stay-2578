import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCustomerReviews, type CustomerReview } from "@/services/customerReviews";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await fetchCustomerReviews();
        setReviews(reviewsData.filter(r => r.featured || reviewsData.length <= 4));
        setLoading(false);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const nextTestimonial = () => {
    if (isTransitioning || reviews.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevTestimonial = () => {
    if (isTransitioning || reviews.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length);
      setIsTransitioning(false);
    }, 150);
  };

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(nextTestimonial, 8000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (loading || reviews.length === 0) {
    return null;
  }

  return (
    <section className="section bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <span className="text-sm text-primary font-medium uppercase tracking-wider">
            نظرات مشتریان
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            آنچه مشتریان می‌گویند
          </h2>
          <p className="text-muted-foreground">
            تجربه‌های واقعی مشتریان ما از خدمات عکاسی نورا استودیو
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(reviews[currentTestimonial]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-foreground mb-8 leading-relaxed">
                  "{reviews[currentTestimonial]?.review_text}"
                </blockquote>

                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    {reviews[currentTestimonial]?.avatar_url && (
                      <img 
                        src={reviews[currentTestimonial].avatar_url} 
                        alt={reviews[currentTestimonial]?.customer_name}
                        className="w-12 h-12 rounded-full object-cover ml-4"
                      />
                    )}
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        {reviews[currentTestimonial]?.customer_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reviews[currentTestimonial]?.customer_location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-reverse space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}