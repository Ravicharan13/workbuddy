const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware");

const {
  register,
  login,
  getAllWorkers,
  updateWorkerProfile,
  sendResetCodeWorker,
  verifyResetCodeWorker,
  resetPasswordWorker,
  customerRegister,
  customerLogin,
  updateCustomerProfile,
  sendResetCodeCustomer,
  verifyResetCodeCustomer,
  resetPasswordCustomer,
  getCustomerData,
  getCustWorkReq,
  getAllByWork,
  getAll,
  acceptRequest,
  getWorkerProfile,
  updateAvatar,
  updateInfo,
  addService,
  deleteService,
  deleteAllServices,
  changePassword
  getChatRoomId,
  workers
} = require("../controllers/controllers");

// Worker routes
router.post("/worker/register", register);   
router.get("/worker/profile", auth, getWorkerProfile);
router.post("/login", login);
router.put("/profileupdate", auth, updateWorkerProfile);
router.get("/all", auth, getAllWorkers);
router.get("/workers",auth,workers)

// Password reset (Worker)
router.post("/worker/send-resetcode", sendResetCodeWorker);
router.post("/worker/verify-resetcode", verifyResetCodeWorker);
router.post("/worker/reset-password", resetPasswordWorker);
//Worker profile api's
router.get("/worker/profile",auth,getWorkerProfile)
router.patch("/worker/update-avatar",auth,updateAvatar)
router.patch("/worker/update-info",auth,updateInfo)
router.post('/worker/services', auth, addService);
router.delete('/worker/services/:serviceId', auth, deleteService);
router.delete('/worker/services', auth, deleteAllServices);
router.patch("/worker/change-password",auth,changePassword)

// Customer routes
router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);
router.put("/customer/profile", auth, updateCustomerProfile);
router.post("/customer/send-resetcode", sendResetCodeCustomer);
router.post("/customer/verify-resetcode", verifyResetCodeCustomer);
router.post("/customer/reset-password", resetPasswordCustomer);
router.post("/customer/getcustomer",auth, getCustomerData);


//WORKER-CUSTOMER REQUEST API'S
router.post("/workreq",auth,getCustWorkReq)
router.get("/getallwork",auth,getAllByWork)
router.get("/getall",getAll)
router.put("/accept",auth, acceptRequest)

module.exports = router;

//chatbox and we need pass the customerId and workerId
router.get("/messages/chat-status/:customerId/:workerId", getChatRoomId);