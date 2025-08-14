import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

// Static data object
const footerData = {
    brand: {
        name: "Gaurav Shop",
        copyright: "© 2026 All rights reserved."
    },
    contact: {
        whatsapp: "+91 933-480-2030",
        phone: "+91 933-480-2030"
    },
    appDownload: {
        title: "Download App",
        appStore: {
            alt: "Download on the App Store",
            href: "#"
        },
        googlePlay: {
            alt: "Get it on Google Play",
            href: "#"
        }
    },
    categories: {
        title: "Most Popular Categories",
        items: [
            'Heating Appliances',
            'Cooling Appliances',
            'Home Entertainment',
            'Refrigeration Appliances',
            'Laundry Appliances',
            'Kitchen Aappliances'
        ]
    },
    customerServices: {
        title: "Customer Services",
        items: [
            "About Us",
            "Terms & Conditions",
            "FAQ",
            "Privacy Policy",
            "E-waste Policy",
            "Cancellation & Return Policy"
        ]
    }
};

interface FooterProps {
    data?: typeof footerData;
}

const Footer: React.FC<FooterProps> = ({ data = footerData }) => {
    return (
        <footer className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Brand and Contact Section */}
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-bold mb-8 italic underline">{data.brand.name}</h2>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>

                            {/* WhatsApp */}
                            <div className="flex items-center mb-4">
                                <MessageCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <div>
                                    <div className="text-sm">WhatsApp</div>
                                    <div className="font-medium">{data.contact.whatsapp}</div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center mb-6">
                                <Phone className="w-5 h-5 mr-3 flex-shrink-0" />
                                <div>
                                    <div className="text-sm">Call Us</div>
                                    <div className="font-medium">{data.contact.phone}</div>
                                </div>
                            </div>
                        </div>

                        {/* App Download */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{data.appDownload.title}</h3>
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                                <a
                                    href={data.appDownload.appStore.href}
                                    className="block transition-transform hover:scale-105"
                                    aria-label={data.appDownload.appStore.alt}
                                >
                                    <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 min-w-[140px]">
                                        <div className="text-white">
                                            <div className="text-xs">Download on the</div>
                                            <div className="text-lg font-semibold">App Store</div>
                                        </div>
                                    </div>
                                </a>

                                <a
                                    href={data.appDownload.googlePlay.href}
                                    className="block transition-transform hover:scale-105"
                                    aria-label={data.appDownload.googlePlay.alt}
                                >
                                    <div className="bg-black rounded-lg px-4 py-2 flex items-center space-x-2 min-w-[140px]">
                                        <div className="text-white">
                                            <div className="text-xs">GET IT ON</div>
                                            <div className="text-lg font-semibold">Google Play</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Most Popular Categories */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6 pb-2 border-b-2 border-white inline-block">
                            {data.categories.title}
                        </h3>
                        <ul className="space-y-3">
                            {data.categories.items.map((category, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        className="text-blue-100 hover:text-white transition-colors duration-200 block py-1"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Services */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-6 pb-2 border-b-2 border-white inline-block">
                            {data.customerServices.title}
                        </h3>
                        <ul className="space-y-3">
                            {data.customerServices.items.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        className="text-blue-100 hover:text-white transition-colors duration-200 block py-1"
                                    >
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Empty column for spacing on larger screens */}
                    <div className="hidden lg:block lg:col-span-1"></div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-blue-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-blue-100 text-sm">
                        {data.brand.copyright}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;