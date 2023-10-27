import mongoose from "mongoose";
import blockModel from "../../models/blockModel.js";
import floorModel from "../../models/floorModel.js";
import roomModel from "../../models/roomModel.js";
import storeModel from "../../models/storeModel.js";
import userModel from "../../models/userModel.js";
import { body } from "express-validator";
const editRoleValidationSchema = [
  body("fullName").optional(),
  body("staffId").custom(async (staffId) => {
    const isValidStaff = await userModel.findOne({ _id: staffId });
    if (!isValidStaff) {
      throw new Error("Staff is not valid");
    }
  }),
  body("stores").optional({ values: "falsy" }),
  body("role").optional({ values: "falsy" }).matches(/^(locationAdmin|storeAdmin|staff)$/i),
  // .isArray()
  // .custom((storeIds) => {
  //   storeIds?.map(async (storeId) => {
  //     const isValidStore = await storeModel.findOne({
  //       _id: new mongoose.Types.ObjectId(storeId),
  //     });
  //     if (!isValidStore) {
  //       throw new Error("Store is not valid");
  //     }
  //     return true;
  //   });
  // }),
  body("rooms").optional({ values: "falsy" }),
  // .custom((roomIds) => {
  //   roomIds?.map(async (roomId) => {
  //     const isValidRoom = await roomModel.findOne({ _id: roomId });
  //     if (!isValidRoom) {
  //       throw new Error("Room is not Valid");
  //     }
  //   });
  // }),
  body("blocks").optional({ values: "falsy" }),
  // .custom((blockIds) => {
  //   blockIds?.map(async (blockId) => {
  //     const isValidBlock = await blockModel.findOne({ _id: blockId });
  //     if (!isValidBlock) {
  //       throw new Error("Block is not valid");
  //     }
  //   });
  // }),
  body("floors").optional({ values: "falsy" }),
  // .custom((floorIds) => {
  //   floorIds?.map(async (floorId) => {
  //     const isValidFloor = await floorModel.findOne({ _id: floorId });
  //     if (!isValidFloor) {
  //       throw new Error("Block is not valid");
  //     }
  //   });
  // }),
];

export { editRoleValidationSchema };
