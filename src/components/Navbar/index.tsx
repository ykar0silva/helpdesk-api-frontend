import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, LayoutDashboard, Users, UserCircle, FolderOpen, DollarSign } from "lucide-react";
import logoHelpTI from "@/assets/images/logo-helpti-bg.png";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tecnicos", label: "Técnicos", icon: Users },
  { href: "/clientes", label: "Clientes", icon: UserCircle },
  { href: "/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex h-14 items-center justify-between">
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
                <img
                src={logoHelpTI}
                alt="HelpTI Logo"
                className="h-8 w-auto object-contain"
                />
            </Link>

            {/* Desktop Navigation - Centralizado */}
            <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                    <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    </Link>
                );
                })}
            </nav>

            {/* Desktop Logout Button */}
            <div className="hidden md:flex items-center">
                <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-14 text-gray-600 hover:text-red-600  transition-colors "
                onClick={() => {
                    // TODO: Implementar logout
                    console.log("Logout");
                }}
                >
                <LogOut className=" h-4 w-14 mr-2" />
                Sair
                </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-white">
                <div className="flex flex-col gap-6 mt-6">
                    
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 px-2">
                    <img
                        src={logoHelpTI}
                        alt="HelpTI Logo"
                        className="h-8 w-auto object-contain"
                    />
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            active
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </Link>
                        );
                    })}
                    </nav>

                    {/* Mobile Logout */}
                    <div className="mt-auto pt-6 border-t border-gray-200">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                        setIsOpen(false);
                        // TODO: Implementar logout
                        console.log("Logout");
                        }}
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sair
                    </Button>
                    </div>
                </div>
                </SheetContent>
            </Sheet>
            </div>
        </div>
    </header>
  );
}