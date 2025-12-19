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
  Tag,
} from "antd";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { request } from "../../utils/request"; // Your Axios wrapper

const { Option } = Select;

export default function AttendancePage() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAttendance();
    fetchPersonnels();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    const res = await request("attendance", "get");
    if (Array.isArray(res)) setAttendanceList(res);
    else message.error("Failed to load attendance");
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
      date: record.date ? dayjs(record.date) : null,
      personnel_id: record.personnel?.id,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      const res = editing
        ? await request(`attendance/${editing.id}`, "put", payload)
        : await request("attendance", "post", payload);

      if (res && !res.error) {
        message.success(editing ? "Attendance updated" : "Attendance created");
        fetchAttendance();
        setModalOpen(false);
      } 
    } catch (err) {
      console.error(err);
      if (err.data && err.data.message) {
        message.error(err.data.message); // This will now show backend 409 message
      } else if (err.message) {
        message.error(err.message);
      } else {
        message.error("Failed to save attendance");
      }
    }
  };

  const deleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      onOk: async () => {
        const res = await request(`attendance/${record.id}`, "delete");
        if (res && !res.error) {
          message.success("Deleted successfully");
          fetchAttendance();
        } else message.error("Delete failed");
      },
    });
  };

  const columns = [
    { title: "#", render: (_, __, i) => i + 1 ,align: "center"},
    { title: "Personnel", dataIndex: ["personnel", "full_name_en"] ,align: "center"},
    {
      title: "Date",
      dataIndex: "date",
      align: "center",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
      align: "center"
    },
    { title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => {
      let color = "default";
      switch (status) {
        case "Present":
          color = "green";
          break;
        case "Absent":
          color = "red";
          break;
        case "Late":
          color = "orange";
          break;
        case "Excused":
          color = "blue";
          break;
        default:
          color = "default";
      }
      return <Tag color={color} style={{ padding:'2px 15px' }}>{status}</Tag>;
      }
     },
    { title: "Remarks", dataIndex: "remarks" , align: "center"},
    {
      title: "Actions",
      width: 200,
      fixed: 'right',
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
          Add Attendance
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={attendanceList}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: "max-content" }}
        />
      </Spin>

      <Modal
        title={editing ? "Edit Attendance" : "Add Attendance"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="personnel_id"
            label="Personnel"
            rules={[{ required: true , message: "Please select personnel"}]}
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
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
              <Option value="Late">Late</Option>
              <Option value="Excused">Excused</Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
