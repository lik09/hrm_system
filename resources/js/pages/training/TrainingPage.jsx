import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Spin,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { request } from "../../utils/request";
import { DeleteFilled, EditFilled, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function TrainingPage() {
  const [state, setState] = useState({ list: [], loading: false });
  const [personnelList, setPersonnelList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [form] = Form.useForm();

  // ================= FETCH DATA =================
  useEffect(() => {
    getTrainings();
    getPersonnelList();
  }, []);

  const getTrainings = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await request("trainings", "get");
      if (Array.isArray(res)) {
        setState({ list: res, loading: false });
      } else {
        setState(prev => ({ ...prev, loading: false }));
        message.error("Failed to load trainings");
      }
    } catch (err) {
      setState(prev => ({ ...prev, loading: false }));
      console.error(err);
    }
  };

  const getPersonnelList = async () => {
    try {
      const res = await request("personnels", "get");
      if (Array.isArray(res)) setPersonnelList(res);
    } catch (err) {
      console.error(err);
      message.error("Failed to load personnel");
    }
  };

  // ================= MODAL =================
  const openModal = (record = null) => {
    setEditingData(record);

    if (record) {
      form.setFieldsValue({
        personnel_id: record.personnel_id,
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

  // ================= SUBMIT =================
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
        await request(`trainings/${editingData.id}`, "put", payload);
        message.success("Updated successfully");
      } else {
        await request("trainings", "post", payload);
        message.success("Created successfully");
      }

      setIsModalOpen(false);
      setEditingData(null);
      getTrainings();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await request(`trainings/${id}`, "delete");
      message.success("Deleted");
      getTrainings();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= TABLE =================
  const columns = [
    { title: "#", render: (_, __, i) => i + 1, width: 60, align: "center" },
    {
      title: "Personnel",
      align: "center",
      render: (_, r) => r.personnel?.full_name_en,
    },
    {
      title: "Rank",
      align: "center",
      render: (_, r) => r.personnel?.rank,
    },
    { title: "Course Name", dataIndex: "course_name" , align: "center"},
    { title: "Category", dataIndex: "course_category" , align: "center"},
    { title: "Location", dataIndex: "location" , align: "center"},
    { title: "Institution", dataIndex: "institution" , align: "center" ,width:150 },
    {
      title: "Start Date",
      dataIndex: "start_date",
      align: "center",
      render: d => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: d => dayjs(d).format("YYYY-MM-DD"),
    },
    {
      title: "Passed",
      dataIndex: "passed",
      align: "center",
      render: v => (v ? "Yes" : "No"),
    },
    {
      title: "Certificate",
      dataIndex: "certificate",
      align: "center",
      render: v => (v ? "Yes" : "No"),
    },
    {
      title: "Certificate File",
      dataIndex: "certificate_file",

    },
    {
      title: "Action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, r) => (
        <Space>
          <Button type="primary" icon={<EditFilled />} onClick={() => openModal(r)} />
          <Button danger icon={<DeleteFilled />} onClick={() => handleDelete(r.id)} />
        </Space>
      ),
    },
  ];


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Training</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Add Training
        </Button>
      </div>

      <Spin spinning={state.loading}>
        <Table dataSource={state.list} columns={columns} rowKey="id" bordered scroll={{ x: 1200 }}/>
      </Spin>

      <Modal
        title={editingData ? "Edit Training" : "Add Training"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="personnel_id"
            label="Personnel"
            rules={[{ required: true ,message:'please select personnel' }]}
          >
            <Select placeholder="Select personnel">
              {personnelList.map(p => (
                <Option key={p.id} value={p.id}>
                  {p.full_name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="course_name" label="Course Name" rules={[{ required: true ,message:'please course name'}]}>
            <Input />
          </Form.Item>

          <Form.Item name="course_category" label="Category" rules={[{ required: true ,message:'please select category'}]}>
            <Select>
              <Option value="Basic">Basic</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Intermediate">Specialized</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>

          <Form.Item name="institution" label="Institution">
            <Input />
          </Form.Item>

          <Form.Item name="start_date" label="Start Date" rules={[{ required: true ,message:'please select start date'}]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[
              { required: true, message: "please select end date" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue("start_date");
                  if (!start || !value || value.isAfter(start)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End date must be after start date")
                  );
                },
              }),
            ]}
          >
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
    </>
  );
}

export default TrainingPage;
