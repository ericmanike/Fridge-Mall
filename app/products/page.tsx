import ProductsListClient from "@/components/ProductsListClient";
import dbConnect from "@/lib/mongoose";
import ProductModel from "@/models/Products";
import { products as staticProducts } from "@/lib/products";

export const metadata = {
  title: "Shop Fridges | Fridge Mall",
  description: "Browse our full range of refrigerators with free delivery and pay on delivery.",
};

export default async function ProductsPage() {
  let products = [];
  try {
    await dbConnect();
    const dbProducts = await ProductModel.find();
    
    // Auto-seed if database is empty
    if (dbProducts.length === 0) {
      console.log("Seeding products to DB from products page...");
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
      products = seeded.map((p: any) => ({
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
    } else {
      products = dbProducts.map((p: any) => ({
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
    }
  } catch (err) {
    console.error("Failed to fetch products from DB, falling back to static:", err);
    products = staticProducts;
  }

  return (
    <div className="px-4 w-full md:px-16 py-10 bg-slate-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop fridges</h1>
        <p className="mt-1 text-sm text-slate-600">
          Find your ideal refrigerator with pay on delivery across Ghana.
        </p>
      </div>
      <ProductsListClient products={products} />
    </div>
  );
}
