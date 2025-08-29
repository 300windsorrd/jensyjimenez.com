"use client";
import hours from "@/data/hours.json";

export function HoursTable() {
  return (
    <table className="mt-6 text-sm w-full max-w-sm">
      <tbody>
        {hours.map((row) => (
          <tr key={row.day}>
            <td className="py-1 pr-4 opacity-70">{row.day}</td>
            <td className="py-1">{row.hours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type HoursRow = { day: string; hours: string };


