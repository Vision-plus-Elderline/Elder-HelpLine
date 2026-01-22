import Autoplay from 'embla-carousel-autoplay';
import React, { useEffect, useState } from 'react'
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Card, CardContent } from './ui/card';
import NewsCarousel from './news';

function CarasoulHero() {
 
     const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full group/carousel">
      <NewsCarousel />
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full max-w-[1400px] mx-auto relative"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {slides.map((num, index) => (
            <CarouselItem key={num} className="pl-2 md:pl-4 basis-full">
              <div className="py-2 px-1" key={index}>
                <Card className="border-none bg-transparent group transition-all duration-500 rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl">
                  <CardContent className="p-0 aspect-[16/9] md:aspect-[3.5/1] relative bg-gray-50/50 flex items-center justify-center">
                    <img 
                      src={`/images/${num}.png`}
                      alt={`Slide ${num}`}
                      className="w-full h-full object-contain select-none transition-all duration-700 group-hover:scale-[1.02] z-10"
                      draggable={false}
                    />
                    
                    {/* Decorative subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/50 via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Inner border/glow effect */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl ring-1 ring-inset ring-black/5 group-hover:ring-teal-500/20 transition-all duration-500 z-20" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <div>
          <img src="/logo/elderline-logo.png" alt="elderline-logo" className="w-32 h-12 object-contain absolute top-20 right-20" />
        </div> */}
        
        {/* Navigation - Hidden on mobile, optimized for laptop */}
        <div className="hidden lg:flex">
          <CarouselPrevious className="absolute -left-4 xl:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border-slate-200 text-slate-900 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-teal-600 hover:text-white hover:border-teal-600 shadow-lg" />
          <CarouselNext className="absolute -right-4 xl:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border-slate-200 text-slate-900 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-teal-600 hover:text-white hover:border-teal-600 shadow-lg" />
        </div>

        {/* Pagination Dots - Critical for Mobile & Laptop UX */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                current === i 
                  ? "w-8 bg-teal-600" 
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}

export default CarasoulHero