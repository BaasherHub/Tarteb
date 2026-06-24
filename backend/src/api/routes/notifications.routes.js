const router = require("express").Router();
const c = require("../controllers/notifications.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.post("/token",   requireAuth, apiLimiter, c.registerToken);
router.delete("/token", requireAuth, apiLimiter, c.removeToken);

module.exports = router;
