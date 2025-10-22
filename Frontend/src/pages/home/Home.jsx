import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const slides = [
    {
      image: "/baby/Momholding.jpg",
      title: "Shopping love, comfort, and care for your baby",
      subtitle: "Soft fabrics, cute designs, and perfect comfort for your little ones.",
      button: "Shop Now",
    },
    {
      image: "/baby/baby3.jpg",
      title: "Stylish & Soft Fabrics for Babies",
      subtitle: "Keep your baby cozy and trendy every day.",
      button: "Explore Collection",
    },
    {
      image: "/baby/baby5.jpg",
      title: "Cute Toy's for Little Ones",
      subtitle: "Caps, bibs, and more – perfect finishing touch.",
      button: "Shop Now",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setIsTransitioning(false);
      }, 500); // Match this with your transition duration
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex items-center">
              <div className={`container mx-auto px-6 transition-all duration-500 transform ${index === currentSlide ? 'translate-x-0' : 'translate-x-10'} ${isTransitioning && index === currentSlide ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-2xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-100 mb-6 max-w-xl">
                  {slide.subtitle}
                </p>
                <Link
                  to="/products"
                  className="inline-block bg-[#6C63FF] hover:bg-[#574fd6] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {slide.button}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#4b2990] mb-6">
              Welcome to Olea Baby Store
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Discover the perfect blend of comfort, style, and love for your little ones. From soft cotton clothes to adorable toys and accessories, we bring carefully selected products that your baby (and you) will love!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/about"
                className="bg-[#6C63FF] hover:bg-[#574fd6] text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 inline-block"
              >
                Learn More About Us
              </Link>
              <Link
                to="/products"
                className="bg-white border-2 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 inline-block"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#4b2990] text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              { name: "Clothes", image: "/baby/cloth.jpg", link: "/clothes" },
              { name: "Toys", image: "/toys/toys.jpg", link: "/toys" },
            ].map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-90 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#4b2990] text-center mb-12">
            What Parents Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The softest baby clothes I've ever found! My little one is so comfortable.",
                author: "Sarah M.",
              },
              {
                quote: "Beautiful designs and excellent quality. Highly recommend Olea Baby Store!",
                author: "James L.",
              },
              {
                quote: "Fast shipping and great customer service. Will definitely shop here again.",
                author: "Priya K.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </div>
                <div className="font-medium text-[#6C63FF]">
                  — {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to explore more?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Browse our full collection and find something special for your baby today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-[#6C63FF] hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-all duration-300 inline-block"
            >
              View All Products
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold px-8 py-3 rounded-lg transition-all duration-300 inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-[#4b2990] mb-4">
            Join Our Newsletter
          </h3>
          <p className="text-gray-600 mb-6">
            Get 10% off your first order and stay updated on new arrivals and special offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
              required
            />
            <button
              type="submit"
              className="bg-[#6C63FF] hover:bg-[#574fd6] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;