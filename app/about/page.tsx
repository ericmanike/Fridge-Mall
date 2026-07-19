"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Banknote,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  RefreshCw,
  Gift,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "pay-on-delivery" | "what-we-do" | "shipping-warranty";
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  // Pay on Delivery FAQs
  {
    id: "pod-1",
    category: "pay-on-delivery",
    question: "How does Pay on Delivery work at Fridge Mall?",
    answer:
      "With Pay on Delivery, you place your order online without paying anything upfront. We pack and ship your fridge to your specified address. When our delivery agent arrives, you get to inspect the product exterior and packaging. Once you are satisfied, you make payment via Mobile Money (MoMo) or cash directly on delivery.",
  },
  {
    id: "pod-2",
    category: "pay-on-delivery",
    question: "What payment methods are accepted when my fridge is delivered?",
    answer:
      "We accept all major Ghana Mobile Money services (MTN MoMo, Telecel Cash, AT Money) and physical Cash on Delivery. Our delivery team will provide a digital or printed receipt immediately upon payment.",
  },
  {
    id: "pod-3",
    category: "pay-on-delivery",
    question: "Do I need to pay any deposit before shipping?",
    answer:
      "No! For deliveries within Greater Accra, Kumasi, and major town centers, zero upfront deposit is required. You only pay when the fridge arrives at your door.",
  },
  {
    id: "pod-4",
    category: "pay-on-delivery",
    question: "Can I inspect the fridge before I make payment?",
    answer:
      "Yes, absolutely! We encourage all customers to inspect the fridge exterior, dimensions, and accessories upon delivery. Our delivery drivers are instructed to wait while you verify that the appliance matches your expectation.",
  },
  {
    id: "pod-5",
    category: "pay-on-delivery",
    question: "What if the fridge is damaged or not what I ordered?",
    answer:
      "If you notice any defect, damage, or discrepancy during delivery, you have full right to decline the item on the spot without paying a single Cedi. We will immediately arrange a replacement unit for you.",
  },

  // What We Do FAQs
  {
    id: "wwd-1",
    category: "what-we-do",
    question: "What is Fridge Mall and what do you do?",
    answer:
      "Fridge Mall is Ghana's leading specialized online marketplace for refrigerators, chest freezers, side-by-side fridges, and cooling appliances. We connect customers directly with verified appliance distributors, offering top global brands (LG, Samsung, Hisense, Bruhm, Midea) at affordable prices with hassle-free doorstep delivery.",
  },
  {
    id: "wwd-2",
    category: "what-we-do",
    question: "Are all fridges brand new and authentic?",
    answer:
      "Yes, 100% guaranteed! We only source brand-new, factory-sealed refrigerators directly from authorized brand distributors. Every unit comes with manufacturer seals and official warranty protection.",
  },
  {
    id: "wwd-3",
    category: "what-we-do",
    question: "How does your Refer & Earn GHS 50 program work?",
    answer:
      "When you create an account on Fridge Mall, you get a unique referral code in your dashboard. Share it with friends, family, or colleagues. When someone completes an order using your link or code, GHS 50 is instantly credited to your referral balance, which you can withdraw anytime!",
  },
  {
    id: "wwd-4",
    category: "what-we-do",
    question: "Do you offer customer support after purchase?",
    answer:
      "Yes! Our dedicated support team is available via phone (+233 24 757 4980) and email (support@fridgemall.com.gh) to assist you with installation queries, user manuals, and warranty claims.",
  },

  // Shipping & Warranty FAQs
  {
    id: "sw-1",
    category: "shipping-warranty",
    question: "Which areas in Ghana do you deliver to?",
    answer:
      "We deliver directly to your doorstep across Greater Accra (Accra, Tema, Kasoa, Madina, Spintex, East Legon, etc.) and Ashanti Region (Kumasi metro). For other regions across Ghana, we coordinate fast freight dispatch.",
  },
  {
    id: "sw-2",
    category: "shipping-warranty",
    question: "How long does delivery take after ordering?",
    answer:
      "Most orders in Accra and Kumasi are delivered within 24 to 48 hours. Same-day express delivery is also available for express requests made before 11:00 AM.",
  },
  {
    id: "sw-3",
    category: "shipping-warranty",
    question: "What warranty comes with the fridges?",
    answer:
      "All fridges purchased through Fridge Mall carry standard manufacturer warranties ranging from 1 to 10 years (depending on the brand and compressor warranty). We assist you in processing any warranty requests seamlessly.",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pay-on-delivery" | "what-we-do" | "shipping-warranty"
  >("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("pod-1");

  const filteredFaqs = faqs.filter((faq) => {
    return activeTab === "all" || faq.category === activeTab;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-[#252260] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -left-16 -top-16 h-80 w-80 rounded-full bg-emerald-500 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 text-xs sm:text-sm font-semibold text-emerald-300 mb-6">
            <span>Ghana&apos;s #1 Dedicated Fridge Store</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            About <span className="text-emerald-400">Fridge Mall</span> &amp; Our Pay on Delivery Promise
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We are revolutionizing appliance shopping in Ghana by delivering genuine, top-brand refrigerators directly to your door with zero upfront risk.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-emerald-300 border border-white/10">
              <Banknote className="h-4 w-4 text-emerald-400" /> Pay on Delivery (MoMo &amp; Cash)
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-blue-300 border border-white/10">
              <Truck className="h-4 w-4 text-blue-400" /> Fast Doorstep Delivery
            </span>
            <span className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-amber-300 border border-white/10">
              <ShieldCheck className="h-4 w-4 text-amber-400" /> 100% Original Brands
            </span>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#0066FF] mb-2">
                What We Do
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Making Home &amp; Commercial Cooling Accessible across Ghana
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-base">
                At <strong>Fridge Mall</strong>, we specialize exclusively in refrigerators, freezers, and cooling appliances. We know how essential a dependable fridge is for Ghanaian homes, food vendors, and businesses.
              </p>
              <p className="mt-3 text-slate-600 leading-relaxed text-base">
                We bridge the gap between world-class appliance manufacturers and customers by providing an effortless online storefront, transparent pricing, authentic products, and convenient <strong>Pay on Delivery</strong> options.
              </p>
            </div>

            {/* How Pay on Delivery Works Step-by-Step */}
            <div className="rounded-3xl bg-[#252260] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Banknote className="h-6 w-6 text-emerald-400" />
                How Pay on Delivery Works
              </h3>

              <div className="space-y-6 relative">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Select &amp; Order Online</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Choose your preferred fridge on our website and place your order without entering any payment card details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Order Confirmation Call</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Our customer service team contacts you to verify delivery address and schedule delivery time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Doorstep Inspection</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Our driver brings your fridge to your home or office. Inspect the appliance to ensure complete satisfaction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Pay &amp; Receive Receipt</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Pay via Mobile Money (MoMo) or Cash to the agent. Receive your official receipt and enjoy your new fridge!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> 100% Risk Free Guarantee
                </span>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 font-bold text-white hover:text-emerald-300 transition-colors"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Dropdowns Section */}
      <section id="faqs" className="py-16 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
              <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Got Questions? We Have Answers.
            </h2>
            <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
              Everything you need to know about our Pay on Delivery policy, products, and doorstep service in Ghana.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#252260] text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50"
                }`}
              >
                All FAQs
              </button>
              <button
                onClick={() => setActiveTab("pay-on-delivery")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "pay-on-delivery"
                    ? "bg-[#252260] text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50"
                }`}
              >
                Pay on Delivery
              </button>
              <button
                onClick={() => setActiveTab("what-we-do")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "what-we-do"
                    ? "bg-[#252260] text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50"
                }`}
              >
                What We Do
              </button>
              <button
                onClick={() => setActiveTab("shipping-warranty")}
                className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "shipping-warranty"
                    ? "bg-[#252260] text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50"
                }`}
              >
                Shipping &amp; Warranty
              </button>
            </div>
          </div>

          {/* Accordion List */}
          <div className="mt-8 space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 text-center shadow-md text-slate-500">
                <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No matching questions found.</p>
                <p className="text-xs mt-1">Try switching category tabs.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-900 transition-colors hover:bg-slate-50/70"
                    >
                      <span className="text-base sm:text-lg pr-4 flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-extrabold">
                          Q
                        </span>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#0066FF]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-[#252260] to-[#1e1b4b] p-8 sm:p-12 text-white shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Have more questions or need help placing an order?</h3>
            <p className="mt-3 text-slate-200 text-sm sm:text-base max-w-xl mx-auto">
              Our customer happiness team in Accra is ready to answer your calls and guide you to the perfect fridge.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:+233247574980"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600 transition-all hover:scale-105"
              >
                <PhoneCall className="h-4 w-4" /> Call +233 24 757 4980
              </a>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#252260] shadow-md hover:bg-slate-100 transition-all hover:scale-105"
              >
                Browse All Fridges <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
