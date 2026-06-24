import React from 'react';

const RadioGroup = ({ label, options, required = false, name, value, onChange, error }) => {
  return (
    <div className="mb-1">
      <label className="form-label">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
      <div className="flex gap-6 mt-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer group">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
              ${value === option ? 'border-primary-600' : 'border-gray-300 group-hover:border-primary-400'}`}>
              {value === option && <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />}
            </div>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <span className={`text-sm font-medium ${value === option ? 'text-primary-700' : 'text-gray-600'}`}>
              {option}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default RadioGroup;