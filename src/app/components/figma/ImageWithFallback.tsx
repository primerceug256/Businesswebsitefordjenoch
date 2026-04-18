import React, { useState } from 'react'

const ERROR_IMG_SRC = 'https://via.placeholder.com/400x300?text=Image+Not+Found'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  if (didError || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className ?? ''}`} style={style}>
        <img src={ERROR_IMG_SRC} alt="Fallback" className="opacity-50" />
      </div>
    )
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
}