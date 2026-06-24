const router = require("express").Router();
const c = require("../controllers/candidates.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.get("/me",    requireAuth, apiLimiter, c.getMyCandidate);
router.post("/",     requireAuth, apiLimiter, c.createCandidate);
router.put("/me",    requireAuth, apiLimiter, c.updateMyCandidate);
router.get("/:id",   requireAuth, apiLimiter, c.getCandidateById);

module.exports = router;
