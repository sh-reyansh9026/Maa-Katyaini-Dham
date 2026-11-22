import React from 'react'
import { Helmet } from 'react-helmet-async'

const Gallery = () => {
  const galleryImages = [
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935923/gallery-1.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935904/hero-bg.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935906/gallery-2.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935921/gallery-3.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935932/gallery-4.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935933/gallery-5.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935933/gallery-6.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935936/gallery-8.jpg',
    'https://res.cloudinary.com/xvjfndeg/image/upload/v1789935941/gallery-7.jpg',
  ]

  return (
    <>
      <Helmet>
        <title>Gallery - Maa Katyaini Dham</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-3xl font-bold text-text mb-2">Photo Gallery</h1>
        <p className="text-muted mb-8">Experience the spiritual ambiance of Maa Katyaini Dham</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-surface-alt rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Gallery
