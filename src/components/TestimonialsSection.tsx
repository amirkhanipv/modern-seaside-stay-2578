import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
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
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
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
    <section className="section bg-gradient-to-b from-muted/20 via-muted/40 to-muted/20 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Quote className="h-4 w-4" />
            <span className="text-sm font-medium">نظرات مشتریان</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-foreground">
            آنچه مشتریان می‌گویند
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            تجربه‌های واقعی مشتریان ما از خدمات عکاسی نورا استودیو
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg -translate-x-2 md:-translate-x-6 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-card/80 backdrop-blur-sm hover:bg-card border-border shadow-lg translate-x-2 md:translate-x-6 transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-8 md:mx-16" ref={emblaRef}>
            <div className="flex gap-6">
              {reviews.map((review, idx) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="group bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg p-8 rounded-3xl h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 relative overflow-hidden">
                    {/* Quote decoration */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                      <Quote className="h-16 w-16 text-primary" />
                    </div>
                    
                    {/* Rating Stars */}
                    <div className="flex justify-center mb-5 gap-1">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 text-yellow-400 fill-current drop-shadow-sm transition-transform duration-300 hover:scale-125" 
                          style={{ animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className="text-base text-foreground/90 mb-6 leading-relaxed text-center flex-1 relative z-10">
                      <span className="text-primary/70 text-lg">"</span>
                      {review.review_text}
                      <span className="text-primary/70 text-lg">"</span>
                    </blockquote>

                    {/* Divider */}
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-5" />

                    {/* Customer Info */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-4">
                        {review.avatar_url ? (
                          <div className="relative">
                            <img 
                              src={review.avatar_url} 
                              alt={review.customer_name}
                              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/40"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                            <span className="text-primary text-lg font-bold">
                              {review.customer_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="text-right">
                          <div className="font-bold text-foreground text-lg">
                            {review.customer_name}
                          </div>
                          {review.customer_location && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full" />
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
          <div className="flex justify-center mt-10 gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === selectedIndex 
                    ? 'bg-gradient-to-r from-primary to-primary/70 w-10 shadow-lg shadow-primary/30' 
                    : 'bg-muted-foreground/20 hover:bg-primary/40 w-2.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
