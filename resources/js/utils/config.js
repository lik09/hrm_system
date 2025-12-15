// export const config = {
//     base_url_api : "http://localhost:8000/api/",
//     image_path : "http://localhost:8000/storage/",
//     pdf_path :"http://localhost:8000/storage/",
// }

export const config = {
    base_url_api: import.meta.env.VITE_API_URL,
    image_path: import.meta.env.VITE_IMAGE_PATH,
    pdf_path: import.meta.env.VITE_PDF_PATH,
};
