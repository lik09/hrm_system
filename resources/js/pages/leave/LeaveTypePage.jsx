import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Space, message, Modal, Form, Input, InputNumber } from "antd";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/request";

export default function LeaveTypePage() {
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    setLoading(true);
    const res = await request("leave-types", "get");
    if (Array.isArray(res)) setLeaveTypeList(res);
    else message.error("Failed to load leave types");
    setLoading(false);
  };

  const openAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = editing
        ? await request(`leave-types/${editing.id}`, "put", values)
        : await request("leave-types", "post", values);

      if (res && !res.error) {
        message.success(editing ? "Leave Type updated" : "Leave Type created");
        fetchLeaveTypes();
        setModalOpen(false);
      } else message.error("Failed to save leave type");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      onOk: async () => {
        const res = await request(`leave-types/${record.id}`, "delete");
        if (res && !res.error) {
          message.success("Deleted successfully");
          fetchLeaveTypes();
        } else message.error("Delete failed");
      },
    });
  };

  const leaveTypeColumns = [
    { title: "#", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { title: "Name", dataIndex: "name", width: 200 },
    { title: "Days Per Year", dataIndex: "days_per_year", width: 150, align: "center" },
    { title: "Description", dataIndex: "description", width: 300, align: "center" },
    {
      title: "Actions",
      width: 80,
      fixed: 'right',
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditFilled />} onClick={() => openEditModal(record)} />
          <Button danger icon={<DeleteFilled />} onClick={() => deleteRecord(record)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Leave Type
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={leaveTypeList}
          columns={leaveTypeColumns}
          rowKey="id"
          bordered
          scroll={{ x: "max-content" }}
        />
      </Spin>

      <Modal 
        title={editing ? "Edit Leave Type" : "Add Leave Type"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Leave Type Name" rules={[{ required: true ,message:'please input leave type name'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="days_per_year" label="Days Per Year" rules={[{ required: true ,message:'please input days per year'}]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
