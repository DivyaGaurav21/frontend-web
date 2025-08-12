import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Product from "@/app/models/Product";
import { uploadImage } from "@/app/lib/cloudinary";
import { ApiResponse } from "@/app/types/product";

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();

    // Parse form data
    const formData = await request.formData();

    // Extract product data from form
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      specifications: formData.get("specifications") as string,
      price: parseFloat((formData.get("price") as string) || "0"),
      discount: parseFloat((formData.get("discount") as string) || "0"),
      category: formData.get("category") as string,
      brand: formData.get("brand") as string,
      stock: parseInt((formData.get("stock") as string) || "0"),
    };

    // Validate required fields
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.category ||
      !productData.stock
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      'heating-appliances', 
      'cooling-appliances', 
      'home-entertainment', 
      'refrigeration-appliances', 
      'laundry-appliances', 
      'kitchen-appliances'
    ];

    if (!validCategories.includes(productData.category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Handle image files
    const imageFiles: File[] = [];
    
    // Get all files with the 'images' key
    const files = formData.getAll("images") as File[];
    
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        // Validate file type
        if (!file.type.includes("image")) {
          return NextResponse.json(
            {
              success: false,
              error: "Only image files are allowed",
            },
            { status: 400 }
          );
        }
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json(
            {
              success: false,
              error: "File size must be less than 10MB",
            },
            { status: 400 }
          );
        }
        
        imageFiles.push(file);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one image is required",
        },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      try {
        // Convert File to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const imageUrl = await uploadImage(buffer);
        imageUrls.push(imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to upload image",
          },
          { status: 500 }
        );
      }
    }

    // Save product to database
    const product = new Product({
      ...productData,
      images: imageUrls,
    });

    const savedProduct = await product.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          productId: savedProduct._id,
          message: "Product created successfully",
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${validationErrors.join(', ')}`,
          validationErrors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // If ID is provided, get single product
    if (id) {
      const product = await Product.findById(id);
      
      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: "Product not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          data: product,
        },
        { status: 200 }
      );
    }

    // Build query object for filtering
    const query: any = {};

    if (category) {
      query.category = category;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination and sorting
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: products,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error fetching products:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": 
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}