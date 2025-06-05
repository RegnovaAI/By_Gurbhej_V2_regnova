import { BASE_URL } from "@/utils/api_constants";
import { useState } from "react";

export default function ProfileImage({ user, onAvatarUpdate }) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  async function uploadAvatar(formData) {
    const token = localStorage.getItem("rg-token");
    const res = await fetch(`${BASE_URL}/user/avatar`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url;
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadedUrl = await uploadAvatar(formData);
      setAvatarUrl(uploadedUrl);

      // Optional: notify parent
      if (onAvatarUpdate) onAvatarUpdate(uploadedUrl);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-20 h-20">
      <div className="w-full h-full bg-gray-700 rounded-full overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white" />
          </div>
        ) : (
          <img
            src={
              `${BASE_URL}${avatarUrl}` ||
              "/regnovaai-logo.png"
            }
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer shadow-md">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 20h14M12 4v12m0 0l-4-4m4 4l4-4" />
        </svg>
      </label>
    </div>
  );
}
