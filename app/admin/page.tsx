'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Plus, IndianRupee, Camera, Check, AlertCircle, Package, Percent } from 'lucide-react';
import { ProductImage, ProductData } from '@/app/types/product';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';

const ProductUploadForm: React.FC = () => {
    const [images, setImages] = useState<ProductImage[]>([]);
    const [productData, setProductData] = useState<ProductData>({
        name: '',
        description: '',
        specifications: '',
        price: '',
        discount: '',
        category: '',
        brand: '',
        stock: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errors, setErrors] = useState<Partial<ProductData>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = [
        { value: '', label: 'Select category' },
        { value: 'heating-appliances', label: 'Heating Appliances' },
        { value: 'cooling-appliances', label: 'Cooling Appliances' },
        { value: 'home-entertainment', label: 'Home Entertainment' },
        { value: 'refrigeration-appliances', label: 'Refrigeration Appliances' },
        { value: 'laundry-appliances', label: 'Laundry Appliances' },
        { value: 'kitchen-appliances', label: 'Kitchen Appliances' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            if (images.length < 3 && file.type.startsWith('image/')) {
                const preview = URL.createObjectURL(file);
                const newImage: ProductImage = {
                    id: Date.now().toString() + Math.random().toString(),
                    file,
                    preview
                };
                setImages(prev => [...prev, newImage]);
            }
        });

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== id);
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ProductData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ProductData> = {};

        if (!productData.name.trim()) newErrors.name = 'Product name is required';
        if (!productData.description.trim()) newErrors.description = 'Description is required';
        if (!productData.price.trim()) newErrors.price = 'Price is required';
        if (!productData.discount.trim()) newErrors.discount = 'Discount is required';
        if (!productData.category.trim()) newErrors.category = 'Category is required';
        if (!productData.stock.trim()) newErrors.stock = 'Stock quantity is required';

        if (productData.price && isNaN(Number(productData.price))) {
            newErrors.price = 'Price must be a valid number';
        }

        if (productData.price && Number(productData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (productData.discount && isNaN(Number(productData.discount))) {
            newErrors.discount = 'Discount must be a valid number';
        }

        if (productData.discount && (Number(productData.discount) < 0 || Number(productData.discount) > 100)) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        if (productData.stock && isNaN(Number(productData.stock))) {
            newErrors.stock = 'Stock must be a valid number';
        }

        if (productData.stock && Number(productData.stock) < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (images.length === 0) {
            alert('Please upload at least one product image');
            return;
        }

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            const formData = new FormData();

            // Append images
            images.forEach((image) => {
                formData.append('images', image.file);
            });

            // Append product data
            Object.entries(productData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Debug logging
            console.log('Sending product data:', productData);
            console.log('Category being sent:', productData.category);

            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                setUploadSuccess(true);
                // Reset form
                setProductData({
                    name: '',
                    description: '',
                    specifications: '',
                    price: '',
                    discount: '',
                    category: '',
                    brand: '',
                    stock: ''
                });
                setImages([]);
                setErrors({});
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setUploadSuccess(false);
                }, 3000);
            } else {
                throw new Error(result.error || 'Upload failed');
            }

        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Package className="h-8 w-8" />
                            Add New Product
                        </h1>
                        <p className="text-blue-100 mt-2">Upload your product images and details</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {uploadSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                                <Check className="h-5 w-5 text-green-600" />
                                <span className="text-green-800">Product uploaded successfully!</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Product Images ({images.length}/3)
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={image.preview}
                                                alt="Product preview"
                                                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => removeImage(image.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {images.length < 3 && (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                        >
                                            <Plus className="h-8 w-8 text-gray-400 mb-2" />
                                            <span className="text-gray-600">Add Image</span>
                                            <span className="text-sm text-gray-400">PNG, JPG up to 10MB</span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            {/* Product Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <Input
                                        label="Product Name"
                                        name="name"
                                        value={productData.name}
                                        onChange={handleInputChange}
                                        error={errors.name}
                                        placeholder="Enter product name"
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={productData.category}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>

                                    <Input
                                        label="Brand"
                                        name="brand"
                                        value={productData.brand}
                                        onChange={handleInputChange}
                                        placeholder="Enter brand name"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <Input
                                        label="Price"
                                        name="price"
                                        type="number"
                                        value={productData.price}
                                        onChange={handleInputChange}
                                        error={errors.price}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
                                        required
                                    />
                                    
                                    <Input
                                        label="Discount (%)"
                                        name="discount"
                                        type="number"
                                        value={productData.discount}
                                        onChange={handleInputChange}
                                        error={errors.discount}
                                        placeholder="0"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        icon={<Percent className="h-5 w-5 text-gray-400" />}
                                        required
                                    />

                                    <Input
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        value={productData.stock}
                                        onChange={handleInputChange}
                                        error={errors.stock}
                                        placeholder="Available quantity"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={productData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Describe your product in detail..."
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specifications
                                </label>
                                <textarea
                                    name="specifications"
                                    value={productData.specifications}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Technical specifications, dimensions, materials, etc."
                                />
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button
                                    type="submit"
                                    loading={isUploading}
                                    size="lg"
                                    className="flex items-center gap-2"
                                    disabled={isUploading}
                                >
                                    <Upload className="h-5 w-5" />
                                    {isUploading ? 'Uploading...' : 'Upload Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductUploadForm;