import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message
} from "antd";
import { request } from "../../utils/request";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function RegisterPage() {
   const navigate = useNavigate();
  const onFinish = async (values) => {
  try {
    // Ensure password confirmation field exists
    values.password_confirmation = values.password_confirmation; // fix typo if necessary


    const res = await request("register", "post", values);

    if (res?.user?.id) {
      message.success("User registered successfully");
      navigate("/login");
    }
  } catch (err) {
    // Display detailed error if backend returns validation errors
    let msg = "Failed to register user";
    if (err.response?.data?.errors) {
      msg = Object.values(err.response.data.errors)[0][0];
    } else if (err.response?.data?.message) {
      msg = err.response.data.message;
    }
    message.error(msg);
  }
};


  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
      <Card style={{ width: 500 }}>
        <h1 style={{fontSize:30 ,fontWeight:"bold", textAlign:'center',margin:'20px 0px'}}>Register Account</h1>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ is_active: 1 }}>
          
          <Form.Item name="username" label="Username" rules={[{ required: true ,message:'please input username'}]}>
            <Input style={{height:40}}/>
          </Form.Item>

          <Form.Item name="name" label="Full Name">
            <Input style={{height:40}}/>
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email"  ,message:'please input email'}]}>
            <Input style={{height:40}}/>
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 ,message:'please input password'}]}>
            <Input.Password style={{height:40}}/>
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true  ,message:'please input confirm password'},
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password style={{ height: 40 }} />
          </Form.Item>


          <Form.Item name="role" label="Role" initialValue={"Admin"} rules={[{ required: true ,message:'please select role'}]}>
            <Select placeholder="Select role" style={{height:40}}>
              <Option value="Admin">Admin</Option>
              <Option value="Commander">Commander</Option>
              <Option value="HR">HR</Option>
              <Option value="Officer">Officer</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>

          
          <Form.Item name="is_active" label="Active">
            <Select style={{ height: 40 }}>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>


          <Button type="primary" htmlType="submit" block style={{height:40 ,margin:'20px 0px'}}>
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default RegisterPage;
