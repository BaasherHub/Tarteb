const router = require("express").Router();
const c = require("../controllers/browse.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.get("/candidates",   requireAuth, apiLimiter, c.browseCandidates);
router.get("/role-counts",  requireAuth, apiLimiter, c.getRoleCounts);

module.exports = router;
