import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal, Form, Input, Select, Space, Tag } from "antd";
import axios from "axios";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/users", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setUsers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for add/edit
  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active ? 1 : 0,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Add or Edit user
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (editingUser) {
        await axios.put(`/api/users/${editingUser.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User updated successfully!");
      } else {
        await axios.post("/api/users", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User added successfully!");
      }
      handleCancel();
      fetchUsers();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errors.forEach((e) => message.error(e));
      } else {
        message.error("Operation failed");
      }
    }
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("User deleted successfully!");
          fetchUsers();
        } catch (err) {
          console.error(err);
          message.error("Failed to delete user");
        }
      },
    });
  };

  // Table columns
  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 80, align: "center" },
    { title: "Username", dataIndex: "username", key: "username", align: "center" },
    { title: "Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    { title: "Role", dataIndex: "role", key: "role", align: "center", width: 150 },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      width: 120,
      render: (value) =>
        value ? (
          <Tag color="green" style={{ fontWeight: 600 }}>
            Active
          </Tag>
        ) : (
          <Tag color="red" style={{ fontWeight: 600 }}>
            Inactive
          </Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => showModal(record)}
          />
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => handleDeleteUser(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Users</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        bordered
        scroll={{ x: "max-content"  }}
        pagination={{ pageSize: 10 }}
      />

      {/* Add/Edit User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={handleCancel}
        
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter username" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Commander", value: "Commander" },
                { label: "HR", value: "HR" },
                { label: "Officer", value: "Officer" },
                { label: "User", value: "User" },
              ]}
            />
          </Form.Item>

          <Form.Item name="is_active" label="Active">
            <Select>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
