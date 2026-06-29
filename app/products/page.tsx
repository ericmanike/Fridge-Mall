import ProductCard from "@/components/ProductCard";
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
    <div className="px-3 w-full md:px-19 py-10  bg-[#E2E8F0]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shop fridges</h1>
        <p className="mt-2 text-slate-600">
          {products.length} models available · Pay on delivery
        </p>
      </div>
      <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
