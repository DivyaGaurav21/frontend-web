import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Static data array with 5 carousel slides
const carouselData = [
  {
    id: 1,
    title: "Best Deal Online on smart watches",
    subtitle: "SMART WEARABLE.",
    discount: "UP to 80% OFF",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
    background: "from-slate-700 to-slate-900"
  },
  {
    id: 2,
    title: "Premium Headphones Collection",
    subtitle: "AUDIO EXCELLENCE.",
    discount: "UP to 60% OFF",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
    background: "from-purple-700 to-purple-900"
  },
  {
    id: 3,
    title: "Latest Smartphone Deals",
    subtitle: "MOBILE REVOLUTION.",
    discount: "UP to 70% OFF",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
    background: "from-blue-700 to-blue-900"
  },
  {
    id: 4,
    title: "Gaming Laptops & Accessories",
    subtitle: "GAMING WORLD.",
    discount: "UP to 50% OFF",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center",
    background: "from-green-700 to-green-900"
  },
  {
    id: 5,
    title: "Home Appliances Sale",
    subtitle: "SMART HOME.",
    discount: "UP to 75% OFF",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    background: "from-red-700 to-red-900"
  }
];

interface CarouselProps {
  data?: typeof carouselData;
  autoPlay?: boolean;
  interval?: number;
}

const ProductCarousel: React.FC<CarouselProps> = ({ 
  data = carouselData, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, data.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + data.length) % data.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % data.length);
  };

  const currentItem = data[currentSlide];

  return (
    <div className="relative w-full max-w-7xl mx-auto py-4">
      {/* Main carousel container */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentItem.background} h-64 md:h-80 lg:h-96`}>
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full border-2 border-white/20"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full border-2 border-white/20"></div>
          <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full border-2 border-white/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between h-full px-8 lg:px-12">
          {/* Text content */}
          <div className="flex-1 text-white">
            <p className="text-sm md:text-base mb-2 opacity-90">
              {currentItem.title}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {currentItem.subtitle}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
              {currentItem.discount}
            </p>
          </div>

          {/* Product image */}
          <div className="flex-shrink-0 ml-8">
            <div className="relative">
              <img
                src={currentItem.image}
                alt={currentItem.subtitle}
                className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 object-cover rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-gray-800 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 left-8 text-white/70 text-sm">
        {currentSlide + 1} / {data.length}
      </div>
    </div>
  );
};

export default ProductCarousel;