import express from "express";
import router from "./routers/fileRoutes.js";
import cors from "cors";

const app = express();
export const folder = "C:/Users/Jonas/Downloads/files";

app.use(cors());
app.use("/print-wos", router);
app.use("/wos/file", express.static(folder));

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/print-wos/files`);
});
