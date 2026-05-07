import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { productItems } from "@/lib/product-nav";

export default function Productbar() {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-2">
        <details className="group md:hidden">
          <summary
            className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--secondary-btn-color)" }}
          >
            <div className="relative h-4 w-24">
              <Image
                src="/logo.png"
                alt="Sarvadnya Infotech"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            <span className="flex items-center gap-3">
              <span className="text-xs font-semibold sm:text-sm" style={{ color: "var(--heading-color)" }}>
                Menu
              </span>
              <span
                className="text-xs transition-transform duration-300 group-open:rotate-180"
                style={{ color: "var(--secondary-color)" }}
              >
                v
              </span>
            </span>
          </summary>

          <div className="space-y-2 pt-2">
            {productItems.map((item) => (
              <details
                key={item.label}
                className="rounded-md border"
                style={{ borderColor: "var(--secondary-color)" }}
              >
                <summary
                  className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-medium sm:text-sm"
                  style={{ backgroundColor: "var(--secondary-btn-color)", color: "var(--heading-color)" }}
                >
                  <span>{item.label}</span>
                  <span style={{ color: "var(--secondary-color)" }}>+</span>
                </summary>
                <div className="space-y-2 px-2 py-2">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className="block rounded-md px-3 py-2 text-xs transition-transform duration-200 hover:translate-x-1 sm:text-sm"
                      style={{ backgroundColor: "var(--background-color)", color: "var(--para-color)" }}
                    >
                      <span className="block font-semibold" style={{ color: "var(--heading-color)" }}>
                        {subItem.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5">{subItem.description}</span>
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>

        <div className="hidden grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-2 md:grid">
          <Link
            href="/"
            className="productbar-home-tile flex h-11 items-center rounded-md px-3 transition-transform duration-300"
            style={{ backgroundColor: "var(--secondary-btn-color)" }}
          >
            <div className="relative h-8 w-24">
              <Image
                src="/logo.png"
                alt="Sarvadnya Infotech"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          </Link>

          {productItems.map((item) => (
            <div key={item.label} className="group/product relative">
              <Link
                href={item.href}
                className="flex h-11 items-center justify-center rounded-md px-2 text-[11px] font-medium transition-colors duration-200 lg:px-4 lg:text-sm"
                style={{ backgroundColor: "var(--secondary-btn-color)", color: "var(--heading-color)" }}
              >
                <span>{item.label}</span>
                <span
                  className="ml-2 text-[10px] transition-transform duration-300 group-hover/product:rotate-180 group-focus-within/product:rotate-180"
                  style={{ color: "var(--secondary-color)" }}
                >
                  v
                </span>
              </Link>

              <div className="pointer-events-none invisible absolute left-0 top-full z-[220] w-72 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover/product:pointer-events-auto group-hover/product:visible group-hover/product:translate-y-0 group-hover/product:opacity-100 group-focus-within/product:pointer-events-auto group-focus-within/product:visible group-focus-within/product:translate-y-0 group-focus-within/product:opacity-100">
                <div
                  className="mt-2 overflow-hidden rounded-md border p-2 shadow-lg"
                  style={{
                    borderColor: "var(--secondary-color)",
                    backgroundColor: "var(--secondary-btn-color)",
                  }}
                >
                  {item.subItems.map((subItem, index) => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      className="productbar-subitem mb-1 block rounded-md px-3 py-3 transition-all duration-300 last:mb-0 hover:translate-x-1"
                      style={
                        {
                          backgroundColor: "var(--background-color)",
                          transform: "translateY(-8px)",
                          opacity: 0,
                          animation: "none",
                          transitionDelay: `${index * 40}ms`,
                        } as CSSProperties
                      }
                    >
                      <span className="block text-xs font-semibold lg:text-sm" style={{ color: "var(--heading-color)" }}>
                        {subItem.label}
                      </span>
                      <span className="mt-1 block text-[11px] leading-[1.15rem] lg:text-xs lg:leading-5" style={{ color: "var(--para-color)" }}>
                        {subItem.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
