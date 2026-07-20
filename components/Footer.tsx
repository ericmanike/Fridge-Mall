"use client"
import Link from "next/link";
import { Check, Phone, Mail, MapPin, ChevronRight, Truck, Banknote, Gift } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Footer() {
  const pathname = usePathname();
  
  if (
    pathname === "/auth/login" || 
    pathname === "/auth/signIn" ||
    pathname === "/auth/signUp" ||
    pathname === "/auth/register" || 
    pathname === "/dashboard" || 
    pathname === "/dashboard/orders" ||
    pathname === "/dashboard/referral" ||
    pathname === "/dashboard/profile" ||
    pathname === "/admin" || 
    pathname === "/admin/products" || 
    pathname === "/admin/orders" || 
    pathname === "/admin/users"  ||
    pathname === "/admin/withdrawals"

  ) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-emerald-900/30 bg-[#252260]  text-slate-350">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3">
            <p className="text-xl font-bold text-white tracking-tight">
            <Image src={'/footerlogo.png'} width={160} height={120} alt=" Fridge Mall logo"  />
            </p>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Ghana&apos;s trusted online fridge store. Browse, order, and pay
              when we deliver to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-bold text-white tracking-wider text-xs uppercase mb-4 text-emerald-400">
              Quick links
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Shop fridges
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  About us
                </Link>
              </li>
              <li>
                <Link href="/about#faqs" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Pay on Delivery FAQs
                </Link>
              </li>
              <li>
                <Link href="/dashboard/referral" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Refer &amp; earn GHS 50
                </Link>
              </li>
              <li>
                <Link href="/cart" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors duration-150">
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Your cart
                </Link>
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <p className="font-bold text-white tracking-wider text-xs uppercase mb-4 text-emerald-400">
              How it works
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <span>We deliver in Accra, Kumasi and beyond.</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
                  <Banknote className="h-3.5 w-3.5" />
                </div>
                <Link href="/about#faqs" className="hover:text-white transition-colors duration-150">
                  Pay on delivery (cash/MoMo)
                </Link>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 shrink-0">
                  <Gift className="h-3.5 w-3.5" />
                </div>
                <Link href="/dashboard/referral" className="hover:text-white transition-colors duration-150">
                  GHS 50 instant reward
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <p className="font-bold text-white tracking-wider text-xs uppercase mb-4 text-emerald-400">
              Contact us
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span>+233 24 757 4980</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <a href="mailto:support@fridgemall.com" className="truncate"
                 onClick={(e) => e.stopPropagation()}>support@fridgemall.com</a>
              </li>

              <li className="flex items-start gap-2.5 text-slate-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>Accra - Kumasi, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-900/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Fridge Mall. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

