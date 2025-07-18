// src/pages/Dashboard.tsx
import { DashboardIndicators } from "./dashboardWidgets/DashboardIndicators";

export default function HelloWord() {
  return (
    <div className="space-y-6 p-4">
      <DashboardIndicators />
      {/* Aqui você incluirá os outros widgets nas próximas tasks */}
    </div>
  );
}
