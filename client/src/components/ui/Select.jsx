import React from 'react'

const Select = ({ 
  label, 
  error, 
  options = [], 
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
      <select
        className={`px-4 py-2 rounded-lg border border-border bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  )
}

export default Select
