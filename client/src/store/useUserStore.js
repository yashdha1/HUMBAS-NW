// maintains a Global store for all the User related activities :-  

import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null, 
    checkingAuth: true,
    loading: false, 

    signup : async ({username, email , password, confirmPassword , address, phoneNumber}) => {
        set({loading: true}); // start thy loading.... 
        if(password !== confirmPassword){
            set({loading: false}); // stop the Loading and return the error:  
            return toast.error("Passwords do not match");
        }
        try {
            console.log("axios connection string : "+axios);
            const res = await axios.post("auth/register", {username, email, password, address, phoneNumber});
            set({user: res.data.user , loading: false});
            console.log(res);
            toast.success("Signed Up Successfully");
        } catch (error) {
            set({loading: false}); // stop the Loading and return the error:
            console.log(error); 
            toast.error(error.response.data.error);
        }
    },
    login : async ({email, password}) => {
        set({loading: true}); // start thy loading.... 
        try {
            const res = await axios.post("/auth/login", { email, password }); 
            console.log(res)
            set({user: res.data.user , loading: false}); // finish Loading 
            console.log(res);
            toast.success("Logged in, Successfully");
        } catch (error) {
            set({loading: false}); // stop the Loading and return the error:
            console.log(error); 
            toast.error(error.response.data.error);
        }
    },
    checkAuth: async () => {
        set({checkingAuth: true});
        try {
            const res = await axios.get("/auth/profile");
            set({user: res.data.user , checkingAuth: false});
        } catch (error) {
          set({ checkingAuth: false , user: null});   
        }
    }, 
    logout: async () => {
        try {
            await axios.post("/auth/logout") ;
            set({user: null}); 
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error(error.response.data.error || "Error Occured Durinng LOGOUT.")
        }
    },
    updateUser: async (userData) => {
        set({loading: true});
        try {
            const res = await axios.put("/auth/update", userData);
            set({user: res.data.user, loading: false});
            toast.success("Profile Updated Successfully");
        } catch (error) {
            set({loading: false});
            console.log(error);
            toast.error(error.response?.data?.error || "Error Occured During Profile Update.");
        }
    },
    refreshToken: async () => {
        try {
            const res = await axios.post("/auth/refreshToken");
            console.log("Token refreshed successfully");
            return res.data;
        } catch (error) {
            console.log("Error refreshing token:", error);
            throw error;
        }
    },
}));

// Implement the axios Interceptors to refresh the Access Tokens:  15mins 
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);