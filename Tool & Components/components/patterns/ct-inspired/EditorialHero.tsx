import Image from "next/image";
import { ImageCarousel, CarouselImage } from "./ImageCarousel";

type EditorialHeroProps = {
  overline?: string;
  title: string;
  kicker?: string;
  imageSrc?: string;
  imageAlt?: string;
  children?: React.ReactNode;
  carouselImages?: CarouselImage[];
  showCarousel?: boolean;
};

export function EditorialHero({ 
  overline, 
  title, 
  kicker, 
  imageSrc, 
  imageAlt = "", 
  children, 
  carouselImages, 
  showCarousel = false 
}: EditorialHeroProps) {
  return (
    <section className="section">
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          {overline && <div className="text-sm tracking-wide uppercase text-[var(--brand-600)]">{overline}</div>}
          <h1 className="mt-2 text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
          {kicker && <p className="mt-4 text-lg opacity-90 max-w-prose">{kicker}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
        <div className="order-first md:order-none">
          {/* 
            CRITICAL: Carousel Container Wrapper
            =====================================
            
            ⚠️  NEVER add overflow-hidden to this container! 
            This will clip the carousel navigation buttons and indicators.
            
            The ImageCarousel component handles its own overflow internally.
            Parent containers should use overflow-visible or no overflow property.
            
            Previous issue: overflow-hidden was clipping right navigation button
            and preventing full carousel visibility.
          */}
          <div className="relative aspect-[3/2] w-full rounded-md border">
            {showCarousel && carouselImages && carouselImages.length > 0 ? (
              <ImageCarousel
                images={carouselImages}
                baseWidth={800}
                baseHeight={600}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                loop={true}
                showIndicators={true}
                showNavigation={true}
                className="w-full h-full"
              />
            ) : imageSrc ? (
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[var(--brand-50)]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


