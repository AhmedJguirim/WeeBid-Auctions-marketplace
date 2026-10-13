import React from "react";

// Calls `handler` when a click happens outside of `ref`.
export default function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}
