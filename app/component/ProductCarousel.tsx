"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import soundImg from "@/app/assets/home/sound.png";
import heater from "@/app/assets/home/heater.png";
import washingMachine from "@/app/assets/home/wash.png";
import oven from "@/app/assets/home/oven.png";
import cooler from "@/app/assets/home/cooler.png";
import freeze from "@/app/assets/home/freeze.png";
import Image, { StaticImageData } from 'next/image';

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  image: string | StaticImageData;
  price?: string;
  originalPrice?: string;
}

interface ProductCarouselProps {
  items?: CarouselItem[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

// Enhanced carousel data with pricing
const defaultCarouselData: CarouselItem[] = [
  {
    id: 1,
    title: "Best Deals on Home Theaters & Speakers",
    subtitle: "High-quality sound system for your home",
    discount: "Up to 60% OFF",
    price: "₹1,200",
    originalPrice: "₹1,920",
    image: soundImg,
  },
  {
    id: 2,
    title: "Premium Winter Collection – Room Heaters",
    subtitle: "Stay warm with energy-efficient heaters",
    discount: "Up to 70% OFF",
    price: "₹1,065",
    originalPrice: "₹1,810",
    image: heater,
  },
  {
    id: 3,
    title: "Smart Washing Machines – Best Laundry Deals",
    subtitle: "Front load & top load washing machines",
    discount: "Up to 35% OFF",
    price: "₹14,500",
    originalPrice: "₹20,714",
    image: washingMachine,
  },
  {
    id: 4,
    title: "Kitchen Appliances Mega Sale – Ovens & Microwaves",
    subtitle: "Bake, grill & cook with modern ovens",
    discount: "Up to 50% OFF",
    price: "₹13,900",
    originalPrice: "₹23,999",
    image: oven,
  },
  {
    id: 5,
    title: "Personal Air Coolers & ACs – Great Discounts",
    subtitle: "Efficient cooling solutions for summer",
    discount: "Up to 47% OFF",
    price: "₹6,199",
    originalPrice: "₹11,790",
    image: cooler,
  },
  {
    id: 6,
    title: "Refrigerators & Freezers – Smart Home Essentials",
    subtitle: "Latest frost-free & double door models",
    discount: "Up to 35% OFF",
    price: "₹15,990",
    originalPrice: "₹22,999",
    image: freeze,
  }
];


const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  items = defaultCarouselData, 
  autoSlide = true, 
  autoSlideInterval = 4000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // Auto-slide effect
  useEffect(() => {
    if (!autoSlide || isHovered) return;

    const interval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, autoSlideInterval, isHovered, nextSlide]);

  if (!items || items.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div 
        className="relative bg-gradient-to-r from-[#008ECC] to-cyan-400 md:to-transparent rounded-3xl shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[700px] md:h-[400px] flex flex-col md:flex-row">
          {/* Content Section */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center z-10">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-3">
                {currentItem.subtitle.toUpperCase()}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                {currentItem.title}
              </h1>
              <div className="mb-6">
                <span className="inline-block px-4 py-1 bg-cyan-700 text-white text-lg font-bold rounded-lg shadow-lg">
                  {currentItem.discount}
                </span>
              </div>
              
              {currentItem.price && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xl md:text-2xl font-bold text-white">₹{" "}{currentItem.price}</span>
                  {currentItem.originalPrice && (
                    <span className="text-base md:text-lg text-white/70 line-through">₹ {" "}{currentItem.originalPrice}</span>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg">
                  <ShoppingCart size={20} />
                  Shop Now
                </button>
                <button 
                  onClick={() => toggleFavorite(currentItem.id)}
                  className={`p-3 rounded-lg transition-all duration-200 shadow-lg ${
                    favorites.has(currentItem.id) 
                      ? 'bg-cyan-500 text-white hover:bg-cyan-950' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  <Heart size={20} fill={favorites.has(currentItem.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-[#008ECC] border border-[#008ECC] p-3 rounded-full bg-cyan-200 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-[#008ECC] border border-[#008ECC] p-3 rounded-full bg-cyan-200 z-20"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-3 z-20 ">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 h-3 bg-white rounded-full' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;