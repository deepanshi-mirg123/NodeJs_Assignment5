const express = require("express");
const userControllers = require("../controllers/userController");
const auth = require("../utils/jwt_auth");
const router = express.Router();

router.get("/", userControllers.getalldata);
router.get("/:id", auth, userControllers.getdata); 
router.post("/signup", userControllers.postdata); //signup
router.patch("/:id", userControllers.updatedata);
router.delete("/:id", userControllers.deletedata);

router.post("/login", auth, userControllers.loginUser); //signin

module.exports = router;
