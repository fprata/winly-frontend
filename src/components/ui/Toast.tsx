"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-emerald-600" />,
  error: <XCircle size={16} className="text-red-600" />,
  info: <Info size={16} className="text-sky-600" />,
};

const bgColors: Record<ToastType, string> = {
  success: "border-emerald-200 bg-white",
  error: "border-red-200 bg-white",
  info: "border-sky-200 bg-white",
};

let addToastGlobal: ((type: ToastType, message: string) => void) | null = null;

export function toast(type: ToastType, message: string) {
  addToastGlobal?.(type, message);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let counter = 0;

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + counter++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => {
      addToastGlobal = null;
    };
  }, [addToast]);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg ${bgColors[t.type]} animate-fade-in`}
        >
          {icons[t.type]}
          <span className="text-sm font-medium text-gray-800">
            {t.message}
          </span>
          <button
            onClick={() => dismiss(t.id)}
            className="ml-1 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
