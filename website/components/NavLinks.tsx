"use client";

import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useEffect, useState, useRef } from "react";

const SECTIONS = [
  { href: "#demo", label: "Demo" },
  { href: "#download", label: "Download" },
  { href: "#features", label: "Features" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.href.slice(1));

/** Pixels from top of viewport below which a section is considered "in view" (just under header). */
const TOP_THRESHOLD = 140;

/** While the first section (demo) top is below this share of the viewport, user is still in hero – no active link. */
const HERO_EXIT_VIEWPORT_RATIO = 0.4;

function getActiveSection(): string | null {
  const sections = SECTION_IDS.map((id) => ({
    id,
    el: document.getElementById(id),
  })).filter((s): s is { id: string; el: HTMLElement } => s.el != null);
  if (sections.length === 0) return null;

  const tops = sections.map(({ id, el }) => ({
    id,
    top: el.getBoundingClientRect().top,
  }));

  const firstSectionTop = tops.find((t) => t.id === SECTION_IDS[0])?.top ?? 0;
  if (firstSectionTop > window.innerHeight * HERO_EXIT_VIEWPORT_RATIO) return null;

  const inView = tops.filter(({ top }) => top <= TOP_THRESHOLD);
  if (inView.length === 0) return null;
  return inView.sort((a, b) => b.top - a.top)[0].id;
}

function NavLinkItem({
  href,
  label,
  isActive,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-sm transition-colors ${className} ${
        isActive
          ? "text-violet-600 dark:text-violet-400 font-medium"
          : "text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
      }`}
    >
      {label}
    </a>
  );
}

export function NavLinks() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      setActiveId(getActiveSection());
    }
    requestAnimationFrame(() => requestAnimationFrame(onScroll));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showMenu = mobileOpen || closing;

  useEffect(() => {
    if (showMenu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") startClose();
    }
    if (showMenu) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showMenu]);

  function startClose() {
    if (closing) return;
    setClosing(true);
  }

  function handleDrawerAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (e.animationName === "mobile-drawer-out" && e.target === drawerRef.current) {
      setMobileOpen(false);
      setClosing(false);
    }
  }

  const closeMobile = startClose;

  const desktopCls = "hidden md:flex items-center gap-4";
  const linkCls =
    "text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400";

  return (
    <>
      <div className={desktopCls}>
        {SECTIONS.map(({ href, label }) => {
          const id = href.slice(1);
          return (
            <NavLinkItem
              key={href}
              href={href}
              label={label}
              isActive={activeId === id}
            />
          );
        })}
        <ThemeSwitch />
        <Link
          href="https://github.com/swimshahriar/locademy"
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 text-sm ${linkCls} transition-colors`}
        >
          <Github className="w-4 h-4" />
          GitHub
        </Link>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeSwitch />
        <button
          type="button"
          onClick={() => (mobileOpen ? startClose() : setMobileOpen(true))}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {showMenu && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-slate-950/50 dark:bg-slate-950/70 backdrop-blur-sm md:hidden ${
              closing ? "mobile-backdrop--close" : "mobile-backdrop--open"
            }`}
            aria-hidden
            onClick={closeMobile}
          />
          <div
            ref={drawerRef}
            onAnimationEnd={handleDrawerAnimationEnd}
            className={`fixed top-0 right-0 z-50 w-full max-w-xs h-full border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shadow-xl md:hidden flex flex-col pt-20 px-4 pb-6 ${
              closing ? "mobile-drawer--close" : "mobile-drawer--open"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col gap-1">
              {SECTIONS.map(({ href, label }) => {
                const id = href.slice(1);
                return (
                  <NavLinkItem
                    key={href}
                    href={href}
                    label={label}
                    isActive={activeId === id}
                    onClick={closeMobile}
                    className="block py-3 px-3 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800/80 text-base"
                  />
                );
              })}
              <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
              <Link
                href="https://github.com/swimshahriar/locademy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
                className={`inline-flex items-center gap-2 py-3 px-3 rounded-lg text-base ${linkCls} hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-colors`}
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
