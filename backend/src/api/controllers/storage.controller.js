const {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const pool = require("../../db/pool");
const config = require("../../config");

const s3 = new S3Client({
  region: config.s3.region,
  ...(config.s3.endpoint ? { endpoint: config.s3.endpoint } : {}),
  forcePathStyle: !!config.s3.endpoint,
});

function ext(originalname) {
  const i = originalname.lastIndexOf(".");
  return i >= 0 ? originalname.slice(i).toLowerCase() : "";
}

// POST /storage/photo  — upload candidate photo
async function uploadPhoto(req, res) {
  if (!req.file) return res.status(400).json({ error: "File required" });

  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const extension = ext(req.file.originalname);
  if (!allowed.includes(extension)) {
    return res.status(400).json({ error: "Only JPEG, PNG and WebP are accepted" });
  }

  const key = `${req.user.sub}/${uuidv4()}${extension}`;
  await new Upload({
    client: s3,
    params: {
      Bucket: config.s3.bucketPhotos,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    },
  }).done();

  const photoUrl = config.s3.endpoint
    ? `${config.s3.endpoint}/${config.s3.bucketPhotos}/${key}`
    : `https://${config.s3.bucketPhotos}.s3.${config.s3.region}.amazonaws.com/${key}`;

  await pool.query("UPDATE candidates SET photo_url = $1 WHERE user_id = $2", [
    photoUrl,
    req.user.sub,
  ]);

  return res.json({ photo_url: photoUrl });
}

// DELETE /storage/photo
async function deletePhoto(req, res) {
  const { rows } = await pool.query(
    "SELECT photo_url FROM candidates WHERE user_id = $1",
    [req.user.sub]
  );
  const url = rows[0]?.photo_url;
  if (url) {
    const key = url.split(`/${config.s3.bucketPhotos}/`)[1];
    if (key) {
      await s3
        .send(new DeleteObjectCommand({ Bucket: config.s3.bucketPhotos, Key: key }))
        .catch(() => {});
    }
  }
  await pool.query("UPDATE candidates SET photo_url = NULL WHERE user_id = $1", [req.user.sub]);
  return res.json({ success: true });
}

// POST /storage/cv  — upload candidate CV (private)
async function uploadCv(req, res) {
  if (!req.file) return res.status(400).json({ error: "File required" });

  const allowed = [".pdf", ".doc", ".docx"];
  const extension = ext(req.file.originalname);
  if (!allowed.includes(extension)) {
    return res.status(400).json({ error: "Only PDF, DOC and DOCX are accepted" });
  }

  const key = `${req.user.sub}/${uuidv4()}${extension}`;
  await new Upload({
    client: s3,
    params: {
      Bucket: config.s3.bucketCvs,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    },
  }).done();

  await pool.query(
    "UPDATE candidates SET cv_url = $1, cv_file_name = $2 WHERE user_id = $3",
    [key, req.file.originalname, req.user.sub]
  );

  return res.json({ cv_url: key, cv_file_name: req.file.originalname });
}

// DELETE /storage/cv
async function deleteCv(req, res) {
  const { rows } = await pool.query(
    "SELECT cv_url FROM candidates WHERE user_id = $1",
    [req.user.sub]
  );
  const key = rows[0]?.cv_url;
  if (key) {
    await s3
      .send(new DeleteObjectCommand({ Bucket: config.s3.bucketCvs, Key: key }))
      .catch(() => {});
  }
  await pool.query(
    "UPDATE candidates SET cv_url = NULL, cv_file_name = NULL WHERE user_id = $1",
    [req.user.sub]
  );
  return res.json({ success: true });
}

// GET /storage/cv/:candidateId  — presigned download URL (candidate own + unlocked employers)
async function downloadCv(req, res) {
  const { candidateId } = req.params;
  const userId = req.user.sub;

  const { rows: candRows } = await pool.query(
    "SELECT user_id, cv_url FROM candidates WHERE id = $1",
    [candidateId]
  );
  if (!candRows[0] || !candRows[0].cv_url) {
    return res.status(404).json({ error: "CV not found" });
  }

  const isOwner = candRows[0].user_id === userId;
  if (!isOwner) {
    const { rows: unlockRows } = await pool.query(
      `SELECT 1 FROM unlocks u
       JOIN employers e ON e.id = u.employer_id
       WHERE u.candidate_id = $1 AND e.user_id = $2`,
      [candidateId, userId]
    );
    if (!unlockRows[0]) return res.status(403).json({ error: "Unlock required to download CV" });
  }

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: config.s3.bucketCvs, Key: candRows[0].cv_url }),
    { expiresIn: 300 }
  );

  return res.json({ url });
}

// POST /storage/logo  — upload employer logo
async function uploadLogo(req, res) {
  if (!req.file) return res.status(400).json({ error: "File required" });

  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const extension = ext(req.file.originalname);
  if (!allowed.includes(extension)) {
    return res.status(400).json({ error: "Only JPEG, PNG and WebP are accepted" });
  }

  const key = `${req.user.sub}/${uuidv4()}${extension}`;
  await new Upload({
    client: s3,
    params: {
      Bucket: config.s3.bucketLogos,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    },
  }).done();

  const logoUrl = config.s3.endpoint
    ? `${config.s3.endpoint}/${config.s3.bucketLogos}/${key}`
    : `https://${config.s3.bucketLogos}.s3.${config.s3.region}.amazonaws.com/${key}`;

  await pool.query("UPDATE employers SET logo_url = $1 WHERE user_id = $2", [
    logoUrl,
    req.user.sub,
  ]);

  return res.json({ logo_url: logoUrl });
}

module.exports = { uploadPhoto, deletePhoto, uploadCv, deleteCv, downloadCv, uploadLogo };
