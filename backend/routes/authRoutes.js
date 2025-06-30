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
  customerLogin
} = require("../controllers/controllers");

// Worker routes
router.post("/worker/register", register);   
router.post("/login", login);
router.post("/profileupdate", auth, updateWorkerProfile);
router.get("/all", auth, getAllWorkers);

// Password reset (Worker)
router.post("/sendresetcode", sendResetCode);
router.post("/verifyresetcode", auth, verifyResetCode);

// Customer routes
router.post("/customer/register", customerRegister);
router.post("/customer/login", customerLogin);

module.exports = router;
