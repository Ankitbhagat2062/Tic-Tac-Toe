import { create } from "zustand";
import {axiosClient} from '../services/apiclient';

const useAuthStore = create((set) => ({
  user: null,
  usersProfile: null,

  // action to set user
  setUser: (user) => set({ user }),

  // async fetch user
  fetchUser: async () => {
    try {
      const { data } = await axiosClient.get("/isAuthenticated");
      set({ user: data.user });
    } catch (err) {
      console.log(err.response || err);
    }
  },
}));

export default useAuthStore;
