import API from '../config/api'; // axios instance

export const uploadImage = async (file) => {
  if (!file) return { imageUrl: "" };

  try {
    const formData = new FormData();
    formData.append("image", file); // 'image' matches upload.single("image")

    const res = await API.post("/user/upload-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { imageUrl: res.data.imageUrl }; // frontend now gets the URL
  } catch (err) {
    console.error("Upload error:", err.response || err);
    throw new Error(err.response?.data?.message || "Upload failed");
  }
};
