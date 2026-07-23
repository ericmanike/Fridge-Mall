import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Products";
import User from "@/models/User";
import { products as staticProducts } from "@/lib/products";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function GET() {
  try {
    await dbConnect();
    let products = await ProductModel.find();

    // Auto-seed database if empty
    if (products.length === 0) {
      console.log("Seeding products to database...");
      // Adapt static products format to DB schema if needed
      const seeded = await ProductModel.insertMany(
        staticProducts.map((p) => ({
          name: p.name,
          brand: p.brand,
          price: p.price,
          capacity: p.capacity,
          energyRating: p.energyRating,
          description: p.description,
          features: p.features,
          image: p.image,
          inStock: p.inStock,
        }))
      );
      products = seeded;
    }

    // Map _id to id for frontend compatibility
    const formattedProducts = products.map((p: any) => {
      const imgs = Array.isArray(p.images) && p.images.length > 0
        ? p.images.filter((img: string) => Boolean(img)).slice(0, 3)
        : (p.image ? [p.image] : []);
      return {
        id: p._id.toString(),
        name: p.name,
        brand: p.brand,
        price: p.price,
        capacity: p.capacity,
        energyRating: p.energyRating,
        description: p.description,
        features: p.features,
        image: imgs[0] || p.image || "",
        images: imgs.length > 0 ? imgs : [p.image || ""],
        inStock: p.inStock,
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error: any) {
    console.error("GET products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const { name, brand, price, capacity, energyRating, description, features, image, images, inStock } = body;

    let processedImages: string[] = [];
    if (Array.isArray(images)) {
      processedImages = images.filter((img: any) => typeof img === "string" && img.trim() !== "").slice(0, 3);
    }
    if (processedImages.length === 0 && image) {
      processedImages = [image];
    }
    const primaryImage = processedImages[0] || image || "";

    if (!name || !brand || typeof price !== "number" || !capacity || !energyRating || !description || !features || !primaryImage) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await ProductModel.create({
      name,
      brand,
      price,
      capacity,
      energyRating,
      description,
      features: Array.isArray(features) ? features : features.split(",").map((f: string) => f.trim()),
      image: primaryImage,
      images: processedImages,
      inStock: typeof inStock === "boolean" ? inStock : true,
    });

    const returnedImgs = newProduct.images && newProduct.images.length > 0 ? newProduct.images : [newProduct.image];

    return NextResponse.json({
      message: "Product created successfully",
      product: {
        id: newProduct._id.toString(),
        name: newProduct.name,
        brand: newProduct.brand,
        price: newProduct.price,
        capacity: newProduct.capacity,
        energyRating: newProduct.energyRating,
        description: newProduct.description,
        features: newProduct.features,
        image: newProduct.image,
        images: returnedImgs,
        inStock: newProduct.inStock,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, brand, price, capacity, energyRating, description, features, image, images, inStock } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing product id" }, { status: 400 });
    }

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (brand !== undefined) updateFields.brand = brand;
    if (price !== undefined) updateFields.price = price;
    if (capacity !== undefined) updateFields.capacity = capacity;
    if (energyRating !== undefined) updateFields.energyRating = energyRating;
    if (description !== undefined) updateFields.description = description;
    if (features !== undefined) {
      updateFields.features = Array.isArray(features) ? features : features ? features.split(",").map((f: string) => f.trim()) : undefined;
    }
    if (inStock !== undefined) updateFields.inStock = inStock;

    if (Array.isArray(images)) {
      const processedImages = images.filter((img: any) => typeof img === "string" && img.trim() !== "").slice(0, 3);
      updateFields.images = processedImages;
      if (processedImages.length > 0) {
        updateFields.image = processedImages[0];
      }
    } else if (image !== undefined) {
      updateFields.image = image;
      updateFields.images = [image];
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const returnedImgs = updatedProduct.images && updatedProduct.images.length > 0 ? updatedProduct.images : [updatedProduct.image];

    return NextResponse.json({
      message: "Product updated successfully",
      product: {
        id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        price: updatedProduct.price,
        capacity: updatedProduct.capacity,
        energyRating: updatedProduct.energyRating,
        description: updatedProduct.description,
        features: updatedProduct.features,
        image: updatedProduct.image,
        images: returnedImgs,
        inStock: updatedProduct.inStock,
      },
    });
  } catch (error: any) {
    console.error("PUT products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// @ts-ignore
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

function getCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let path = parts[1];
    path = path.replace(/^v\d+\//, "");
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch {
    return null;
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing product id" }, { status: 400 });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Automatically delete associated images from Cloudinary
    const imageUrls = new Set<string>();
    if (deletedProduct.image) imageUrls.add(deletedProduct.image);
    if (Array.isArray(deletedProduct.images)) {
      deletedProduct.images.forEach((img: string) => {
        if (img) imageUrls.add(img);
      });
    }

    for (const url of imageUrls) {
      const publicId = getCloudinaryPublicId(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Successfully deleted Cloudinary asset: ${publicId}`);
        } catch (err) {
          console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
        }
      }
    }

    return NextResponse.json({ message: "Product and associated images deleted successfully" });
  } catch (error: any) {
    console.error("DELETE products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
