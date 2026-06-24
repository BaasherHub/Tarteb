const router = require("express").Router();
const multer = require("multer");
const c = require("../controllers/storage.controller");
const { requireAuth } = require("../../middleware/auth");
const { apiLimiter } = require("../middlewares/rate-limit");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post("/photo",         requireAuth, apiLimiter, upload.single("file"), c.uploadPhoto);
router.delete("/photo",       requireAuth, apiLimiter, c.deletePhoto);
router.post("/cv",            requireAuth, apiLimiter, upload.single("file"), c.uploadCv);
router.delete("/cv",          requireAuth, apiLimiter, c.deleteCv);
router.get("/cv/:candidateId", requireAuth, apiLimiter, c.downloadCv);
router.post("/logo",          requireAuth, apiLimiter, upload.single("file"), c.uploadLogo);

module.exports = router;
