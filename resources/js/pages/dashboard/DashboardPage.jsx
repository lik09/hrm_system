import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Table, Spin, Tag, Typography, Tooltip } from "antd";
import { request } from "../../utils/request";
import dayjs from "dayjs";

const { Title, Text } = Typography;

function DashboardPage() {
  const [personnelList, setPersonnelList] = useState([]);
  const [trainingList, setTrainingList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([request("personnels", "get"), request("trainings", "get")])
      .then(([personnels, trainings]) => {
        setPersonnelList(Array.isArray(personnels) ? personnels : []);
        setTrainingList(Array.isArray(trainings) ? trainings : []);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---- Metrics ----
  const totalPersonnel = personnelList.length;
  const activePersonnel = personnelList.filter(p => p.status === "active").length;
  const retiredPersonnel = personnelList.filter(p => p.status === "retired").length;
  const resignedPersonnel = personnelList.filter(p => p.status === "resigned").length;
  const marriedPersonnel = personnelList.filter(p => p.marital_status === "married").length;

  // Example: Authorized Personnel can come from backend
  const authorizedPersonnel = 100;
  const vacancies = authorizedPersonnel - totalPersonnel;

  // Training Metrics
  // Count unique personnel who have passed at least one training
  const personnelWithCompletedTraining = [
    ...new Set(trainingList.filter(t => t.passed === 1).map(t => t.personnel_id))
  ];
  const trainingCompleted = personnelWithCompletedTraining.length;
  const trainingPercentage = totalPersonnel ? (trainingCompleted / totalPersonnel) * 100 : 0;
  const trainingGaps = totalPersonnel - trainingCompleted;

  // Upcoming retirements (age >= 60)
  const upcomingRetirements = personnelList.filter(
    p => p.date_of_birth && dayjs().diff(dayjs(p.date_of_birth), "year") >= 60
  ).length;

  // Medical Summary
  const medicalSummary = personnelList.reduce((acc, p) => {
    if (p.medical_category) acc[p.medical_category] = (acc[p.medical_category] || 0) + 1;
    return acc;
  }, {});

  // Dynamic Alerts
  const alerts = {
    documentExpiring: personnelList.filter(
      p => p.document_expiry && dayjs(p.document_expiry).diff(dayjs(), "day") <= 30
    ).length,
    trainingExpiring: trainingList.filter(
      t => t.expiry_date && dayjs(t.expiry_date).diff(dayjs(), "day") <= 30
    ).length,
    leaveNearZero: personnelList.filter(p => p.leave_balance <= 1).length,
    absencesTooMany: personnelList.filter(p => p.absences >= 5).length
  };

  const cardStyle = {
    borderRadius: 12,
    textAlign: "center",
    padding: 10,
    minHeight: 50,
    height:140,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  
  };
  const titleStyle = {
    fontSize:20,
    fontWeight:600,
    display:'block',
    marginBottom:6
    
  };
  return (
    <Spin spinning={loading} >
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* Status Overview */}
      <Row gutter={[16, 16]}>
        {[
          { label: "Total Personnel", value: totalPersonnel },
          { label: "Active", value: activePersonnel, color: "green" },
          { label: "Retired", value: retiredPersonnel, color: "blue" },
          { label: "Resigned", value: resignedPersonnel, color: "red" },
          { label: "Married", value: marriedPersonnel },
          { label: "Vacancies", value: vacancies, color: "orange" }
        ].map((item, idx) => (
          <Col key={idx} xs={24} sm={24} md={12} lg={8}>
            <div style={{ position: "relative" }}>
              <div style={{
                width:5,
                height:'100%',
                position: "absolute",
                inset:0,
                top: 0,
                left: 0,
                background: item.color || "#1890ff",
                color: "#fff",
                padding: "0px 5px",
                borderTopLeftRadius:16,
                borderBottomLeftRadius:16,
                fontSize: 12,
                fontWeight: 500,
                zIndex: 2,}}>
                
              </div>
              <Card style={cardStyle}>
                <Tooltip title={item.label}>
                  <Text style={titleStyle}>{item.label}</Text>
                </Tooltip>
                <Title level={6} style={{ margin:0,color: item.color || "inherit" }}>{item.value}</Title>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
      

      {/* Training & Medical */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Text style={titleStyle}>Training Completion</Text>
            <Progress
              percent={trainingPercentage.toFixed(0)}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              style={{ marginTop: 8 }}
            />
            <Text type="secondary">Gaps: {trainingGaps}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={cardStyle}>
            <Text style={titleStyle}>Upcoming Retirements</Text>
            <Title level={6} style={{margin:0}}>{upcomingRetirements}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card style={{ textAlign: "left" }}>
            <Text style={titleStyle}>Medical Summary</Text>
            <ul style={{fontSize:14 }}>
              {Object.entries(medicalSummary).map(([cat, count]) => <li key={cat}>{cat}: {count}</li>)}
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Card
        title="Top Performers"
        style={{ marginTop: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Table
          dataSource={personnelList.slice(0, 5)}
          rowKey="id"
          columns={[
            { title: "Name", dataIndex: "full_name_en" },
            { title: "Rank", dataIndex: "rank" },
            { title: "Unit", dataIndex: "unit" },
            {
              title: "Status",
              dataIndex: "status",
              render: s => (
                <Tag color={s === "active" ? "green" : s === "retired" ? "blue" : "red"}>
                  {s}
                </Tag>
              )
            },
          ]}
          pagination={false}
        />
      </Card>

      {/* Alerts */}
      <Card
        title="Alerts"
        style={{ marginTop: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
      >
        <Row gutter={[16, 16]}>
          {Object.entries(alerts).map(([key, val], idx) => (
            <Col key={idx} xs={24} sm={12} md={6}>
              <Card type="inner" style={cardStyle}>
                <Text style={titleStyle}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                <Title level={6} style={{ margin:0 }}>{val}</Title>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Spin>
  );
}

export default DashboardPage;
