const app = require("./app");

const PORT = process.env.PORT || 3000;
const pool = require("./config/db");

require("./jobs/expiry.job");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});