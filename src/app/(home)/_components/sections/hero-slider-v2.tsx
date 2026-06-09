/**
 * HeroBanner Component
 * Full-width carousel/slider with 4 slides
 * Responsive images: mobile and desktop versions
 */

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    imageMobile: "/slides/slide1-mobile.webp",
    imageDesktop: "/slides/slide1.webp",
    alt: "Slide 1 - CAIXAFECHADA",
    link: "#promocao-1",
  },
  {
    id: 2,
    imageMobile: "/slides/slide2-mobile.webp",
    imageDesktop: "/slides/slide2.webp",
    alt: "Slide 2 - Ofertas Especiais",
    link: "#promocao-2",
  },
  {
    id: 3,
    imageMobile: "/slides/slide3-mobile.webp",
    imageDesktop: "/slides/slide3.webp",
    alt: "Slide 3 - Novidades",
    link: "#promocao-3",
  },
  {
    id: 4,
    imageMobile: "/slides/placeholder-mobile.svg",
    imageDesktop: "/slides/placeholder.svg",
    alt: "Slide 4 - Promoções",
    link: "#promocao-4",
  },
];

export default function HeroSliderV2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Auto-play slider
  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (!isClient) {
    return (
      <section className="relative w-full bg-muted">
        <div className="aspect-square w-full md:aspect-[1920/500]" />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Slides Container */}
      <div className="relative aspect-square w-full md:aspect-[1920/500]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <a href={slide.link} className="block w-full h-full relative">
              {/* Mobile Image */}
              <div className="md:hidden w-full h-full relative">
                <Image
                  src={slide.imageMobile}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 767px) 100vw, 0px"
                />
              </div>

              {/* Desktop Image */}
              <div className="hidden md:block w-full h-full relative">
                <Image
                  src={slide.imageDesktop}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(min-width: 768px) 100vw, 0px"
                />
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-card md:left-6 md:p-3"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-card md:right-6 md:p-3"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2 md:h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-6 md:w-8"
                : "bg-muted-foreground/50 hover:bg-muted-foreground/75 w-2 md:w-3"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
