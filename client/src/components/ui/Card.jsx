import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <div className={`bg-surface rounded-lg border border-border shadow-sm ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-border ${className}`}>
      {children}
    </div>
  )
}

const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-t border-border ${className}`}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
