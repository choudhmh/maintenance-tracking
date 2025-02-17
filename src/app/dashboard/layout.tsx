import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Home</Link>
          <Link href="/dashboard/equipments_form" className="block py-2 px-4 hover:bg-gray-700 rounded">Equipment Form</Link>
          <Link href="/dashboard/equipments_form/equipment_table" className="block py-2 px-4 hover:bg-gray-700 rounded">Equipment Table</Link>
          <Link href="/dashboard/equipments_form/maintenance_form" className="block py-2 px-4 hover:bg-gray-700 rounded">Maintenance Form</Link>
          <Link href="/dashboard/equipments_form/maintenance_form/maintenance_table" className="block py-2 px-4 hover:bg-gray-700 rounded">Maintenance Table</Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
