import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common/index";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const MyProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userDetails);
  const [profilePicURL, setProfilePicURL] = useState("");
  const fileInputRef = useRef(null);

  const backendURL = 'http://localhost:8080';

  useEffect(() => {
    if (user?.profilePicture) {
      const filename = user.profilePicture.split('\\').pop();
      setProfilePicURL(`${backendURL}/uploads/${filename}`);
    } else {
      setProfilePicURL("");
    }
  }, [user]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await fetch(SummaryApi.updateProfilePicture(user._id).url, {
        method: SummaryApi.updateProfilePicture(user._id).method,
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const filename = data.profilePicture.split('\\').pop();
        const newProfilePicURL = `${backendURL}/uploads/${filename}`;
        setProfilePicURL(newProfilePicURL);
        console.log("New profilePicURL:", newProfilePicURL); // ADDED THIS LINE
        dispatch(setUserDetails({ ...user, profilePicture: data.profilePicture }));
      } else {
        console.error("Failed to update profile picture:", data.message);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">My Profile</h2>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          {profilePicURL ? (
            <img
              src={profilePicURL}
              alt="Profile"
              className="w-full h-full rounded-full border-4 border-gray-300 object-cover shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-full h-full text-gray-400" />
          )}

          <label className="absolute bottom-2 right-2 bg-green-600 text-white text-sm px-3 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
            <FaCamera size={16} />
            <input type="file" onChange={handleProfilePicChange} className="hidden" ref={fileInputRef} />
          </label>
        </div>

        <div className="mt-6 text-center space-y-3">
          <p className="text-lg text-gray-700"><strong>Name:</strong> {user?.name}</p>
          <p className="text-lg text-gray-700"><strong>Email:</strong> {user?.email}</p>
          <p className="text-lg text-gray-700"><strong>Phone:</strong> {user?.phoneNumber || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;