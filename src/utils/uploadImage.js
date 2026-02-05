import axios from "axios";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      "http://localhost:8000/image/upload", // 👈 change if needed
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading the image:", error.response || error);
    throw error;
  }
};

export default uploadImage;
