import React, { useEffect, useState } from "react";
import {
  BookOutlined,
  HighlightOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, theme, Dropdown, Flex, Button } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineCalendar, AiOutlineSetting } from "react-icons/ai";
import { LuPlaneTakeoff } from "react-icons/lu";
import { FiAlertCircle } from "react-icons/fi";

import enImg from "../../assets/lang_logo/en.png";
import khImg from "../../assets/lang_logo/kh.png";
import logo from "../../assets/logo/HRM_system.png";

import { showLogoutConfirm } from "../../utils/helper";
import { request } from "../../utils/request";
import { FaRegUser, FaUser } from "react-icons/fa";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  const role = user?.role;

  // Fetch user info if needed
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user?.id) {
      request("me")
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res));
          setUser(res);
        })
        .catch(() => {
          localStorage.clear();
          window.location.href = "/login";
        });
    }
  }, []);

  // Menu items (NO logout here)
  const items = [
    getItem("Dashboard", "/", <PieChartOutlined />),
    getItem("Personnel", "/personnel", <UserOutlined />),
    getItem("Training", "/training", <BookOutlined />),
    getItem("Skill", "/skill", <HighlightOutlined />),
    getItem("Leave", "/leave", <LuPlaneTakeoff />),
    getItem("Attendance", "/attendance", <AiOutlineCalendar />),
    getItem("Alert", "/alert", <FiAlertCircle />),
    getItem("User", "/user", <FaRegUser />),
  ];

  // Filter by role
  const filteredItems = items.filter((item) => {
    const key = item.key;

    if (role === "Admin") return true;
    if (role === "HR") return ["/", "/personnel", "/leave"].includes(key);
    if (role === "Commander") return ["/", "/training", "/skill"].includes(key);
    if (role === "Officer") return ["/", "/attendance", "/alert"].includes(key);
    if (role === "User") return ["/"].includes(key);

    return false;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* ===== SIDEBAR ===== */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{ cursor: "pointer", padding: 10 }}
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              height: 60,
              width: collapsed ? 60 : 180,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Menu */}
        <Menu
          theme="light"
          mode="inline"
          items={filteredItems}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          style={{ padding: "0 8px", flex: 1 }}
        />

        {/* Logout Button (BOTTOM) */}
        <div style={{ padding: 16 ,marginTop:120 }}>
          <Button
           
            block
            icon={<AiOutlineSetting />}
            // onClick={}
            style={{ borderColor: "#1890ff" ,color:'#1890ff'}}
          >
            {!collapsed && "Setting"}
          </Button>
        </div>

        <div style={{ padding:"0px 16px" }}>
          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={() => showLogoutConfirm(navigate)}
          >
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>

      {/* ===== MAIN CONTENT ===== */}
      <Layout>
        <Header
          style={{
            padding: 0,
            height: 60,
            background: colorBgContainer,
          }}
        >
          <Flex
            align="center"
            justify="space-between"
            style={{ padding: "0 18px", height: "60px" }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>HRM System</h3>

            <Flex align="center" gap={10}>
              {/* Language */}
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: [
                    {
                      key: "en",
                      label: (
                        <Flex align="center" gap={8}>
                          <img src={enImg} style={{ width: 20 }} />
                          <span>English</span>
                        </Flex>
                      ),
                    },
                    {
                      key: "kh",
                      label: (
                        <Flex align="center" gap={8}>
                          <img src={khImg} style={{ width: 20 }} />
                          <span>ខ្មែរ</span>
                        </Flex>
                      ),
                    },
                  ],
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Flex align="center" gap={8}>
                    <img src={enImg} style={{ width: 20 }} />
                    <span>English</span>
                  </Flex>
                </a>
              </Dropdown>

              {/* User Info */}
              <Flex vertical style={{ textAlign: "left", lineHeight: 1 ,marginLeft:20 }}>
                 <div style={{ fontSize: 18, fontWeight: 600 ,marginBottom:5 }}>{user.name || "User"}</div>
                 <div style={{ fontSize: 14, fontWeight: 400 ,opacity: 0.8 }}>{user.email || "user@example.com"}</div>
              </Flex>

              <Avatar
                size={44}
                src="https://i.pinimg.com/736x/57/b6/a8/57b6a86d0cb375fa3a9e38c2c4389d21.jpg"
              />
            </Flex>
          </Flex>
        </Header>

        <Content style={{ margin: "0 16px", height: "calc(100vh - 60px - 70px)", overflow: "hidden" }}>
          <div style={{
            marginTop: 16,
            padding: 24,
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <Outlet /> {/* Nested routes render here */}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Dev. ©{new Date().getFullYear()} Created by ❤️🧑‍💻
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
