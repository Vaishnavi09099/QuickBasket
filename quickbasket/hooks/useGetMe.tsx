"use client";

import { setUserData, setLoading } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetMe = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getMe = async () => {
      try {
        const result = await axios.get("/api/me");
        console.log("API /api/me response:", result.data);
        // The API returns { user, status } — prefer the inner user object when present
        const payload = result?.data?.user ?? result?.data ?? null;
        if (payload) {
          dispatch(setUserData(payload));
        } else {
          dispatch(setLoading(false));
        }
      } catch (err) {
        console.error("useGetMe error:", err);
        dispatch(setLoading(false));  
      }
    };

    getMe();
  }, [dispatch]);
};

export default useGetMe;