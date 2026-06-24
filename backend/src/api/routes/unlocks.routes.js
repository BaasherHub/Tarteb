const router = require("express").Router();
const c = require("../controllers/unlocks.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.post("/",  requireAuth, apiLimiter, c.unlockCandidate);
router.get("/",   requireAuth, apiLimiter, c.getMyUnlocks);

module.exports = router;
