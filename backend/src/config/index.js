require("dotenv").config();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : [];

module.exports = {
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "change_me_in_production",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioVerifySid: process.env.TWILIO_VERIFY_SERVICE_SID || "",
  skipOtpVerification: process.env.SKIP_OTP_VERIFICATION === "true",
  s3: {
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    bucketPhotos: process.env.S3_BUCKET_PHOTOS || "tarteb-candidate-photos",
    bucketCvs: process.env.S3_BUCKET_CVS || "tarteb-candidate-cvs",
    bucketLogos: process.env.S3_BUCKET_LOGOS || "tarteb-employer-logos",
  },
  corsOrigins,
};
