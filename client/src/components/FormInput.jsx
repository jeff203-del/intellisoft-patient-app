import React from 'react';

const FormInput = ({ label, type = 'text', required = false, error, ...props }) => {
  return (
    <div className="mb-1">
      <label className="form-label">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea className={`form-input min-h-[120px] resize-none ${error ? 'border-rose-300 focus:ring-rose-200' : ''}`} {...props} />
      ) : (
        <input 
          type={type} 
          className={`form-input ${error ? 'border-rose-300 focus:ring-rose-200' : ''}`} 
          {...props} 
        />
      )}
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default FormInput;