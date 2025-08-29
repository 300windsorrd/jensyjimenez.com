"use client";
import Link from "next/link";
import { site } from "@/site.config";

export function FooterColumns() {
  return (
    <footer className="border-t mt-16 bg-[var(--brand-50)]/30">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-10 text-sm">
        <div>
          <div className="font-semibold">{site.name}</div>
          <div className="mt-2 opacity-80">{site.orgType}</div>
          <div className="mt-2 opacity-80">{site.address}</div>
          <div className="mt-1 opacity-80">{site.phone}</div>
        </div>
        <div>
          <div className="font-semibold">Navigate</div>
          <ul className="mt-2 grid gap-1">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Hours</div>
          <div className="mt-2 opacity-80">See our contact page for hours.</div>
        </div>
        <div>
          <div className="font-semibold">Newsletter</div>
          <p className="mt-2 opacity-80">Get occasional updates.</p>
          <form className="mt-3 grid gap-2 max-w-xs" onSubmit={(e)=>e.preventDefault()}>
            <input className="border rounded-md px-3 py-2" placeholder="Email" type="email" />
            <button className="rounded-md bg-[var(--brand-500)] text-white px-3 py-2">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs opacity-70">© {new Date().getFullYear()} {site.name}</div>
      </div>
    </footer>
  );
}


