import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, PROFILE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests.requests);
  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      // ERROR LOGIC
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const reviewRequest = async (status, requestId, removeId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      console.log("review Reques is :", res);

      dispatch(removeRequests(removeId));
      console.log("Control reaches here :");

      // if (res.status === 200) {

      // }
    } catch (error) {
      console.log("Error in revewing the request :", error);
    }
  };

  if (!requests) {
    return (
      <div className="flex justify-center items-center pt-40 pb-40">
        <div>
          <span className="loading loading-spinner loading-xs"></span>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-spinner loading-md"></span>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }
  if (requests.length === 0) return <div>You Don't Have any Requests</div>;

  return (
    <div>
      <div className="flex justify-center">
        <h1 className="font-bold my-10 text-xl md:text-2xl">Requests</h1>
      </div>

      <div className="flex flex-col items-center">
        {requests.map((data) => {
          const { firstName, lastName, about, skills, _id,isPremium } =
            data.fromUserId;
          return (
            <div
              key={data._id}
              className="card card-side bg-base-200 shadow-xl w-full md:w-3/4 lg:w-1/2 h-auto my-5 flex flex-col md:flex-row"
            >
              <figure className="w-full md:w-1/2 h-60 md:h-72">
                <img
                  className="w-full h-full object-cover"
                  src={PROFILE_URL}
                  alt="Profile"
                />
              </figure>
              <div className="card-body p-4">
                <div className="flex">
                  <h2 className="card-title">{firstName + " " + lastName}</h2>
                  {isPremium && (
                    <img
                      className="h-8 w-8 ml-1"
                      src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png"
                      alt="premium-memger"
                    ></img>
                  )}
                </div>
                <p className="break-words">{skills.join(" ")}</p>
                <p className="text-sm md:text-base">{about}</p>
                <div className="card-actions justify-end space-x-2 mt-4">
                  <button
                    onClick={() => reviewRequest("accepted", data._id, _id)}
                    className="btn btn-primary btn-sm md:btn-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reviewRequest("rejected", data._id, _id)}
                    className="btn btn-secondary btn-sm md:btn-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
