/**
 * HeroBanner Component
 * Full-width carousel/slider with 4 slides
 * Responsive images: mobile and desktop versions
 */

"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { brandNames } from "@/data/brand-names";

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
    imageMobile: "/slides/slide4-mobile.webp",
    imageDesktop: "/slides/slide4.webp",
    alt: "Slide 4 - Promoções",
    link: "#promocao-4",
  },
];

const brandColors: Record<string, string> = {
  IPHONE: "#1D1D1F",
  MOTOROLA: "#5C92F2",
  SAMSUNG: "#1428A0",
  LG: "#A50034",
  XIAOMI: "#FF6900",
  REALME: "#FFC915",
  ASUS: "#00539B",
  POCO: "#FDD835",
  "MI-NOTE": "#FF6900",
  REDMI: "#FF6900",
  NOKIA: "#124191",
  OPPO: "#046A38",
  IFINIT: "#00A651",
};

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
      <div className="relative aspect-square w-full bg-background md:aspect-[1920/500]">
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
                  className="object-contain"
                  loading="eager"
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
                  loading="eager"
                  sizes="(min-width: 768px) 100vw, 0px"
                />
              </div>
            </a>
          </div>
        ))}

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

        {/* CTA Buttons */}
        <div className="absolute bottom-10 left-1/2 z-30 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-center gap-2 px-2 sm:w-auto sm:max-w-none sm:px-0 md:bottom-14 md:gap-4">
          <Link href="/register" className="min-w-0 flex-1 sm:flex-none">
            <Button
              size="lg"
              className="h-9 w-full cursor-pointer px-3 text-xs font-semibold shadow-lg shadow-black/15 sm:h-12 sm:w-80 sm:px-8 sm:text-base lg:text-lg"
            >
              <span className="sm:hidden">Cadastrar-se</span>
              <span className="hidden sm:inline">
                Cadastrar-se Gratuitamente
              </span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Link href="/register" className="min-w-0 flex-1 sm:flex-none">
            <Button
              size="lg"
              variant="secondary"
              className="h-9 w-full cursor-pointer border border-secondary/30 px-3 text-xs font-semibold shadow-lg shadow-black/15 sm:h-12 sm:w-72 sm:px-6 sm:text-base lg:text-lg"
            >
              <span className="sm:hidden">Consultor</span>
              <span className="hidden sm:inline">Falar com Consultor</span>
            </Button>
          </Link>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-6">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all md:h-3 ${
                index === currentSlide
                  ? "w-6 bg-primary md:w-8"
                  : "w-2 bg-muted-foreground/50 hover:bg-muted-foreground/75 md:w-3"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Brand Marquee */}
      <div className="border-t border-border bg-muted/50 py-6">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
          Marcas que você encontra aqui
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r from-muted/50 to-transparent md:w-24" />
          <div className="absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l from-muted/50 to-transparent md:w-24" />
          <div className="flex animate-marquee">
            {["set-a", "set-b", "set-c"].map((setId) =>
              brandNames.map((brand) => (
                <div
                  key={`${brand}-${setId}`}
                  className="mx-3 flex h-12 min-w-[92px] shrink-0 items-center justify-center md:mx-4 md:h-14 md:min-w-[108px]"
                >
                  <span
                    className="text-lg font-bold md:text-xl"
                    style={{ color: brandColors[brand] ?? "#64748B" }}
                  >
                    {brand}
                  </span>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
