import { createSlice } from "@reduxjs/toolkit";

interface IUser {
    _id: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "admin" | "deliveryBoy";
  img?: string;
}

interface IUserSlice {
  userData: IUser | null;
  loading: boolean;  
}

const initialState: IUserSlice = {
  userData: null,
  loading: true,   
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false;  
    },
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;