import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  message,
  Spin,
  Checkbox
} from "antd";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { FaFileAlt, FaGraduationCap, FaHeartbeat, FaCalendarAlt, FaBell } from "react-icons/fa";
import dayjs from "dayjs";
import { request } from "../../utils/request"; // Your Axios wrapper

const { Option } = Select;

export default function AlertPage() {
  const [alertList, setAlertList] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAlerts();
    fetchPersonnels();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    const res = await request("alerts", "get");
    if (Array.isArray(res)) setAlertList(res);
    else message.error("Failed to load alerts");
    setLoading(false);
  };

  const fetchPersonnels = async () => {
    const res = await request("personnels", "get");
    if (Array.isArray(res)) setPersonnelList(res);
  };

  const openAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      alert_date: record.alert_date ? dayjs(record.alert_date) : null,
      personnel_id: record.personnel?.id,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        alert_date: values.alert_date.format("YYYY-MM-DD"),
        resolved: values.resolved || false,
      };

      const res = editing
        ? await request(`alerts/${editing.id}`, "put", payload)
        : await request("alerts", "post", payload);

      if (res && !res.error) {
        message.success(editing ? "Alert updated" : "Alert created");
        fetchAlerts();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      } else if (err?.message) {
        message.error(err.message);
      } else {
        message.error("Failed to save alert");
      }
    }
  };

  const deleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      onOk: async () => {
        const res = await request(`alerts/${record.id}`, "delete");
        if (res && !res.error) {
          message.success("Deleted successfully");
          fetchAlerts();
        } else message.error("Delete failed");
      },
    });
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case "Document":
        return <FaFileAlt style={{ color: "#1890ff" }} />;
      case "Training":
        return <FaGraduationCap style={{ color: "#52c41a" }} />;
      case "Medical":
        return <FaHeartbeat style={{ color: "#eb2f96" }} />;
      case "Leave":
        return <FaCalendarAlt style={{ color: "#faad14" }} />;
      case "Attendance":
        return <FaBell style={{ color: "#722ed1" }} />;
      default:
        return <FaBell />;
    }
  };

  const columns = [
    { title: "#", render: (_, __, i) => i + 1 , align: "center"},
    { title: "Personnel", dataIndex: ["personnel", "full_name_en"], align: "center" },
    {
      title: "Alert Type",
      dataIndex: "alert_type",
      align: "center",
      render: (type) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {getAlertIcon(type)} {type}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "alert_date",
      align: "center",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Resolved",
      dataIndex: "resolved",
      align: "center",
      render: (resolved) => resolved ? "Yes" : "No",
    },
    {
      title: "Actions",
      width: 200,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditFilled />}
            onClick={() => openEditModal(record)}
          />
          <Button
            danger
            icon={<DeleteFilled />}
            onClick={() => deleteRecord(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Alert
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={alertList}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: "max-content" }}
        />
      </Spin>

      <Modal
        title={editing ? "Edit Alert" : "Add Alert"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="personnel_id"
            label="Personnel"
            rules={[{ required: true ,message: "please select personnel"}]}
          >
            <Select placeholder="Select personnel">
              {personnelList.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.full_name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="alert_type"
            label="Alert Type"
            rules={[{ required: true  ,message: "please select alert type"}]}
          >
            <Select placeholder="Select alert type">
              <Option value="Document">Document</Option>
              <Option value="Training">Training</Option>
              <Option value="Medical">Medical</Option>
              <Option value="Leave">Leave</Option>
              <Option value="Attendance">Attendance</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "please input description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="alert_date"
            label="Alert Date"
            rules={[{ required: true, message: "please select date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="resolved" valuePropName="checked">
            <Checkbox>Resolved</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
