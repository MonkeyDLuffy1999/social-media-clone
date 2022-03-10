const User = require("../model/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const req = require("express/lib/request");

//update a user

router.put("/:id", async (req, res) => {
  if (req.params.id === req.body.userId || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.json(err);
      }
    }
    try {
      const update = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account updated");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can only update your accoundt");
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const deleted = await User.findByIdAndDelete(req.body.userId);
      deleted && res.status(200).json("deleted");
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("user no found");
  }
});

//get a user
router.get("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const foundUser = await User.findById(req.body.userId);
      //this ignores the password and updatedAt fields
      const { password, updatedAt, ...other } = foundUser._doc;
      res.send(other);
    } catch (error) {
      res.status(400).json(error);
    }
  } else {
    res.send("user not founnd");
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const follower = await User.findById(req.body.userId);
      const followee = await User.findById(req.params.id);
      if (!followee.followers.includes(req.body.userId)) {
        await followee.updateOne({ $push: { followers: req.body.userId } });
        await follower.updateOne({ $push: { followings: req.params.id } });
        res.send("Followed");
      } else {
        res.send("already following");
      }
    } catch (error) {
      res.send(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const follower = await User.findById(req.body.userId);
      const followee = await User.findById(req.params.id);
      if (follower.followings.includes(req.params.id)) {
        await follower.updateOne({ $pull: { followings: req.params.id } });
        await followee.updateOne({ $pull: { followers: req.body.userId } });
        res.send("successfully unfollowed");
      } else {
        res.send("you dont follow this account");
      }
    } catch (error) {}
  } else {
    res.send("you cant unfollow yourself");
  }
});

module.exports = router;
