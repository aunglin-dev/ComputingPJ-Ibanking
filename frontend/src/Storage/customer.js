import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCustomer: null,
  loading: false,
  error: false,
};

export const CustomerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentCustomer = action.payload;
      console.log("currentCustomer", state.currentCustomer);

      console.log(JSON.parse(JSON.stringify(state.currentCustomer)));
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    Customerlogout: (state) => {
      state.currentCustomer = null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, Customerlogout } = CustomerSlice.actions;

export default CustomerSlice.reducer;
