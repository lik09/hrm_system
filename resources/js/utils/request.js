import axios from "axios";
import { config  } from "./config";

export const request = (url = "", method = "get", data = {}, isFormData = false) => {
   const token = localStorage.getItem("token");  
  return axios({
        url: config.base_url_api + url,
        method: method,
        data: data,
        withCredentials: true, // ប្រសិនបើចង់ support Sanctum
        headers: {
            "Accept": "application/json",
            "Content-Type": isFormData ? "multipart/form-data" : "application/json",
           ...(token && { "Authorization": `Bearer ${token}` }),
        }
    })
    .then(res => res.data)
    .catch(error => {
        console.log("Axios Error:", error);
       // ប្រសិនបើ backend return JSON message
        if (error.response && error.response.data) {
            throw error.response;  // <-- important, throw to catch block in React
        } else {
            throw error; // network error
        }
    });
};


export async function requestFormData(url, method = 'GET', body = null, config = {}) {
// const baseUrl = config.base_url_api; // your API base
  const baseUrl = 'http://localhost:8000/api/'; // your API base


  const options = {
    method,
    headers: {
      ...config.headers,
    },
  };

  if (body) {
    options.body = body;
  }

  try {
    const response = await fetch(baseUrl + url, options);
    if (!response.ok) {
      // handle HTTP errors
      const errorText = await response.text();
      throw new Error(errorText || 'HTTP error');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
