import React from 'react';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#f3e8ff] text-gray-700 pt-12 pb-6 mt-12 border-t-2 border-[#e9d5ff]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/baby/Logobg.png" alt="Olea Baby Store" className="h-10" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#4b2990] bg-clip-text text-transparent">
               
              </span>
            </div>
            <p className="text-gray-600">
              Premium baby clothes, toys, and accessories that combine comfort, style, and love for your little ones.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#6C63FF] hover:text-[#4b2990] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#6C63FF] hover:text-[#4b2990] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#4b2990]">Quick Links</h4>
            <nav className="space-y-2">
              {[
                { path: "/", name: "Home" },
                { path: "/products", name: "Products" },
                { path: "/clothes", name: "Clothes" },
                { path: "/toys", name: "Toys" },
                { path: "/about", name: "About Us" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="block text-gray-600 hover:text-[#6C63FF] transition-colors"
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#4b2990]">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#6C63FF] mt-0.5" />
                <p className="text-gray-600">
                  Ponnani - Tirur Rd, Alathiyoor, Triprangode, Kerala 676102, India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#6C63FF]" />
                <a href="tel:+919048995755" className="text-gray-600 hover:text-[#6C63FF] transition-colors">
                  +91 9048995755
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#6C63FF]" />
                <a href="mailto:olentapparels@gmail.com" className="text-gray-600 hover:text-[#6C63FF] transition-colors">
                  olentapparels@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#e9d5ff] text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Olea Baby Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;