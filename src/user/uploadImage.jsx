import API from "../config/api";

export const uploadImage = async (file) => {
  if (!file) return { imageUrl: "" };

  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/user/upload-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return { imageUrl: res.data.imageUrl };
};
