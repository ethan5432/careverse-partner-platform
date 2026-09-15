'use client';

import React from 'react';

export function CareverseLogo({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2L4 8v8c0 7.2 5.12 13.92 12 16 6.88-2.08 12-8.8 12-16V8L16 2z"
          fill="#18191D"
        />
        <path
          d="M16 8c-2.4 0-4.32 1.92-4.32 4.32 0 2.4 1.92 4.32 4.32 4.32s4.32-1.92 4.32-4.32C20.32 9.92 18.4 8 16 8z"
          fill="#F6F3EE"
        />
        <path
          d="M16 18.56c-3.36 0-6.24 1.76-7.84 4.48C9.92 25.6 12.8 27.36 16 27.36s6.08-1.76 7.84-4.32c-1.6-2.72-4.48-4.48-7.84-4.48z"
          fill="#E1062C"
        />
      </svg>
      <span className="font-extrabold text-cv-ink tracking-tight" style={{ fontSize: size * 0.5 }}>
        Careverse
      </span>
    </div>
  );
}

export function CareverseMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2L4 8v8c0 7.2 5.12 13.92 12 16 6.88-2.08 12-8.8 12-16V8L16 2z"
        fill="#18191D"
      />
      <path
        d="M16 8c-2.4 0-4.32 1.92-4.32 4.32 0 2.4 1.92 4.32 4.32 4.32s4.32-1.92 4.32-4.32C20.32 9.92 18.4 8 16 8z"
        fill="#F6F3EE"
      />
      <path
        d="M16 18.56c-3.36 0-6.24 1.76-7.84 4.48C9.92 25.6 12.8 27.36 16 27.36s6.08-1.76 7.84-4.32c-1.6-2.72-4.48-4.48-7.84-4.48z"
        fill="#E1062C"
      />
    </svg>
  );
}
