import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    setImage(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="profile-photo-selector">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden-input"
      />

      {!image ? (
        <div className="photo-placeholder">
          <div className="photo-frame">
            <LuUser size={48} className="photo-icon" />
          </div>
          <button type="button" className="upload-btn" onClick={onChooseFile}>
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="photo-preview">
          <div className="photo-frame">
            <img src={previewUrl} alt="Profile Preview" className="photo-img" />
          </div>
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
