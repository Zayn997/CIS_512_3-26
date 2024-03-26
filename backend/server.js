require("dotenv").config();
console.log("API Key:", process.env.OPENAI_API_KEY);

const express = require("express");
const routes = require("./routes");
const app = express();
app.use(express.json());
// Use the routes defined in routes.js
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
