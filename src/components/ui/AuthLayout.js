import React from "react";

// Venia-style sign-in / register shell: centred form, breadcrumb-free, plenty of white.
const AuthLayout = ({ title, subtitle, footer, children, wide = false }) => (
  <div className="container-page flex justify-center py-14 sm:py-20">
    <div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
      <h1 className="text-center text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-3 text-center text-sm text-gray-600">{subtitle}</p>}
      <div className="mt-8">{children}</div>
      {footer && <p className="mt-8 border-t border-gray-300 pt-6 text-center text-sm text-gray-900">{footer}</p>}
    </div>
  </div>
);

export default AuthLayout;
