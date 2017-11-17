const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
    name: {
      type: String,
      required: [true, "Please give your room a name"]
    },
    photoUrl: {
      type: String,
      required: [true, "Include a photo."]
    },
    description: {type: String},
    owner: {
      type: Schema.Types.ObjectId,
      requireed: true
    }
  },
  //2nd argument ->SETTINGS object
  {
    // automatically add "createdAt" and "updatedAt" Data fields
    timestamps: true
  }
);


const RoomModel = mongoose.model("Room", roomSchema);

module.exports = RoomModel;
