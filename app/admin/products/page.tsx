"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Package,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCurrency } from "@/lib/utils";
import { CldUploadWidget } from "next-cloudinary";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  capacity: string;
  energyRating: string;
  description: string;
  features: string[];
  image: string;
  images?: string[];
  inStock: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [energyRating, setEnergyRating] = useState("5");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<string[]>(["/fridges/lg-double-door.svg", "", ""]);
  const [inStock, setInStock] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      } else {
        toast.error("Failed to load products");
      }
    } catch (err) {
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setBrand("");
    setPrice("");
    setCapacity("");
    setEnergyRating("5");
    setDescription("");
    setFeatures("");
    setImages(["/fridges/lg-double-door.svg", "", ""]);
    setInStock(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price.toString());
    setCapacity(product.capacity);
    setEnergyRating(product.energyRating);
    setDescription(product.description);
    setFeatures(product.features.join(", "));
    const existing = product.images && product.images.length > 0 ? product.images : [product.image];
    setImages([existing[0] || "", existing[1] || "", existing[2] || ""]);
    setInStock(product.inStock);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !price || !capacity || !description || !features) {
      toast.error("Please fill out all fields");
      return;
    }

    const validImages = images.map((img) => img.trim()).filter(Boolean);
    if (validImages.length === 0) {
      toast.error("Please add at least 1 product image");
      return;
    }

    setSaving(true);
    const parsedPrice = parseFloat(price);
    const featuresArray = features.split(",").map((f) => f.trim()).filter(Boolean);

    try {
      const method = editingProduct ? "PUT" : "POST";
      const payload = editingProduct
        ? { id: editingProduct.id, name, brand, price: parsedPrice, capacity, energyRating, description, features: featuresArray, image: validImages[0], images: validImages, inStock }
        : { name, brand, price: parsedPrice, capacity, energyRating, description, features: featuresArray, image: validImages[0], images: validImages, inStock };

      const res = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save product");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          inStock: !product.inStock,
        }),
      });

      if (res.ok) {
        toast.success(`Stock updated for ${product.name}`);
        fetchProducts();
      } else {
        toast.error("Failed to toggle stock status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, and manage refrigerator stock listings.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-bold text-white transition cursor-pointer shadow-lg shadow-blue-600/10"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Fridge Product
        </button>
      </div>

      {/* Search Filter bar */}
      <div className="relative flex items-center max-w-md">
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search fridges by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
        />
      </div>

      {/* Products list area */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-800">No products found</h3>
          <p className="text-sm text-slate-500">Get started by adding your first product.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {product.brand}
                  </span>
                  <button
                    onClick={() => handleToggleStock(product)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
                  >
                    {product.inStock ? (
                      <ToggleRight className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-slate-300" />
                    )}
                    <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                  </button>
                </div>
                <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="mt-2 text-2xl font-black text-slate-950">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-semibold">
                    Cap: {product.capacity}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-semibold">
                    Rating: {product.energyRating} Stars
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => openEditModal(product)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               
                {editingProduct ? "Edit Fridge Specifications" : "Add Fridge Listing"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Product Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. LG 450L Double Door"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Brand</span>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. LG, Samsung, Midea"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Price (GHS)</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4200"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Capacity</span>
                  <input
                    type="text"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 450L"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-slate-600">Star Rating</span>
                  <select
                    value={energyRating}
                    onChange={(e) => setEnergyRating(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold text-slate-600">Description</span>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Spacious double-door fridge with frost-free technology..."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-slate-600">
                  Key Features (comma-separated)
                </span>
                <input
                  type="text"
                  required
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Frost-free cooling, LED lighting, Adjustable shelves"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </label>

              {/* Multi Image Upload Section (Up to 3 images) */}
              <div className="space-y-3 border-t border-b border-slate-100 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Product Images (Up to 3)
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {images.filter(Boolean).length} of 3 uploaded
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex flex-col items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
                      <span className="text-[11px] font-bold text-slate-600">
                        {idx === 0 ? "Main Image *" : `Image ${idx + 1}`}
                      </span>

                      {/* Thumbnail Preview */}
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-white overflow-hidden relative shadow-xs">
                        {images[idx] ? (
                          <img src={images[idx]} alt={`Slot ${idx + 1}`} className="h-full w-full object-contain p-1" />
                        ) : (
                          <span className="text-slate-350 text-[10px] font-bold">No Image</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 w-full">
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "fridgemall_products"}
                          onSuccess={(result) => {
                            if (result.info && typeof result.info !== "string") {
                              const url = (result.info as any).secure_url;
                              setImages((prev) => {
                                const newImgs = [...prev];
                                newImgs[idx] = url;
                                return newImgs;
                              });
                              toast.success(`Image ${idx + 1} uploaded!`);
                            }
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="flex-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 py-1 text-xs font-bold text-blue-600 transition cursor-pointer"
                            >
                              Upload
                            </button>
                          )}
                        </CldUploadWidget>

                        {images[idx] && (
                          <button
                            type="button"
                            onClick={() => {
                              setImages((prev) => {
                                const newImgs = [...prev];
                                newImgs[idx] = "";
                                return newImgs;
                              });
                            }}
                            className="rounded-lg p-1 bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer border border-red-200"
                            title="Remove Image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="modalInStock"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="modalInStock" className="text-sm font-bold text-slate-700 select-none">
                  Product is In Stock
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-bold text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
