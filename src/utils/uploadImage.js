import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(
    `${API_URL}/upload/image`,
    formData
  );

  return response.data;
};

export default uploadImage;
