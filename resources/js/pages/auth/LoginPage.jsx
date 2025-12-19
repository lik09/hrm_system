import React, { useEffect } from "react";
import { Form, Input, Button, Card, message, Avatar, Flex } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { request } from "../../utils/request";
import { Link, useNavigate } from "react-router-dom";
import { setProfile, setToken } from "../../store/profileStore";

function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);


 
  const onFinish = async (values) => {
    try {
      const res = await request("login", "post", values);

      setToken(res.token);
      setProfile(res.user);

      navigate("/"); // ✅ navigate after login
    } catch (err) {
      console.log("Login error:", err);

    let msg = "Login failed"; // default fallback

    if (err.response) {
      // Laravel validation error (422)
      if (err.response.data?.errors) {
        msg = Object.values(err.response.data.errors)[0][0];
      } 
      // Login failed (401)
      else if (err.response.data?.message) {
        msg = err.response.data.message;
      }
    }

    message.error(msg);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: 450, padding: 40 }}>
      
          <Flex justify="center">
            <Avatar size={100} src="https://i.pinimg.com/736x/57/b6/a8/57b6a86d0cb375fa3a9e38c2c4389d21.jpg"  
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    borderRadius: "50%", // ensure circle
                    marginBottom:20,
                  }}/>
          </Flex>
          <h1 style={{fontSize:30 ,fontWeight:"bold", textAlign:'center',marginBottom:20 }}>Login</h1>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input prefix={<UserOutlined />} style={{height:40}}/>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password prefix={<LockOutlined />}  style={{height:40}}/>
            </Form.Item>

            <Button type="primary" htmlType="submit" block style={{height:40 ,marginTop:20 }}>
              Login
            </Button>

            <div style={{ marginTop:50,textAlign:'center' }}>
            <span >
              Or{' '}
              <Link
                to="/register"
                
              >
                register now!
              </Link>
            </span>
          </div>
          </Form>
      
      </Card>
    </div>
  );
}

export default LoginPage;
