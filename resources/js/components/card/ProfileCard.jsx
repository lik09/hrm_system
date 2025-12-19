import React from "react";
import { Card, Avatar, Tooltip } from "antd";

const profileStyle = {
  transition: "all 0.3s ease",
  cursor: "pointer",
  borderRadius: 12,
  textAlign: "center",
  padding: 16,
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};

const profileHoverStyle = {
  transform: "scale(1.05)",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  backgroundColor: "#e6f7ff",
};

export default function ProfileCard({ personnel }) {
  const [hover, setHover] = React.useState(false);

  return (
    <Card
      style={{ ...profileStyle, ...(hover ? profileHoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Tooltip title={personnel.full_name_en}>
        <Avatar
          size={64}
          src={personnel.photo ? `http://127.0.0.1:8000/storage/${personnel.photo}` : undefined}
        />
      </Tooltip>
      <h3 style={{ marginTop: 8 }}>{personnel.full_name_en}</h3>
      <p style={{ margin: 0 }}>{personnel.rank}</p>
    </Card>
  );
}
