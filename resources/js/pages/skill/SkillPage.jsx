import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  Radio,
  Row,
  Flex,
} from "antd";
import { EditFilled, DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { request } from "../../utils/request";
import { formatDateTable } from "../../utils/helper";

const { Option } = Select;

function SkillPage() {
  const [state, setState] = useState({ list: [], loading: false });
  const [personnelList, setPersonnelList] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getList();
    getPersonnelList();
  }, []);

  // Fetch skills
  const getList = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const res = await request("skills", "get");
    if (Array.isArray(res)) {
      setState((prev) => ({ ...prev, list: res, loading: false }));
    } else {
      setState((prev) => ({ ...prev, loading: false }));
      message.error("Failed to load skills");
    }
  };

  // Fetch personnel list
  const getPersonnelList = async () => {
    try {
      const res = await request("personnels", "get");
      if (Array.isArray(res)) setPersonnelList(res);
    } catch (err) {
      console.error(err);
      message.error("Failed to load personnel list");
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (record) => {
    setEditing(record);

    const formValues = {
      ...record,
      // Convert 0/1 to boolean for all checkboxes/radios
      officer_course: record.officer_course === 1,
      seamanship: record.seamanship === 1,
      navigation_qualified: record.navigation_qualified === 1,
      boarding_team_qualified: record.boarding_team_qualified === 1,
      diver_qualification: record.diver_qualification === 1,
      instructor_qualification: record.instructor_qualification === 1,
      it_cyber_skill: record.it_cyber_skill,
      weapon_rifle: record.weapon_rifle === 1,
      weapon_pistol: record.weapon_pistol === 1,
      weapon_mg: record.weapon_mg === 1,
      driving_license_military: record.driving_license_military === 1,
      driving_license_civilian: record.driving_license_civilian === 1,
    };

    form.setFieldsValue(formValues);
    setOpen(true);
  };

  // Submit Add/Edit
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Convert boolean fields to 0/1
      const payload = {
        ...values,
        officer_course: values.officer_course ? 1 : 0,
        seamanship: values.seamanship ? 1 : 0,
        navigation_qualified: values.navigation_qualified ? 1 : 0,
        boarding_team_qualified: values.boarding_team_qualified ? 1 : 0,
        diver_qualification: values.diver_qualification ? 1 : 0,
        instructor_qualification: values.instructor_qualification ? 1 : 0,
        weapon_rifle: values.weapon_rifle ? 1 : 0,
        weapon_pistol: values.weapon_pistol ? 1 : 0,
        weapon_mg: values.weapon_mg ? 1 : 0,
        driving_license_military: values.driving_license_military ? 1 : 0,
        driving_license_civilian: values.driving_license_civilian ? 1 : 0,
      };

      let res;
      if (editing) {
        res = await request(`skills/${editing.id}`, "put", payload);
      } else {
        res = await request("skills", "post", payload);
      }

      if (res && !res.error) {
        message.success(editing ? "Updated successfully" : "Created successfully");
        setOpen(false);
        getList();
      } else {
        message.error("Failed to save skill");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete skill
  const deleteSkill = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this skill?",
      onOk: async () => {
        const res = await request(`skills/${record.id}`, "delete");
        if (res && !res.error) {
          message.success("Deleted successfully");
          getList();
        } else {
          message.error("Delete failed");
        }
      },
    });
  };

  const columns = [
  { title: "#", width: 50, align: "center", render: (_, __, i) => i + 1 },

  {
    title: "Personnel",
    dataIndex: ["personnel", "full_name_en"],
    width: 180
  },

  {
    title: "Rank",
    dataIndex: ["personnel", "rank"],
    width: 120,
    align: "center",
  },

  {
    title: "Officer Course",
    dataIndex: "officer_course",
    width: 110,
    align: "center",
    render: v => (v ? "Yes" : "No"),
  },

  {
    title: "Seamanship",
    dataIndex: "seamanship",
    width: 110,
    align: "center",
    render: v => (v ? "Yes" : "No"),
  },

  {
    title: "Navigation",
    dataIndex: "navigation_qualified",
    width: 130,
    align: "center",
    render: v => (v ? "Yes" : "No"),
  },

  {
    title: "Engineering Level",
    dataIndex: "engineering_level",
    width: 180,
    align: "center",
  },

  {
    title: "IT / Cyber Skill",
    dataIndex: "it_cyber_skill",
    width: 300,
    ellipsis: true,
  },

  {
    title: "Language Proficiency",
    width: 220,
    render: (_, r) => (
      <div style={{ lineHeight: "20px" }}>
        <div>EN : {r.language_en || ""}</div>
        <div>VN : {r.language_vn || ""}</div>
        <div>TH : {r.language_th || ""}</div>
      </div>
    ),
  },

  {
    title: "Weapon",
    width: 200,
    render: (_, r) => (
      <div style={{ lineHeight: "20px" }}>
        <div>Rifle : {r.weapon_rifle ? "Yes" : "No"}</div>
        <div>Pistol : {r.weapon_pistol ? "Yes" : "No"}</div>
        <div>MG : {r.weapon_mg ? "Yes" : "No"}</div>
      </div>
    ),
  },
  {
    title: "Driving License",
    width: 200,
    render: (_, r) => (
      <div style={{ lineHeight: "20px" }}>
        <div>Military : {r.driving_license_military ? "Yes" : "No"}</div>
        <div>Civilian : {r.driving_license_civilian ? "Yes" : "No"}</div>
      </div>
    ),
  },
   {
    title: "Created At",
    dataIndex: "created_at",
    align:"center",
    width:180,
    render:(date)=> formatDateTable(date)
  },
  {
    title: "Updated At",
    dataIndex: "updated_at",
    align: "center",
    width: 180,
    render:(date)=> formatDateTable(date)
  },
  {
    title: "Actions",
    width: 120,
    fixed: "right",
    align: "center",
    render: (_, record) => (
      <Space>
        <Button type="primary" icon={<EditFilled />} onClick={()=>openEditModal(record)} />
        <Button danger icon={<DeleteFilled />} onClick={ ()=>deleteSkill(record)}/>
      </Space>
    ),
  },
];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Skills</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Skill
        </Button>
      </div>

      <Spin spinning={state.loading}>
        <Table
          dataSource={state.list}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: 1200 }}
        />
      </Spin>

      <Modal
        title={editing ? "Edit Skill" : "Add Skill"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="Save"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="personnel_id"
            label="Personnel"
            rules={[{ required: true, message: "Please select personnel" }]}
          >
            <Select placeholder="Select personnel">
              {personnelList.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.full_name_en}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: 18 ,marginBottom: 0 }}>
            <Form.Item name="officer_course" label="Officer Course" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="seamanship" label="Seamanship" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="navigation_qualified" label="Navigation Qualified" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item name="engineering_level" label="Engineering Level">
            <Input type="number" />
          </Form.Item>

          <div style={{display : 'flex' ,gap:18 ,marginBottom: 20 }}>
            <Form.Item name="boarding_team_qualified" label="Boarding Team Qualified" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="diver_qualification" label="Diver Qualification" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="instructor_qualification" label="Instructor Qualification" initialValue={false} style={{ flex: 1, marginBottom: 0 }}>
              <Radio.Group>
                <div style={{ display: 'flex', gap: 20 }}>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item name="it_cyber_skill" label="IT / Cyber Skill">
            <Input />
          </Form.Item>

          <Form.Item label="Language Proficiency" style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <Form.Item name="language_en" label="Eenglish" style={{ flex: 1, marginBottom: 0 }}>
                <Input />
              </Form.Item>
              <Form.Item name="language_vn" label="Vietnam" style={{ flex: 1, marginBottom: 0 }}>
                <Input />
              </Form.Item>
              <Form.Item name="language_th" label="Thailand" style={{ flex: 1, marginBottom: 0 }}>
                <Input />
              </Form.Item>
            </div>
          </Form.Item>
        

        <Form.Item label="Weapon Qualification (Rifle / Pistol / MG)" style={{width:'100%'}}>
          <div style={{display:'flex' ,gap:16 }}>
            <Form.Item name="weapon_rifle" valuePropName="checked" style={{ flex: 1, marginBottom: 0 }}>
              <Checkbox>Weapon Rifle</Checkbox>
            </Form.Item>
            <Form.Item name="weapon_pistol" valuePropName="checked" style={{ flex: 1, marginBottom: 0 }}>
              <Checkbox>Weapon Pistol</Checkbox>
            </Form.Item>
            <Form.Item name="weapon_mg" valuePropName="checked" style={{ flex: 1, marginBottom: 0 }}>
              <Checkbox>Weapon MG</Checkbox>
            </Form.Item>
          </div>
        </Form.Item>
          
        <Form.Item label="Driving License (Military / Civilian)" style={{width:'100%'}}>
          <div style={{display:'flex' ,gap:16 }}>
            <Form.Item name="driving_license_military" valuePropName="checked" style={{width:205}}>
              <Checkbox>Military</Checkbox>
            </Form.Item>
            <Form.Item name="driving_license_civilian" valuePropName="checked" style={{width:205}}>
              <Checkbox>Civilian</Checkbox>
            </Form.Item>
          </div>
        </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SkillPage;
