"use client";
export function FormField({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-red-600 text-xs">{error}</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="text-red-600 text-xs">{children}</div>;
}

export function SuccessAlert({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <div className="rounded-md bg-green-50 text-green-900 px-3 py-2 text-sm">{children}</div>;
}


