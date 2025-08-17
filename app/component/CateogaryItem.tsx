import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Home, Thermometer, Shirt, ChefHat, Snowflake, Archive } from 'lucide-react';
import soundImg from "@/app/assets/home/sound.png";
import heater from "@/app/assets/home/heater.png";
import washingMachine from "@/app/assets/home/wash.png";
import oven from "@/app/assets/home/oven.png";
import cooler from "@/app/assets/home/cooler.png";
import freeze from "@/app/assets/home/freeze.png";

const staticLinkData = [
    {
        id: 1,
        imgUrl: soundImg,
        nameLink: "Home Entertainment",
        icon: Home,
        description: "Audio, TV & Smart Home"
    },
    {
        id: 2,
        imgUrl: heater,
        nameLink: "Heating Appliances",
        icon: Thermometer,
        description: "Heaters & Climate Control"
    },
    {
        id: 3,
        imgUrl: washingMachine,
        nameLink: "Laundry Appliances",
        icon: Shirt,
        description: "Washing & Drying Solutions"
    },
    {
        id: 4,
        imgUrl: oven,
        nameLink: "Kitchen Appliances",
        icon: ChefHat,
        description: "Cooking & Food Preparation"
    },
    {
        id: 5,
        imgUrl: cooler,
        nameLink: "Cooling Appliances",
        icon: Snowflake,
        description: "Air Conditioners & Fans"
    },
    {
        id: 6,
        imgUrl: freeze,
        nameLink: "Refrigeration Appliances",
        icon: Archive,
        description: "Fridges & Freezers"
    }
];

const CategoryItem = () => {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold primary mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Discover our wide range of premium appliances designed to make your life easier
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {staticLinkData.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-gray-300"
                            >
                                {/* Background Image */}
                                <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
                                    <Image
                                        src={item.imgUrl}
                                        alt={item.nameLink}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                                    {/* Icon */}
                                    <div className="mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Category Name */}
                                    <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl mb-1 group-hover:text-blue-300 transition-colors duration-300">
                                        {item.nameLink}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-white/80 text-sm md:text-base mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {item.description}
                                    </p>

                                    {/* CTA Button */}
                                    <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 transform translate-y-4 group-hover:translate-y-0">
                                        <span className="text-sm md:text-base font-semibold mr-2">
                                            Explore Now
                                        </span>
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Clickable Link */}
                                <Link
                                    href={`/productList?category=${encodeURIComponent(item.nameLink)}`}
                                    className="absolute inset-0 z-10"
                                    aria-label={`Browse ${item.nameLink}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryItem;