const express = require("express");
const notificationModel = require("../models/notificationModel");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const headers = req.headers;
    const notifications = await notificationModel.find({_id: headers.notificationId}).sort({_id: -1}).limit(15);

    res.status(200).json({
        notifications: notifications[0].notificationContent,
    })
  } catch (e) {
    console.log(e);
    res.status(400).json({
      msg: "Something went wrong, please try again later",
    });
  }
});

module.exports = router;