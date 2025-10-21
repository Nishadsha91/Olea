import React from 'react';
import { motion } from 'framer-motion';
import { Baby, Heart, Shield, Sparkles, Smile, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6C63FF] to-[#4b2990] bg-clip-text text-transparent">
          Our Story
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Where love, quality, and care come together for your little ones
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-12 items-center mb-16"
      >
        <motion.div variants={itemVariants} className="order-2 md:order-1">
          <div className="bg-gradient-to-br from-[#f3e8ff] to-[#e7f5ff] p-8 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-[#4b2990]">Welcome to Olea</h2>
            <p className="text-gray-700 mb-4 text-lg">
              Your trusted destination for adorable, safe, and high-quality baby products. 
              We know how special your little ones are, and we're here to help you find 
              the perfect clothes, toys, and accessories that blend comfort, safety, and style.
            </p>
            <p className="text-gray-700 text-lg">
              Founded with love and care, Olea was born from a simple idea: to make shopping 
              for your baby a joyful and worry-free experience.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="order-1 md:order-2">
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/baby/showcase.jpg" 
              alt="Happy baby with Olea products"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <Baby className="w-12 h-12 mb-2" />
              <p className="text-xl font-medium">Making parenting joyful, one product at a time</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Our Mission */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#6C63FF] to-[#4b2990] rounded-3xl p-8 md:p-12 text-white mb-16 shadow-lg"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl mb-6">
            To provide parents with thoughtfully curated baby products that combine safety, 
            quality, and style—because your little ones deserve the very best.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { icon: <Shield size={32} />, text: '100% Safe' },
              { icon: <Sparkles size={32} />, text: 'Premium Quality' },
              { icon: <Smile size={32} />, text: 'Happy Babies' },
              { icon: <Gift size={32} />, text: 'Thoughtful Design' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl"
              >
                <div className="mb-3">{item.icon}</div>
                <p className="font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Our Promise */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-16"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#4b2990]">Our Promise to You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            These are the values that guide everything we do at Olea
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: "Quality Assurance", 
              description: "Every product meets our strict quality standards", 
              color: "bg-[#E7F5FF] text-[#4263EB]"
            },
            { 
              title: "Safe Materials", 
              description: "Gentle on your baby's delicate skin", 
              color: "bg-[#F3F0FF] text-[#7048E8]"
            },
            { 
              title: "Thoughtful Design", 
              description: "Products that parents and babies love", 
              color: "bg-[#FFF3BF] text-[#F59F00]"
            },
            { 
              title: "Happy Support", 
              description: "Friendly help whenever you need us", 
              color: "bg-[#FFDEEB] text-[#D6336C]"
            }
          ].map((promise, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className={`${promise.color} p-6 rounded-2xl shadow-md`}
            >
              <h3 className="text-xl font-bold mb-3">{promise.title}</h3>
              <p className="text-current/90">{promise.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Join Our Family */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center bg-[#f8f9fa] rounded-3xl p-8 md:p-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-[#4b2990]">Join Our Family</h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
          Explore our collections, discover new favorites, and share your little one's moments with us. 
          We're more than a store — we're a community built around love, trust, and the joy of raising happy, healthy children.
        </p>
        <Link to='/products'><button className="bg-gradient-to-r from-[#6C63FF] to-[#4b2990] text-white px-8 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg">
          Shop Our Collection
        </button>
        </Link>
      </motion.div>

      {/* Closing */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-2xl text-[#4b2990] font-medium mb-2">❤️ From all of us at Olea</p>
        <p className="text-gray-600">Thank you for being part of our story</p>
      </motion.div>
    </div>
  );
}

export default About;