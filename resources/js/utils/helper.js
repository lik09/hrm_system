import dayjs from "dayjs";


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