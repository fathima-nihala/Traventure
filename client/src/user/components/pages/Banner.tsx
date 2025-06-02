import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

import ban1 from '../../../assets/banners/ban1.jpg';
import ban2 from '../../../assets/banners/ban2.jpg';
import ban3 from '../../../assets/banners/ban3.jpg';

import './banner.css';

const Banner: React.FC = () => {
  // Sample banner data - replace with your actual images
  const bannerImages = [
    {
      src: ban1,
      alt: "Banner 1",
      fallback: "https://via.placeholder.com/800x300/cc0000/ffffff?text=Banner+1"
    },
    {
      src: ban2,
      alt: "Banner 2",
      fallback: "https://via.placeholder.com/800x300/cc6600/ffffff?text=Banner+2"
    },
    {
      src: ban3,
      alt: "Banner 3",
      fallback: "https://via.placeholder.com/800x300/009900/ffffff?text=Banner+3"
    },
  ];

  // Handle image error by using fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string) => {
    const img = event.target as HTMLImageElement;
    img.src = fallback;
  };

  return (
    <div className="w-full h-screen relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        speed={1000} // Transition speed in milliseconds
        autoplay={{
          delay: 4000, // Increased delay for better viewing
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // Pause on hover
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        loop={true}
        grabCursor={true}
        watchSlidesProgress={true}
        parallax={true}
        // Use fade effect for smoother transitions (optional)
        // effect="fade"
        // fadeEffect={{
        //   crossFade: true
        // }}
        modules={[Autoplay, Pagination, EffectFade]}
        className="w-full h-full banner-swiper"
        // Additional smooth scrolling options
        freeMode={false}
        preventInteractionOnTransition={true}
        allowTouchMove={true}
        touchRatio={1}
        touchAngle={45}
        simulateTouch={true}
        shortSwipes={false}
        longSwipes={true}
        longSwipesRatio={0.3}
        longSwipesMs={300}
      >
        {bannerImages.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                onError={(e) => handleImageError(e, banner.fallback)}
                loading={index === 0 ? "eager" : "lazy"} // Load first image immediately
                style={{
                  willChange: 'transform', // Optimize for animations
                  backfaceVisibility: 'hidden', // Prevent flickering
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center text-white bg-black/40 p-10 text-center">
                <h2 className="text-3xl md:text-[60px] font-bold mb-2 animate-fade-in-up">
                  Traventure
                </h2>
                <p className="text-base md:text-[30px] animate-fade-in-up animation-delay-200">
                  Discover hidden gems and create unforgettable memories with Traventure.
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;