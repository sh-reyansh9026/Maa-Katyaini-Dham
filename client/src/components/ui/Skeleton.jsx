import React from 'react'

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  count = 1 
}) => {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-20',
    card: 'h-32 w-full',
  }
  
  const baseClass = 'animate-pulse bg-surface-alt rounded'
  const variantClass = variants[variant] || variants.default
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${baseClass} ${variantClass} ${className}`} />
      ))}
    </>
  )
}

export default Skeleton
