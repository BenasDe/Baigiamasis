import Post from "../models/post.js";
import User from "../models/User.js";

// CREATE 
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save(); // save to database

    const post = await Post.find(); // grab ALL post from database not just the one we just created
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// READ 
export const getFeedPosts = async (req, res) => { // this is for the posts feed part
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE -> we are grabing POST information, next we are grabing if he is liked or not , we ether add a like or delete it
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // checking in likes if user id exsist
// this is the same as doing post.likes[userId] but we use get() because it's a Map
    if (isLiked) {
      post.likes.delete(userId); // if button is press and post is liked already, then delete the like
    } else {
      post.likes.set(userId, true); // add the like
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id, // updating specific ID
      { likes: post.likes }, // list of likes
      { new: true }
    );

    res.status(200).json(updatedPost); // passing updated post so we can update the front end
  
  } catch (err) {
    res.status(404).json({ message: err.message }); 
  }
  
};

// Delete POST 
  
export const deletePost = async (req, res) => { 
  try {
    const { id } = req.params;
    await Post.findByIdAndRemove(id);
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}
// Insert Comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, firstName, lastName, text } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      firstName,
      lastName,
      text,
    };

    post.comments.push(newComment);

    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};