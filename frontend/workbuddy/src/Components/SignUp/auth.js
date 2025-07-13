export const getRole = () => {
  return localStorage.getItem("role");
};

export const isWorker = () => getRole() === "worker";
export const isCustomer = () => getRole() === "customer";
