import React from 'react'

const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2 rounded-lg border border-border bg-surface text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  )
}

export default Input
