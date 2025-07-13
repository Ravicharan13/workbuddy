export const getRole = () => {
  return localStorage.getItem("role");
};

export const isWorker = () => getRole() === "worker";
export const isCustomer = () => getRole() === "customer";

export const getUser = () => {
  return {
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };
};

