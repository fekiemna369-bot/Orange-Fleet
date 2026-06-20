import { Truck, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/#services", label: "Services" },
    { href: "/#about", label: "À propos" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-white group-hover:bg-primary/90 transition-colors">
            <Truck size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Hammami<span className="text-primary">Transport</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/admin">
            <Button className="font-semibold rounded-full px-6">
              Tableau de bord
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t bg-white absolute top-20 left-0 w-full shadow-lg">
          <ul className="flex flex-col py-4 px-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-base font-medium ${
                    location === link.href ? "text-primary" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t">
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button className="w-full font-semibold rounded-full">
                  Tableau de bord
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
