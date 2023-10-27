import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./config/firebase-config.js";
import "./models/floorModel.js";
import "./models/roomModel.js";
import "./models/storeModel.js";
import "./models/blockModel.js";
import "./models/propertyModel.js";
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use(
  "/createGuest",
  (await import("./routes/guests/createGuest.js")).default
);

app.use(
  "/getAllGuests",
  (await import("./routes/guests/getAllGuests.js")).default
);

app.use(
  "/getGuestById",
  (await import("./routes/guests/getGuestById.js")).default
);

app.use(
  "/updateGuestById",
  (await import("./routes/guests/updateGuestById.js")).default
);

app.use(
  "/deleteGuestById",
  (await import("./routes/guests/deleteGuestById.js")).default
);

app.use(
  "/createPropertyAdmin",
  (await import("./routes/roles/createPropertyAdmin.js")).default
);

app.use("/createRole", (await import("./routes/roles/createRole.js")).default);
app.use("/editRole", (await import("./routes/roles/editRole.js")).default);

app.use("/getAllUsers", (await import("./routes/roles/getAllUser.js")).default);

app.use(
  "/getUserById",
  (await import("./routes/roles/getUserById.js")).default
);

app.use(
  "/updateRoleById",
  (await import("./routes/roles/editRole.js")).default
);

app.use(
  "/deleteRoleById",
  (await import("./routes/roles/deleteRoleById.js")).default
);

app.use("/createUser", (await import("./routes/users/createUser.js")).default);

app.use(
  "/getUserById",
  (await import("./routes/users/getUserById.js")).default
);

app.use(
  "/updateUserById",
  (await import("./routes/users/updateUserById.js")).default
);

app.use(
  "/deleteUserById",
  (await import("./routes/users/deleteUserById.js")).default
);
app.use(
  "/getUserDetails",
  (await import("./routes/users/getUserDetails.js")).default
);

/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Users Service" });
});
