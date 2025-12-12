import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select, Checkbox, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { request } from "../../utils/request";

const { Option } = Select;

function TrainingPage() {

  const [state, setState] = useState({ list: [], loading: false });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [form] = Form.useForm();

  // ---------------- Fetch Trainings ----------------

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState(prev => ({ ...prev, loading: true }));
    const res = await request('trainings', 'get');
    console.log(res);
    if (Array.isArray(res)) {
      setState(prev => ({ ...prev, list: res, loading: false }));
      
    } else {
      setState(prev => ({ ...prev, loading: false }));
      message.error("Failed to load trainings");
    }
  };



  // ---------------- Open Modal ----------------
  const openModal = (record = null) => {
    setEditingData(record);
    if (record) {
      form.setFieldsValue({
        course_name: record.course_name,
        course_category: record.course_category,
        location: record.location,
        institution: record.institution,
        start_date: dayjs(record.start_date),
        end_date: dayjs(record.end_date),
        passed: record.passed === 1,
        certificate: record.certificate === 1,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // ---------------- Submit Form ----------------
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        start_date: values.start_date.format("YYYY-MM-DD"),
        end_date: values.end_date.format("YYYY-MM-DD"),
        passed: values.passed ? 1 : 0,
        certificate: values.certificate ? 1 : 0,
      };

      if (editingData) {
        await axios.put(`/api/trainings/${editingData.id}`, payload);
      } else {
        await axios.post("/api/trainings", payload);
      }

      getList();
      setIsModalOpen(false);
      setEditingData(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- Delete ----------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/trainings/${id}`);
      getList();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- Table Columns ----------------
  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 60 ,align: "center"},
    {
      title: "Personnel",
      dataIndex: ["personnel", "full_name_en"],
      key: "personnel",
      render: (_, record) => record.personnel.full_name_en,
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Category",
      dataIndex: "course_category",
      key: "course_category",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Passed",
      dataIndex: "passed",
      key: "passed",
      render: (passed) => (passed ? "Yes" : "No"),
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      key: "certificate",
      render: (cert) => (cert ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Training Page</h1>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
        Add Training
      </Button>
      <Spin spinning={state.loading}>
        <Table
          dataSource={state.list}
          columns={columns}
          rowKey="id"
          bordered
        
        />
      </Spin>
      {/* Modal Form */}
      <Modal
        title={editingData ? "Edit Training" : "Add Training"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Course Name"
            name="course_name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Course Category"
            name="course_category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              <Option value="Basic">Basic</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Location" name="location">
            <Input />
          </Form.Item>

          <Form.Item label="Institution" name="institution">
            <Input />
          </Form.Item>

          <Form.Item label="Start Date" name="start_date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="End Date" name="end_date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="passed" valuePropName="checked">
            <Checkbox>Passed</Checkbox>
          </Form.Item>

          <Form.Item name="certificate" valuePropName="checked">
            <Checkbox>Certificate</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TrainingPage;
