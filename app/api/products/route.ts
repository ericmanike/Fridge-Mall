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
    const formattedProducts = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      brand: p.brand,
      price: p.price,
      capacity: p.capacity,
      energyRating: p.energyRating,
      description: p.description,
      features: p.features,
      image: p.image,
      inStock: p.inStock,
    }));

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
    const { name, brand, price, capacity, energyRating, description, features, image, inStock } = body;

    if (!name || !brand || typeof price !== "number" || !capacity || !energyRating || !description || !features || !image) {
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
      image,
      inStock: typeof inStock === "boolean" ? inStock : true,
    });

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
    const { id, name, brand, price, capacity, energyRating, description, features, image, inStock } = body;

    if (!id) {
      return NextResponse.json({ message: "Missing product id" }, { status: 400 });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        price,
        capacity,
        energyRating,
        description,
        features: Array.isArray(features) ? features : features ? features.split(",").map((f: string) => f.trim()) : undefined,
        image,
        inStock,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

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
        inStock: updatedProduct.inStock,
      },
    });
  } catch (error: any) {
    console.error("PUT products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
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

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE products API error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
