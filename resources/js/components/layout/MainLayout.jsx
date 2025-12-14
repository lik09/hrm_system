import React, { useState } from 'react';
import {
  BookOutlined,
  DesktopOutlined,
  FileOutlined,
  HighlightOutlined,
  LogoutOutlined,
  PieChartOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Col, Flex, Layout, Menu, Row, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";   // <-- import Outlet
// import AvatarDropdown from '../profile/AvatarDropdown';
import { AiOutlineFundProjectionScreen } from 'react-icons/ai';
import { PiStudent } from 'react-icons/pi';
import { IoCodeSlash } from 'react-icons/io5';
import { SiReaddotcv } from 'react-icons/si';
import logo from '../../assets/logo/HRM_system.png';
import { IoMdLogOut } from 'react-icons/io';
import { FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';
import { GiSkills } from 'react-icons/gi';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
    getItem("Dashboard", "/", <PieChartOutlined />),
    getItem("Personnel", "/personnel", <UserOutlined />),
    getItem("Training", "/training", <BookOutlined />),
    getItem("Skill", "/skill", <HighlightOutlined />),
    getItem(
    <span style={{ color: "red", fontWeight: 600 }}>Logout</span>,
    "/logout",
    <LogoutOutlined style={{ color: "red" }} />
    )   
  
];

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation()

  return (
    <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} style={{backgroundColor:'#fff'}}>
        <div style={{cursor: 'pointer'}} onClick={ 
          () => navigate('/')
          }>
          <img src={logo} alt=""  style={{height:"80px",width:"190px",padding:10 }}/>
        </div>
        {/* <div className="demo-logo-vertical" style={{ marginTop:100 }} /> */}
        
        <Menu 
          theme="light" 
          // defaultSelectedKeys={['/']} 
          mode="inline" 
          items={items} 
          selectedKeys={[location.pathname]}
          onClick={({key}) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0,  height: 60, background: colorBgContainer }}>
          <Flex
              align="center"
              justify="space-between"
              style={{ padding: "0 18px", height: "60px" }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600 }}>HRM System</h3>

              {/* Right Section */}
              <Flex align="center" gap={10} style={{ paddingRight: 10, paddingBottom:2, paddingTop:2 }}>
                <Flex vertical    style={{ textAlign: "left", lineHeight: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600 ,marginBottom:5 }}>Admin</div>
                  <div style={{ fontSize: 14, fontWeight: 400 ,opacity: 0.8 }}>Admin123@gmail.com</div>
                </Flex>
                  
                <Avatar size={50} src="https://i.pinimg.com/736x/57/b6/a8/57b6a86d0cb375fa3a9e38c2c4389d21.jpg"  
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "50%", // ensure circle
                  }}/>
              </Flex>

            </Flex>

        </Header>
        <Content style={{
              margin: "0 16px",
              height: "calc(100vh - 60px - 70px)", // Header + Footer
              overflow: "hidden",
            }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
          <div
            style={{
              marginTop: 16,
              padding: 24,
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              scrollBehavior: "smooth",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              
            }}
          >
            {/* This is where child routes render */}
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Dev. ©{new Date().getFullYear()} Created by ❤️🧑‍💻
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
