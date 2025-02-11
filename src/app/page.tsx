import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Hello, Welcome to My Page</h1>
        <p className="text-gray-600">Please fill out the form below:</p>
      </div>

      <Link href="/equipments_form" className="text-blue-600 hover:underline">
        Go to Equipment Form
      </Link>

      <Link href="/equipments_form/maintenance_form" className="text-blue-600 hover:underline">
        Go to Maintenance Form
      </Link>

      <footer className="text-center text-sm text-gray-500">Challenge</footer>
    </div>
  );
}
