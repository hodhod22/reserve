// app/dashboard/page.tsx
import LiveExchange from "@/components/LiveExchange";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <LiveExchange />
    </div>
  );
}
