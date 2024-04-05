// index.js

import express from "express";
import routes from "../api/routes/routes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8800;

app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
