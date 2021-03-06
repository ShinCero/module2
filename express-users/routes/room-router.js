const express = require("express");
const RoomModel = require("../models/room-model");
const myUploader = require("../config/multer-setup");

const router = express.Router();


router.get("/rooms/new", (req, res, next) => {
  // redirect to log in if there is no logged in user
  if (req.user === undefined) {
    res.redirect("/login");
    return;
  }
  res.locals.bodyClass = "roomsCreate";
  res.render("room-views/room-form");
});


router.post("/rooms", myUploader.single, (req, res, next) => {
  // redirect to log in if there is no logged in user
  if (req.user === undefined) {
    res.redirect("/login");
    return;
  }
  console.log("Hello World!");
  const theRoom = new RoomModel({
    name: req.body.roomName,
    photoUrl: req.body.roomPhoto,
    description: req.body.roomDescription,
    // "req.user" is the logged in user's document (defined by passport)
    owner: req.user._id

  });
    if (req.file) {
      theRoom.set({ photoUrl: `/uploads/${req.file.filename}`});
    }

  theRoom.save()
  .then(() => {
    res.redirect("/my-rooms");
  })
  .catch((err) => {
    next(err);
  });
});


router.get("/my-rooms", (req, res, next) => {
  // redirect to log in if there is no logged in user
  if (req.user === undefined) {
    res.redirect("/login");
    return;
  }

  RoomModel
  // retrieve all rooms owned by the logged in user
  .find({ owner: req.user._id })
  .sort({ createdAt: -1 })
  .exec()
  .then((roomResults) => {
      res.locals.listOfRooms = roomResults;
      res.locals.bodyClass = "roomsList";
      res.render("room-views/room-list");
  })
  .catch((err) => {

  });
});


module.exports = router;
