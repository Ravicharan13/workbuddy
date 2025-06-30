const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware");

const {
  register,
  login,
  getAllWorkers,
  updateWorkerProfile,
  sendResetCode,
  verifyResetCode,
  customerRegister,
   customerLogin,
   updateCustomerProfile,
   sendResetCodeCust,
   verifyResetCodeCust,
  getCustomerData
} = require("../controllers/controllers");

// Worker routes
router.post("/worker/register", register);   
router.post("/login", login);
router.put("/profileupdate", auth, updateWorkerProfile);
router.get("/all", auth, getAllWorkers);

// Password reset (Worker)
router.post("/sendresetcode", sendResetCode);
router.post("/verifyresetcode", auth, verifyResetCode);

// Customer routes
router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);
router.put("/customer/profile", auth, updateCustomerProfile);
router.post("/customer/sendresetcode", sendResetCodeCust);
router.post("/customer/verifyresetcode",auth, verifyResetCodeCust);
router.post("/customer/getcustomer",auth, getCustomerData);
module.exports = router;
