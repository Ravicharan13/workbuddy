const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware")

const {
  register,
  login,
  getAllWorkers,
  updateWorkerProfile,
  sendResetCode,
  verifyResetCode
} = require("../controllers/controllers");

router.post("/register", register);
router.post("/login",login)
router.post("/profileupdate",auth,updateWorkerProfile)
router.post("/sendresetcode",sendResetCode)
router.post("/verifyresetcode",auth,verifyResetCode)
router.get("/all",auth,getAllWorkers)


module.exports = router;
