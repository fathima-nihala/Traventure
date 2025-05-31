import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import your logo - adjust the path as needed
import Logo from '../../../assets/logos/logo.png';
import './banner.css';

const Banner = () => {
  const progressCircle = useRef<SVGSVGElement | null>(null);
  const progressContent = useRef<HTMLSpanElement | null>(null);

  const onAutoplayTimeLeft = (_: unknown, time: number, progress: number) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', `${1 - progress}`);
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  // Sample banner data - replace with your actual images
  const bannerImages = [
    {
      src: Logo,
      alt: "Banner 1",
      fallback: {Logo}
    },
    {
      src: Logo,
      alt: "Banner 2", 
      fallback: "https://via.placeholder.com/800x300/cc6600/ffffff?text=Banner+2"
    },
    {
      src: "/images/banner3.jpg", // Public folder reference
      alt: "Banner 3",
      fallback: "https://via.placeholder.com/800x300/009900/ffffff?text=Banner+3"
    },
    {
      src: "/images/banner4.jpg", // Public folder reference
      alt: "Banner 4",
      fallback: "https://via.placeholder.com/800x300/990099/ffffff?text=Banner+4"
    }
  ];

  // Handle image error by using fallback
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string) => {
    const img = event.target as HTMLImageElement;
    img.src = fallback;
  };

  return (
    <div className="w-full h-64 relative">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        // navigation={true}
        loop={true}
        modules={[Autoplay, Pagination]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="w-full h-full banner-swiper"
      >
        {bannerImages.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full relative overflow-hidden">
              <img 
                src={banner.src} 
                alt={banner.alt} 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, banner?.fallback)}
                loading="lazy"
              />
              {/* Optional overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              {/* Optional content overlay */}
              <div className="absolute bottom-8 left-8 z-10">
                <h2 className="text-white text-2xl font-bold mb-2">{banner.alt}</h2>
                <p className="text-white text-sm opacity-90">Your banner description here</p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Autoplay Progress Indicator */}
        <div className="autoplay-progress absolute bottom-4 right-4 flex items-center gap-2 z-20" slot="container-end">
          <svg 
            viewBox="0 0 48 48" 
            ref={progressCircle} 
            className="w-12 h-12 text-white"
          >
            <circle 
              cx="24" 
              cy="24" 
              r="20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              opacity="0.3"
            />
            <circle 
              cx="24" 
              cy="24" 
              r="20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeDasharray="125.6" 
              strokeDashoffset="125.6"
              transform="rotate(-90 24 24)"
              className="progress-ring"
            />
          </svg>
          <span 
            ref={progressContent} 
            className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded"
          >
            3s
          </span>
        </div>
      </Swiper>
    </div>
  );
};

export default Banner;