import dayjs from "dayjs";
import { Modal } from "antd";
import { request } from "./request";

export const formatDateClient = (date, format = "DD-MM-YYYY") => {
  return date ? dayjs(date).format(format) : null;
};


export const formatDateServer = (date , format = "YYYY-MM-DD") =>{
    return dayjs(date).format(format);
}

export const formatDateTable = (date, format = "DD-MM-YYYY hh:mm A") => {
  return date ? dayjs(date).format(format) : "-";
};



export const headerCellStyle = {
  backgroundColor: 'rgb(158, 198, 243)',
  fontWeight: 'bold',
  textAlign: 'center',
};


export const showLogoutConfirm = (navigate) => {
  Modal.confirm({
    title: "Confirm Logout",
    content: "Are you sure you want to logout?",
    okText: "Logout",
    cancelText: "Cancel",
    okType: "danger",
    centered: true,

    onOk: async () => {
      try {
        await request("logout", "post");
      } catch (e) {
        // ignore error
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    },
  });
};