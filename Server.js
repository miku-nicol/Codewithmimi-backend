const express = require("express");
const dotenv = require ("dotenv");
const connectDB = require("./Database/db");
const cors = require("cors");
const { contactRouter } = require("./src/modules/contact/contact.routes");
const { projectRouter } = require("./src/modules/project/project.routes");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
app.get("/", (req,res)=>{
    res.end("JOUNERY OF CODEWITHMIMI");
})

app.use("/api/contact", contactRouter);
app.use("/api/project", projectRouter);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

connectDB();

const PORT= process.env.PORT;
app.listen(PORT, ()=>{
    console.log (`server iss running on http://localhost:${PORT}`);
});