import React from "react";

export default function ImageModal({ image, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-[3px]  flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-black text-5xl font-bold z-10"
        >
          &times;
        </button>
        <img
          src={image}
          alt="Product"
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
