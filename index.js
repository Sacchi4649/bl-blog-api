require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDb = require("./database");
const Router = require("./routes");
const errorHandling = require("./middlewares/errorHandling");

app.use(express.json());

connectDb();

app.use(express.urlencoded({ extended: true }));
app.use("/", Router);
app.use(errorHandling);

app.get("/", (_, res) => res.send("Blog API response success!"));

app.listen(port, () => console.log(`Server is runing on port ${port}`));
