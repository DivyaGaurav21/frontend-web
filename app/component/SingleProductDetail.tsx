import React, { useState, useRef } from 'react';
import { Star, ShoppingCart, Verified, Home, ChevronRight } from 'lucide-react';

// Types
interface Product {
  _id: string;
  name: string;
  description: string;
  specifications: string;
  price: number;
  discount: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// Breadcrumb Component
const BreadCrumbs = ({ breadCrumbs }: { breadCrumbs: BreadcrumbItem[] }) => (
  <nav className="bg-gray-50 px-4 py-3">
    <div className="container max-w-screen-xl mx-auto">
      <div className="flex items-center space-x-2 text-sm">
        {breadCrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            <a 
              href={crumb.url}
              className={`${
                index === breadCrumbs.length - 1 
                  ? 'text-gray-600 cursor-default' 
                  : 'text-cyan-500 hover:text-cyan-800'
              }`}
            >
              {index === 0 && <Home className="w-4 h-4 inline mr-1" />}
              {crumb.name}
            </a>
          </React.Fragment>
        ))}
      </div>
    </div>
  </nav>
);

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))}
  </div>
);

// Main Product Detail Component
const SingleProductDetail = ({ productData }: { productData: Product }) => {
  const [selectedImage, setSelectedImage] = useState(productData?.images[0] || '');
  const imgRef = useRef<HTMLImageElement>(null);

  // Function to set image preview when clicked on thumbnail
  const setImgPreview = (url: string) => {
    setSelectedImage(url);
    if (imgRef.current) {
      imgRef.current.src = url;
    }
  };

  const inStock = productData?.stock >= 1;

  // Calculate original price and savings
  const originalPrice = Math.round(productData.price / (1 - productData.discount / 100));
  const savings = originalPrice - productData.price;

  // Breadcrumbs for navigation
  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    {
      name: `${productData?.name?.substring(0, 50)}${productData?.name?.length > 50 ? '...' : ''}`,
      url: `/products/${productData?._id}`,
    },
  ];

  const addToCartHandler = () => {
    // Add your cart logic here
    console.log('Added to cart:', productData.name);
  };

  return (
    <>
      {/* Breadcrumbs for navigation */}
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      
      <section className="bg-white py-6 md:py-10">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8">
            
            {/* Product Images Section */}
            <aside className="order-1 lg:order-1">
              {/* Main Product Image */}
              <div className="border border-gray-200 shadow-sm  text-center rounded-lg mb-4 bg-gray-50">
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[450px] mx-auto">
                  <img
                    ref={imgRef}
                    className="w-full h-full object-cover rounded-lg"
                    src={selectedImage || "/images/default_product.png"}
                    alt={productData?.name}
                  />
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                {productData?.images?.map((img, index) => (
                  <button
                    key={index}
                    className={`border-2 p-1 rounded-lg hover:border-blue-500 cursor-pointer transition-colors ${
                      selectedImage === img ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setImgPreview(img)}
                  >
                    <img
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                      src={img}
                      alt={`${productData?.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </aside>

            {/* Product Details Section */}
            <main className="order-2 lg:order-2">
              {/* Product Title */}
              <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 text-gray-900 leading-tight">
                {productData?.name}
              </h1>

              {/* Rating Section */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <StarRating rating={4.2} />
                <span className="text-cyan-800 font-semibold">4.2</span>
                <div className="flex items-center text-green-600">
                  <Verified className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ₹{productData?.price?.toLocaleString()}
                  </span>
                  {productData.discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{originalPrice?.toLocaleString()}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                        {productData.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                {productData.discount > 0 && (
                  <p className="text-green-600 font-semibold">
                    You save ₹{savings?.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {productData?.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="mb-6">
                <button
                  onClick={addToCartHandler}
                  disabled={!inStock}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    inStock
                      ? 'bg-primary hover:bg-cyan-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Product Details</h3>
                <ul className="space-y-2">
                  <li className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-700 w-full sm:w-36">Stock:</span>
                    {inStock ? (
                      <span className="text-green-600 font-bold">
                        In Stock ({productData?.stock} available)
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold">Out of Stock</span>
                    )}
                  </li>
                  <li className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-700 w-full sm:w-36">Category:</span>
                    <span className="text-gray-600 capitalize">
                      {productData?.category?.replace('-', ' ')}
                    </span>
                  </li>
                  <li className="flex flex-col sm:flex-row">
                    <span className="font-medium text-gray-700 w-full sm:w-36">Brand:</span>
                    <span className="text-gray-600">{productData?.brand}</span>
                  </li>
                </ul>
              </div>
            </main>
          </div>

          {/* Specifications Section */}
          {productData?.specifications && (
            <div className="mb-8">
              <hr className="mb-6" />
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {productData.specifications}
                </p>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <hr className="mb-6" />
            <div className="font-semibold">
              <h2 className="text-gray-700 text-2xl mb-6">
                Customer Reviews
              </h2>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProductDetail;