import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import packageReducer from "../redux/slices/packageSlice";
import bookingReducer from "../redux/slices/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    package: packageReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
