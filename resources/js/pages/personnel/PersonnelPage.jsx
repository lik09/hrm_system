import React, { useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Image,
  Tag,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Upload,
} from 'antd';
import { EditFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { request, requestFormData } from '../../utils/request';
import { config } from '../../utils/config';
import dayjs from 'dayjs';
import { headerCellStyle } from '../../utils/helper';

function PersonnelPage() {
  const [state, setState] = useState({ list: [], loading: false });
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [numChildren, setNumChildren] = useState(0);
  const [childrenDetails, setChildrenDetails] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState(prev => ({ ...prev, loading: true }));
    const res = await request('personnels', 'get');
    console.log(res);
    if (Array.isArray(res)) {
      setState(prev => ({ ...prev, list: res, loading: false }));
      
    } else {
      setState(prev => ({ ...prev, loading: false }));
      message.error("Failed to load personnel");
    }
  };

  const handleNumChildrenChange = (value) => {
    setNumChildren(value);
    const details = [];
    for (let i = 0; i < value; i++) {
      details.push({ name: '', dob: null });
    }
    setChildrenDetails(details);
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...childrenDetails];
    updated[index][field] = value;
    setChildrenDetails(updated);
  };

    const toFileList = (img) => {
      if (!img) return [];
      return [
        {
          uid: '-1',
          name: img.split('/').pop(),
          status: 'done',
          url: config.image_path + img,
        },
      ];
    };


  const openAddModal = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setMaritalStatus('single');
    setNumChildren(0);
    setChildrenDetails([]);
    setOpen(true);
  };

  const openEditModal = (record) => {
    setEditing(record);
    const files = toFileList(record.photo);
    

    form.setFieldsValue({
      ...record,
      date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
      date_joined: record.date_joined ? dayjs(record.date_joined) : null,
      marital_status: record.marital_status || 'single',
      num_children: record.num_children || 0,
      spouse_name: record.spouse_name || '',
      spouse_dob: record.spouse_dob ? dayjs(record.spouse_dob) : null,
      photo: files,
      status: record.status || 'active',
    });
    setFileList(files);
    setMaritalStatus(record.marital_status || 'single');
    setNumChildren(record.num_children || 0);
    setChildrenDetails(
      record.children_details?.map(c => ({
        name: c.name,
        dob: c.dob ? dayjs(c.dob) : null,
      })) || []
    );

    setOpen(true);
  };



const onSubmit = async () => {
  try {
    const values = await form.validateFields();
     console.log("Show: ",values.children_details);
     // ប្រសិន marital_status != 'married', clear spouse & children before send
    if (values.marital_status !== 'married') {
      values.spouse_name = '';
      values.spouse_dob = null;
      values.num_children = 0;
       form.setFieldsValue({ children_details: [] });
  setChildrenDetails([]);
    }
    const formData = new FormData();

    // Append form fields except photo
    Object.keys(values).forEach((key) => {
      if (key === "photo") return;
      if (values[key] instanceof dayjs) {
        formData.append(key, values[key].format("YYYY-MM-DD"));
      } else {
        formData.append(key, values[key] ?? "");
      }
    });

    // Append children details
    // formData.append(
    //   "children_details",
    //   JSON.stringify(
    //     childrenDetails.map((c) => ({
    //       name: c.name,
    //       dob: c.dob ? c.dob.format("YYYY-MM-DD") : null,
    //     }))
    //   )
    // );

    formData.append(
      "children_details",
      JSON.stringify(
        values.marital_status === 'married'
          ? childrenDetails.map((c) => ({
              name: c.name,
              dob: c.dob ? c.dob.format("YYYY-MM-DD") : null,
            }))
          : [] // clear if not married
      )
    );


    const file = fileList[0];

    if (file?.originFileObj) {
      // Upload new photo
      formData.append('photo', file.originFileObj);
    } else if (!file && editing?.photo) {
      // User removed existing photo
      formData.append('photo', '');
    }

    if (editing) {
      formData.append('_method', 'PUT');
    }

    // Debug FormData
    console.log("===== FORM DATA =====");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File { name: ${value.name}, type: ${value.type}, size: ${value.size} }`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log("===== END FORM DATA =====");

    // Send request
    let res;
    if (editing) {
      res = await request(`personnels/${editing.id}`, "post", formData, true);
    } else {
      res = await request("personnels", "post", formData, true);
    }

    if (res && !res.error) {
      message.success(editing ? "Updated successfully" : "Created successfully");
      setOpen(false);
      getList();
    } else {
      message.error(res?.message || "Failed to save data");
    }

  } catch (error) {
    console.error(error);
    message.error("An error occurred while saving data");
  }
};






  const deletePersonnel = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete?",
      onOk: async () => {
        const res = await request(`personnels/${record.id}`, 'delete');
        if (res && !res.error) {
          message.success("Deleted");
          getList();
        } else {
          message.error("Delete failed");
        }
      },
    });
  };

  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 60 ,align: "center"},
    { title: "Service Number", dataIndex: "service_number", width: 120 ,align: "center"},
    { title: "Name (KH)", dataIndex: "full_name_kh" ,align: "center"},
    { title: "Name (EN)", dataIndex: "full_name_en" ,align: "center"},
    { title: "Rank", dataIndex: "rank", width: 100 ,align: "center"},
    { title: "Unit", dataIndex: "unit", width: 120 ,align: "center"},
    { title: "Position", dataIndex: "position", width: 150 ,align: "center"},
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      width: 120,
      align: "center",
      render: dob => dob?.slice(0, 10),
    },
    {
      title: "Joined Date",
      dataIndex: "date_joined",
      width: 120,
      align: "center",
      render: d => d?.slice(0, 10),
    },
    { title: "Marital Status", 
      dataIndex: "marital_status", 
      width: 120 ,
      align: "center",
      render: (m) => {
      if (!m) return null;
      const text = m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
      return text;
    },
    },
    { title: "Spouse's Name", dataIndex: "spouse_name", width: 100, align: "center" },
    { title: "Spouse DOB", 
      dataIndex: "spouse_dob", 
      align: "center" ,
      render: d => d?.slice(0, 10),
    },
    { title: "Children", dataIndex: "num_children", width: 100, align: "center" },
    {
      title: "Children Details",
      dataIndex: "children_details",
      align: "center",
      render: (children) => {
        if (!children || children.length === 0) return "No Children";

        // បង្ហាញជា string
        // return children.map(c => `${c.name} (${c.dob})`).join(", ");
        
        // ឬបើចង់បង្ហាញជារាយការណ៍លីស្ដ
        return (
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {children.map((c, i) => (
              <li key={i}>{c.name} - {c.dob}</li>
            ))}
          </ul>
        );
      },
    },

    { title: "Contact", dataIndex: "contact", width: 120 ,align: "center" },
    { title: "Address", dataIndex: "address", width: 120 ,align: "center" },
    { title: "Next of Kin", dataIndex: "next_of_kin", width: 120 ,align: "center" },
    { title: "Education Level", dataIndex: "education_level", width: 120 ,align: "center"},
    { title: "Blood Type", dataIndex: "blood_type", width: 120 ,align: "center"},
    { title: "Medical Category", dataIndex: "medical_category", width: 120 ,align: "center"},
    { title: "Notes", dataIndex: "note" },
    {
      title: "Photo",
      dataIndex: "photo",
      align: "center",
      width: 120,
     
      render: img =>
        img ? (
          <Image
            width={60}
            height={60}
            src={config.image_path + img}
            style={{ borderRadius: 6, objectFit: "cover" }}
          />
        ) : "No Photo",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (s) => {
        if (!s) return null;

        // Capitalize first letter
        const text = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

        let color = "red"; // default color
        if (s === "active") color = "green";
        else if (s === "retired") color = "blue";
        else if (s === "resigned") color = "red";

        return <Tag color={color}>{text}</Tag>;
      },
    },

    {
      title: "Actions",
      align: "center",
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditFilled />} onClick={() => openEditModal(record)} />
          <Button danger icon={<DeleteFilled />} onClick={() => deletePersonnel(record)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Personnel</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Personnel
        </Button>
      </div>

      <Spin spinning={state.loading}>
        <Table
          dataSource={state.list}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: "max-content" }}

        />
      </Spin>

      <Modal
        title={editing ? "Edit Personnel" : "Add Personnel"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="Save"
        width={800}
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 350 }}>
              <Form.Item name="service_number" label="Service Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="full_name_kh" label="Full Name (KH)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="full_name_en" label="Full Name (EN)" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="rank" label="Rank" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="position" label="Position" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="date_joined" label="Date Joined" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="contact" label="Contact">
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Status" initialValue="active">
                <Select>
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="retired">Retired</Select.Option>
                  <Select.Option value="resigned">Resigned</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div style={{ width: 350 }}>
              <Form.Item name="marital_status" label="Marital Status" initialValue="single" >
                <Select value={maritalStatus} onChange={(value) => setMaritalStatus(value)}>
                  <Select.Option value="single">Single</Select.Option>
                  <Select.Option value="married">Married</Select.Option>
                  <Select.Option value="divorced">Divorced</Select.Option>
                </Select>
              </Form.Item>

              {maritalStatus === 'married' && (
                <>
                  <Form.Item name="spouse_name" label="Spouse Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="spouse_dob" label="Spouse DOB" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item name="num_children" label="Number of Children">
                    <InputNumber min={0} style={{ width: '100%' }} onChange={handleNumChildrenChange} />
                  </Form.Item>

                  {numChildren > 0 &&
                    childrenDetails.map((child, index) => (
                      <div key={index} style={{ marginBottom: 16, border: "1px solid #eee", padding: 10 }}>
                        <Form.Item label={`Child ${index + 1} Name`}>
                          <Input
                            value={child.name}
                            onChange={(e) => handleChildChange(index, "name", e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item label={`Child ${index + 1} DOB`}>
                          <DatePicker
                            value={child.dob}
                            style={{ width: '100%' }}
                            onChange={(date) => handleChildChange(index, "dob", date)}
                          />
                        </Form.Item>
                      </div>
                    ))}
                </>
              )}




              <Form.Item name="address" label="Address">
                <Input />
              </Form.Item>
              <Form.Item name="next_of_kin" label="Next of Kin">
                <Input />
              </Form.Item>
              <Form.Item name="education_level" label="Education Level">
                <Input />
              </Form.Item>
              <Form.Item name="blood_type" label="Blood Type">
                <Input />
              </Form.Item>
              <Form.Item name="medical_category" label="Medical Category">
                <Input />
              </Form.Item>
              <Form.Item name="notes" label="Notes">
                <Input />
              </Form.Item>

              <Form.Item
              label="Photo"
              name="photo"
              valuePropName="fileList"
             getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList || [];
              }}

            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
                onRemove={() => {
                  setRemovePhoto(true); // Mark photo for deletion
                  setFileList([]);
                }}
                maxCount={1}
                accept="image/*"
              >
                {fileList.length ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default PersonnelPage;
