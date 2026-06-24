const router = require("express").Router();
const c = require("../controllers/profiles.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.get("/me",  requireAuth, apiLimiter, c.getMyProfile);
router.put("/me",  requireAuth, apiLimiter, c.upsertMyProfile);

module.exports = router;
