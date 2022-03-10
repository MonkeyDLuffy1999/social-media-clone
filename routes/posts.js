const router = require("express").Router();
const Post = require("../model/Post.js");
const User = require("../model/User.js");

//create a post
router.post("/", async (req, res) => {
  const post = new Post({
    userId: req.body.userId,
    desc: req.body.desc,
    img: req.body.img,
    likes: req.body.likes,
  });
  try {
    const newPost = await post.save();
    res.send("post success fully created");
  } catch (error) {
    res.send(error);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId == req.body.userId) {
    try {
      await Post.updateOne({ $set: req.body });
      res.send("succesfully updated a post");
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can only update your posts");
  }
});

//delete a post
router.delete("/", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post.userId == req.body.userId) {
    try {
      const post = await Post.deleteOne(req.body.postId);
      res.send("Post deleted, ID: " + req.body.postId);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send("You can only update your posts");
  }
});

//like/dislike a post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Liked a post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("disliked a post");
    }
  } catch (error) {
    res.send(error);
  }
});
 
//get a post
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).send(post);
    } catch (error) {
      res.send(err);
    }
  });
  

//get timeline post

router.get("/timeline/all", async (req, res) => {
    try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: currentUser._id});
 
        const friendsPost = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId});
            })            
        );
        res.send(userPosts.concat(...friendsPost));
    } catch (error) {
        res.send(error);
    }
    
})

module.exports = router;
