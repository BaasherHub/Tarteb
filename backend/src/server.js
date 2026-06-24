require("dotenv").config();
const app = require("./app");
const config = require("./config");

app.listen(config.port, () => {
  console.log(`[server] Tarteb API running on port ${config.port}`);
});
