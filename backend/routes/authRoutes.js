const express = require("express");
const router = express.Router();
const auth = require("../middleware/middleware")

const {
  register,
  login,
  getAllWorkers
} = require("../controllers/controllers");

router.post("/register", register);
router.post("/login",login)
router.get("/all",auth,getAllWorkers)


module.exports = router;
