import { useUser } from "../../context/UserContext";

export const useRole = () => {
  const { user } = useUser();

  const role = user?.role;

  return {
    role,
    isWorker: role === "worker",
    isCustomer: role === "customer",
    email: user?.email,
    username: user?.username,
    isLogin: user?.isLogin,
    profileUpdateStatus: user?.profileUpdateStatus
  };
};


