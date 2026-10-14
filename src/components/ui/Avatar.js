import React from "react";
import { BACKEND_URL } from "../../config/env";

const colors = ["bg-gray-900", "bg-gray-700", "bg-brand-700", "bg-brand-900"];

// Round avatar: user image when it loads, coloured initial otherwise.
const Avatar = ({ name = "?", image, src, size = 36, className = "" }) => {
  const [failed, setFailed] = React.useState(false);
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];
  const style = { width: size, height: size, fontSize: size * 0.4 };
  const url = src || (image ? `${BACKEND_URL}/user/${image}` : null);
  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        style={style}
        onError={() => setFailed(true)}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }
  return (
    <span style={style} className={`flex shrink-0 items-center justify-center rounded-full font-bold uppercase text-white ring-2 ring-white ${color} ${className}`}>
      {name.charAt(0)}
    </span>
  );
};

export default Avatar;
