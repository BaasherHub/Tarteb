const router = require("express").Router();
const c = require("../controllers/auth.controller");
const { requireAuth } = require("../../middleware/auth");
const { otpSendLimiter, otpVerifyLimiter, apiLimiter } = require("../middlewares/rate-limit");

router.post("/send-otp",    otpSendLimiter,   c.sendOtp);
router.post("/verify-otp",  otpVerifyLimiter, c.verifyOtp);
router.post("/refresh",     apiLimiter,       c.refresh);
router.post("/logout",      apiLimiter,       c.logout);
router.get("/me",           requireAuth, apiLimiter, c.me);

module.exports = router;
