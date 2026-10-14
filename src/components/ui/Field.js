import React from "react";

/** Label + input/select/textarea + error message, styled with the shared `.input` class. */
const Field = ({ label, id, error, hint, as: Tag = "input", className = "", children, ...props }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-gray-900">
        {label}
      </label>
    )}
    <Tag id={id} name={id} className={`input ${error ? "!border-red-400 focus:!ring-red-100" : ""}`} {...props}>
      {children}
    </Tag>
    {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : hint ? <p className="mt-1.5 text-xs text-gray-400">{hint}</p> : null}
  </div>
);

export default Field;
