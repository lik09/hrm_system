// LeavePage.jsx
import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Space, message, Modal, Form, Select, DatePicker, InputNumber, Tag } from "antd";
import dayjs from "dayjs";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/request";
import { formatDateClient } from "../../utils/helper";

const { Option } = Select;

export default function LeavePage() {
  const [leaveList, setLeaveList] = useState([]);
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeaves();
    fetchLeaveTypes();
    fetchPersonnels();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    const res = await request("leaves", "get");
    if (Array.isArray(res)) setLeaveList(res);
    else message.error("Failed to load leaves");
    setLoading(false);
  };

  const fetchLeaveTypes = async () => {
    const res = await request("leave-types", "get");
    if (Array.isArray(res)) setLeaveTypeList(res);
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
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
      leave_balance: record.leave_balance ?? 0,
      status: record.status ?? "pending",
      leave_type_id: record.leave_type?.id,
      personnel_id: record.personnel?.id,
    });
    setModalOpen(true);
  };

  const calculateUsedDays = (personnelId, leaveTypeId) => {
    const usedLeaves = leaveList.filter(
      (l) => l.personnel_id === personnelId && l.leave_type_id === leaveTypeId
    );
    let totalUsed = 0;
    usedLeaves.forEach((l) => {
      if (l.start_date && l.end_date) {
        totalUsed += dayjs(l.end_date).diff(dayjs(l.start_date), "day") + 1;
      }
    });
    return totalUsed;
  };

  const calculateLeaveBalance = (personnelId, leaveTypeId, startDate, endDate) => {
    const leaveType = leaveTypeList.find((lt) => lt.id === leaveTypeId);
    if (!leaveType) return 0;
    const usedDays = calculateUsedDays(personnelId, leaveTypeId);
    const selectedDays = startDate && endDate ? endDate.diff(startDate, "day") + 1 : 0;
    return leaveType.days_per_year - usedDays - selectedDays;
  };

  const onDateChange = () => {
    const personnelId = form.getFieldValue("personnel_id");
    const leaveTypeId = form.getFieldValue("leave_type_id");
    const startDate = form.getFieldValue("start_date");
    const endDate = form.getFieldValue("end_date");
    if (personnelId && leaveTypeId && startDate && endDate) {
      const balance = calculateLeaveBalance(personnelId, leaveTypeId, startDate, endDate);
      form.setFieldsValue({ leave_balance: balance });
    }
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        start_date: values.start_date.format("YYYY-MM-DD"),
        end_date: values.end_date.format("YYYY-MM-DD"),
        leave_balance: values.leave_balance ?? 0,
        status: values.status ?? "pending",
      };
      const res = editing
        ? await request(`leaves/${editing.id}`, "put", payload)
        : await request("leaves", "post", payload);

      if (res && !res.error) {
        message.success(editing ? "Leave updated" : "Leave created");
        fetchLeaves();
        setModalOpen(false);
      } else message.error("Failed to save leave");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecord = (record) => {
    Modal.confirm({
      title: "Are you sure to delete?",
      onOk: async () => {
        const res = await request(`leaves/${record.id}`, "delete");
        if (res && !res.error) {
          message.success("Deleted successfully");
          fetchLeaves();
        } else message.error("Delete failed");
      },
    });
  };

  const leaveColumns = [
    { title: "#", width: 50, align: "center", render: (_, __, i) => i + 1 },
    { title: "Personnel", dataIndex: ["personnel", "full_name_en"], width: 200 ,align: "center"},
    { title: "Leave Type", dataIndex: ["leave_type", "name"], width: 200, align: "center"},
    { title: "Start Date", dataIndex: "start_date", render: (date) => formatDateClient(date) ,align: "center"} ,
    { title: "End Date", dataIndex: "end_date", render: (date) => formatDateClient(date) ,align: "center"},
    { title: "Leave Balance", dataIndex: "leave_balance", align: "center" },
    { title: "Status", dataIndex: "status", align: "center", 
      render: (status) => {
      let color = "default";
      switch (status) {
        case "pending":
          color = "orange";
          break;
        case "approved":
          color = "green";
          break;
        case "rejected":
          color = "red";
          break;
        default:
          color = "default";
      }
      return <Tag color={color} style={{ padding:'2px 15px' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>;
    }, },
    {
      title: "Actions",
      width: 200,
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
          Add Leave
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          dataSource={leaveList}
          columns={leaveColumns}
          rowKey="id"
          bordered
          scroll={{ x: 1200 }}
        />
      </Spin>

      <Modal
        title={editing ? "Edit Leave" : "Add Leave"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="personnel_id" label="Personnel" rules={[{ required: true ,message:'please select personnel' }]}>
            <Select placeholder="Select personnel" onChange={onDateChange}>
              {personnelList.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.full_name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="leave_type_id" label="Leave Type" rules={[{ required: true ,message:'please select leave type' }]}>
            <Select placeholder="Select leave type"  onChange={onDateChange}>
              {leaveTypeList.map((lt) => (
                <Option key={lt.id} value={lt.id}>
                  {lt.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="start_date" label="Start Date" rules={[{ required: true ,message:'please select start date'}]}  onChange={onDateChange}>
            <DatePicker style={{ width: "100%" }}  onChange={onDateChange}/>
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[
              { required: true ,message:'please select end date'},
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue("start_date");
                  if (!start || !value || value.isAfter(start)) return Promise.resolve();
                  return Promise.reject(new Error("End date must be after start date"));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} onChange={onDateChange} />
          </Form.Item>

          <Form.Item name="leave_balance" label="Leave Balance">
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="pending">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
