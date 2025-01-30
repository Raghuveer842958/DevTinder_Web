import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let tempUser;

  const handleSignup = async () => {
    try {
      const data = {
        firstName,
        lastName,
        emailId: email,
        password,
      };
      // console.log("Data is :", data);
      const res = await axios.post(BASE_URL + "/signup", data, {
        withCredentials: true,
      });
      console.log("Sign Response is :", res);
      tempUser = res.data;
      setShowOtpField(true);
    } catch (error) {
      //ERROR Logic
      console.log("Error in handle Signup :", error);
    }
  };

  const handleLogin = async () => {
    try {
      const url = BASE_URL + "/login";
      const data = { emailId: email, password };
      const res = await axios.post(url, data, { withCredentials: true });
      console.log("Login Response is :", res);
      if (res.status === 200) {
        tempUser = res.data;
        setShowOtpField(true);
      }
    } catch (error) {
      setError(error.response?.data);
      console.log("Error in Handle Login :", error);
    }
  };

  const handleOtp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/verify-otp",
        { emailId: email, otp },
        { withCredentials: true }
      );

      // console.log("OTP response is :", res);
      dispatch(addUser(tempUser));
      navigate("/");
    } catch (error) {
      console.log("Error in verifing the OTP");
    }
  };

  return (
    // This is Responsive Version
    <div className="flex justify-center px-4">
      {/* Card Container */}
      <div className="card bg-base-200 w-full max-w-md shadow-xl my-10">
        <div className="card-body">
          {/* Title */}
          <h1 className="card-title text-xl md:text-2xl font-bold">
            {isLogin ? "Login" : "Signup"}
          </h1>

          {/* Signup Fields */}
          {!isLogin && !showOtpField && (
            <>
              <label className="form-control w-full">
                <div className="label">
                  <span className="text-sm md:text-base">First Name</span>
                </div>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="Enter First Name"
                  className="input input-bordered w-full"
                />
              </label>

              <label className="form-control w-full mt-4">
                <div className="label">
                  <span className="text-sm md:text-base">Last Name</span>
                </div>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Enter Last Name"
                  className="input input-bordered w-full"
                />
              </label>
            </>
          )}

          {!showOtpField && (
            <>
              {/* Email Field */}
              <label className="form-control w-full mt-4">
                <div className="label">
                  <span className="text-sm md:text-base">Email Id</span>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Enter Email"
                  className="input input-bordered w-full"
                />
              </label>

              {/* Password Field */}
              <label className="form-control w-full mt-4">
                <div className="label">
                  <span className="text-sm md:text-base">Password</span>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter Password"
                  className="input input-bordered w-full"
                />
              </label>
            </>
          )}

          {showOtpField && (
            //  otp Field
            <label className="form-control w-full mt-4">
              <div className="label">
                <span className="text-sm md:text-base">Email Id</span>
              </div>
              <input
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                placeholder="Enter OTP"
                className="input input-bordered w-full"
              />
            </label>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {!showOtpField && (
            <>
              <div className="card-actions justify-center mt-4">
                <button
                  onClick={isLogin ? handleLogin : handleSignup}
                  className="btn btn-primary w-full md:w-auto"
                >
                  {isLogin ? "Login" : "Signup"}
                </button>
              </div>

              {/* Toggle Between Login and Signup */}
              <p
                onClick={() => setIsLogin((prev) => !prev)}
                className="flex justify-center cursor-pointer mt-4 text-sm md:text-base"
              >
                {isLogin
                  ? "New User? Signup Here"
                  : "Existing User? Login Here"}
              </p>
            </>
          )}

          {showOtpField && (
            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-primary w-full md:w-auto"
                onClick={handleOtp}
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
