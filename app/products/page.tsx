import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata = {
  title: "Shop Fridges | Fridge Mall",
  description: "Browse our full range of refrigerators with free delivery and pay on delivery.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full px-19 py-10 sm:px-20 bg-[#E2E8F0]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shop fridges</h1>
        <p className="mt-2 text-slate-600">
          {products.length} models available · Free delivery · Pay on delivery
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
