import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import EditUserCard from "./EditUserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const formData = new FormData();

      // Append fields
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("photoUrl", photoUrl);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);

      // Append file
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.log("Error is :", err);
      setError(err.response.data);
    }
  };

  return (
    // Responsive version
    <>
      <div className="flex flex-col md:flex-row justify-center items-start my-10 gap-10">
        {/* Form Section */}
        <div className="w-full max-w-lg px-4">
          <div className="card bg-base-300 w-full shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center text-center">
                Edit Profile
              </h2>
              <div>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Photo URL:</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="text"
                    value={age}
                    className="input input-bordered w-full"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">Gender:</span>
                  </div>
                  <input
                    type="text"
                    value={gender}
                    className="input input-bordered w-full"
                    onChange={(e) => setGender(e.target.value)}
                  />
                </label>
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>

                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <input
                    type="file"
                    className="file-input mt-4 file-input-bordered file-input-success w-full max-w-xs"
                    onChange={(e) => {
                      setProfilePicture(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="card-actions justify-center mt-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* UserCard Section */}
        <div className="w-full max-w-md ">
          <EditUserCard
            user={{ firstName, lastName, photoUrl, age, gender, about }}
          />
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
