import Link from "next/link";
import { Check } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900">Fridge <span className="text-[#0066FF] font-extrabold"> Mall</span></p>
            <p className="mt-2 text-sm text-slate-600">
              Ghana&apos;s trusted online fridge store. Browse, order, and pay
              when we deliver to your door — delivery is always free.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/products" className="hover:text-[#0066FF]">
                  Shop fridges
                </Link>
              </li>
              <li>
                <Link href="/referral" className="hover:text-[#0066FF]">
                  Refer &amp; earn GHS 50
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#0066FF]">
                  Your cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900">How it works</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {[
                "Free nationwide delivery",
                "Pay on delivery (cash or MoMo)",
                "GHS 50 instant referral reward",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Fridge Mall. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
