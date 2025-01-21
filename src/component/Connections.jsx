import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (error) {
      // ERROR
      console.log("Error in fetching Connections :", connections);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return <div>Sorry You Don't Have any Connections</div>;

  return (
    <div>
      {/* Page Title */}
      <div className="flex justify-center">
        <h1 className="font-bold my-10 text-xl md:text-2xl">Connections</h1>
      </div>

      {/* Connections Container */}
      <div className="flex flex-col items-center">
        {connections.map((data) => {
          const { firstName, lastName, photoUrl, about, skills, _id } = data;
          return (
            <div
              key={data._id}
              className="card card-side bg-base-200 shadow-xl w-full md:w-3/4 lg:w-1/2 h-auto my-5 flex flex-col md:flex-row"
            >
              {/* Image Section */}
              <figure className="w-full md:w-1/2 h-60 md:h-72">
                <img
                  className="w-full h-full object-cover"
                  src={
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt="Profile"
                />
              </figure>

              {/* Card Body */}
              <div className="card-body p-4">
                <h2 className="card-title text-lg md:text-xl">
                  {firstName + " " + lastName}
                </h2>
                <p className="text-sm md:text-base">{about}</p>
                <div className="card-actions justify-end mt-4 space-x-2">
                  <Link to={"/chat/" + _id}>
                    <button className="btn btn-primary btn-sm md:btn-md">
                      Chat
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
