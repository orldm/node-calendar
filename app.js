import config from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./api/routes/userRoutes";
import eventRoutes from "./api/routes/eventRoutes";
import authRoutes from "./api/routes/authRoutes";

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/", authRoutes);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to this API.",
  })
);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
