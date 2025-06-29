const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware")

const {
  register,
  login,
  getAllWorkers,
  updateWorkerProfile,
  sendResetCode,
  verifyResetCode,
  customerRegister,
   customerLogin,
   updateCustomerProfile ,
   sendResetCodeCust,
   verifyResetCodeCust,
   getCustomerData
} = require("../controllers/controllers");

router.post("/register", register);
router.post("/login",login)
router.post("/profileupdate",auth,updateWorkerProfile)
router.post("/sendresetcode",sendResetCode)
router.post("/verifyresetcode",auth,verifyResetCode)
router.get("/all",auth,getAllWorkers)
router.post("/customer/register",customerRegister)
router.post("/customer/login", customerLogin);
router.post("/customer/profileupdate",auth, updateCustomerProfile);
router.post("/customer/sendresetcode", sendResetCodeCust);
router.post("/customer/verifyresetcode",auth, verifyResetCodeCust);
router.post("/customer/getcustomer",auth, getCustomerData);
module.exports = router;
