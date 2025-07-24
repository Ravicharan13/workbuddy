const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware");
const role = require("../middleware/roleMiddleware");


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
  changePassword,
  workers,
  getChatRoomId,
  getCustomerProfile,
  custUpdateAvatar,
  custUpdateInfo,
  getAllByCust,
  customerCancelRequest,
  getChart,
  getChatMessages,
  refreshAccessToken,
  getMe,
  logout,
  getRequireInfoCust,
  getRequireInfo,
  workerChangePassword
} = require("../controllers/controllers");

router.get("/get-require-info",auth,getRequireInfo)

// Worker routes
router.post("/worker/register", register);   
router.get("/worker/profile", auth,role("worker"), getWorkerProfile);
router.post("/login", login);
router.put("/profileupdate", auth,role("worker"), updateWorkerProfile);
router.get("/all", auth,role("worker"), getAllWorkers);
router.get("/workers",auth,role("customer"),workers)

// Password reset (Worker)
router.post("/worker/send-resetcode", sendResetCodeWorker);
router.post("/worker/verify-resetcode", verifyResetCodeWorker);
router.post("/worker/reset-password", resetPasswordWorker);
//Worker profile api's
router.get("/worker/profile",auth,role("worker"),getWorkerProfile)
router.patch("/worker/update-avatar",auth,role("worker"),updateAvatar)
router.patch("/worker/update-info",auth,role("worker"),updateInfo)
router.post('/worker/services', auth,role("worker"), addService);
router.delete('/worker/services/:serviceId', auth,role("worker"), deleteService);
router.delete('/worker/services', auth,role("worker"), deleteAllServices);
router.patch("/worker/change-password",auth,role("worker"),workerChangePassword)

// Customer routes
router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);
router.put("/customer/profile", auth,role("customer"), updateCustomerProfile);
router.post("/customer/send-resetcode", sendResetCodeCustomer);
router.post("/customer/verify-resetcode", verifyResetCodeCustomer);
router.post("/customer/reset-password", resetPasswordCustomer);
router.post("/customer/getcustomer",auth,auth,role("customer"), getCustomerData);
router.get("/customer/profile",auth,role("customer"),getCustomerProfile)
router.patch("/customer/update-avatar",auth,role("customer"),custUpdateAvatar)
router.patch("/customer/update-info",auth,role("customer"),custUpdateInfo)
router.patch("/customer/change-password",auth,role("customer"),changePassword)


//WORKER-CUSTOMER REQUEST API'S
router.post("/workreq",auth,role("customer"),getCustWorkReq)
router.get("/getallwork",auth,role("worker"),getAllByWork)
router.get("/getallcust",auth,role("customer"),getAllByCust)
router.put("/customercancelrequest/:id",auth,role("customer"),customerCancelRequest)
router.get("/getall",getAll)
router.put("/accept",auth,role("worker"), acceptRequest)
router.get("/message/:chatRoomId",auth,getChart)
router.get("/chats",auth,getChatMessages)

router.post("/refresh",refreshAccessToken)
router.get("/me",auth,getMe)
router.post('/logout', logout);

module.exports = router;

//chatbox and we need pass the customerId and workerId
router.get("/messages/chat-status/:customerId/:workerId", getChatRoomId);