"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SlideData } from "@/types/home-type";

const SLIDES_DATA: SlideData[] = [
  {
    type: "content",
    title: "Sua Parceira em",
    highlight: "Atacado e Varejo",
    description:
      "Distribuidora especializada em Eletrônicos, Informática e Perfumes Importados. Oferecemos qualidade, procedência e agilidade para fazer seu negócio prosperar ou para você encontrar os melhores produtos.",
    badge: "🚀 Plataforma de Atacado e Varejo - Melhores Preços",
  },
  {
    type: "image",
    title: "Eletrônicos",
    image: "/slides/Vitrine-eletronicos.jpg?height=600&width=800",
    description: "Visite nossa loja e conheça nossos produtos de perto",
  },
  {
    type: "image",
    title: "Estoque Completo",
    image: "/slides/Vitrine-Fone-Games.jpg?height=600&width=800",
    description: "Mais de 5000 produtos sempre disponíveis",
  },
  {
    type: "image",
    title: "Perfumes Importados",
    image: "/slides/Vitrine-Perfumes.jpg?height=600&width=800",
    description: "Diversos perfumes femininos e masculinos de grandes marcas ",
  },
] as const;

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = SLIDES_DATA;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsTransitioning(false), 700);
  };

  return (
    <section
      id="inicio"
      className="relative h-[500px] overflow-hidden sm:h-[600px] lg:h-[700px]"
    >
      <div className="relative h-full overflow-hidden">
        {/* Slides */}
        <div className="relative h-full overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 0.7s ease-in-out",
            }}
          >
            {slides.map((slide) => (
              <div key={slide.title} className="h-full w-full flex-shrink-0">
                {slide.type === "content" ? (
                  // Content Slide - Mobile First
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20" />
                    <div className="container relative mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                      <div className="mx-auto w-full max-w-4xl text-center">
                        <Badge className="mb-3 bg-green-100 text-xs text-green-800 sm:mb-4 sm:text-sm dark:bg-green-900 dark:text-green-200">
                          {slide.badge}
                        </Badge>
                        <h1 className="mb-4 text-2xl leading-tight font-bold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                          {slide.title}
                          <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent sm:inline">
                            {" "}
                            {slide.highlight}
                          </span>
                        </h1>
                        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl px-4 text-base sm:mb-8 sm:px-0 sm:text-lg lg:text-xl">
                          {slide.description}
                        </p>
                        <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4 sm:px-0">
                          <Link href="/contact">
                            <Button
                              size="lg"
                              className="h-12 w-full px-6 text-base sm:w-auto sm:px-8 sm:text-lg cursor-pointer"
                            >
                              Cadastrar-se Agora
                              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                          </Link>
                          <Link href="/products">
                            <Button
                              size="lg"
                              variant="outline"
                              className="h-12 w-full bg-transparent px-6 text-base sm:w-auto sm:px-8 sm:text-lg cursor-pointer"
                            >
                              Ver Catálogo
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Image Slide - Mobile First
                  <div className="relative h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="container relative mx-auto flex h-full w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                      <div className="mx-auto w-full max-w-2xl text-center text-white">
                        <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>
                        <p className="mb-6 px-4 text-lg opacity-90 sm:mb-8 sm:px-0 sm:text-xl">
                          {slide.description}
                        </p>
                        <Link href="/catalog" className="mx-auto">
                          <Button
                            size="lg"
                            variant="secondary"
                            className="px-6 text-base sm:px-8 sm:text-lg cursor-pointer"
                          >
                            Saiba Mais
                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Hidden on mobile, visible on tablet+ */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:block lg:left-4"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:block lg:right-4"
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </button>

        {/* Dots Navigation - Mobile optimized */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2 sm:bottom-6">
          {slides.map((slide, index) => (
            <button
              key={`dot-${slide.title}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator - Mobile optimized */}
        <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`rounded-full p-1.5 text-sm backdrop-blur-sm transition-colors sm:p-2 ${
              isAutoPlaying
                ? "bg-green-500/20 text-green-400"
                : "bg-white/20 text-white/70"
            }`}
            aria-label={
              isAutoPlaying ? "Pausar slideshow" : "Iniciar slideshow"
            }
          >
            {isAutoPlaying ? "⏸️" : "▶️"}
          </button>
        </div>
      </div>
    </section>
  );
}
