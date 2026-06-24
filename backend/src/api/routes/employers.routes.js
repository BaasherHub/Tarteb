const router = require("express").Router();
const c = require("../controllers/employers.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

router.get("/me",                requireAuth, apiLimiter, c.getMyEmployer);
router.post("/",                 requireAuth, apiLimiter, c.createEmployer);
router.put("/me",                requireAuth, apiLimiter, c.updateMyEmployer);
router.get("/check-company-name", requireAuth, apiLimiter, c.checkCompanyName);

module.exports = router;
