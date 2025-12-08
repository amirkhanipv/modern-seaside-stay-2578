import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCustomerReviews, type CustomerReview } from "@/services/customerReviews";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Embla carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1,
      direction: "rtl"
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const reviewsData = await fetchCustomerReviews();
        setReviews(reviewsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

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

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-card hover:bg-accent border-border shadow-md -translate-x-2 md:-translate-x-6"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-card hover:bg-accent border-border shadow-md translate-x-2 md:translate-x-6"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-8 md:mx-16" ref={emblaRef}>
            <div className="flex gap-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="bg-card border border-border shadow-lg p-6 rounded-2xl h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Rating Stars */}
                    <div className="flex justify-center mb-4">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className="text-base text-foreground mb-6 leading-relaxed text-center flex-1">
                      "{review.review_text}"
                    </blockquote>

                    {/* Customer Info */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center">
                        {review.avatar_url && (
                          <img 
                            src={review.avatar_url} 
                            alt={review.customer_name}
                            className="w-12 h-12 rounded-full object-cover ml-4"
                          />
                        )}
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {review.customer_name}
                          </div>
                          {review.customer_location && (
                            <div className="text-sm text-muted-foreground">
                              {review.customer_location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
