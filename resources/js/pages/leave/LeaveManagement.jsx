import React, { useState } from "react";
import { Button } from "antd";
import LeavePage from "./LeavePage";
import LeaveTypePage from "./LeaveTypePage";


export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("leave");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button type={activeTab === "leave" ? "primary" : "default"} onClick={() => setActiveTab("leave")}>Leave</Button>
        <Button type={activeTab === "leaveType" ? "primary" : "default"} onClick={() => setActiveTab("leaveType")}>Leave Type</Button>
      </div>

      {activeTab === "leave" ? <LeavePage /> : <LeaveTypePage />}
    </div>
  );
}
