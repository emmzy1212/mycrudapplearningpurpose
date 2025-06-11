import Post from '../models/postModel.js';

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res) => {
  try {
    const { title, datetime, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const newPost = await Post.create({ title, datetime, body });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res) => {
  try {
    const { title, datetime, body } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title || post.title;
    post.datetime = datetime || post.datetime;
    post.body = body || post.body;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// import Post from '../models/postModel.js';

// export const getAllPosts = async (req, res) => {
//   const posts = await Post.find().sort({ _id: -1 });
//   res.json(posts);
// };

// export const getPostById = async (req, res) => {
//   const post = await Post.findById(req.params.id);
//   if (!post) return res.status(404).json({ message: 'Post not found' });
//   res.json(post);
// };

// export const createPost = async (req, res) => {
//   const { title, datetime, body } = req.body;
//   if (!title || !body) return res.status(400).json({ message: 'Missing fields' });

//   const post = new Post({ title, datetime, body });
//   const saved = await post.save();
//   res.status(201).json(saved);
// };

// export const updatePost = async (req, res) => {
//   const { title, datetime, body } = req.body;
//   const post = await Post.findById(req.params.id);
//   if (!post) return res.status(404).json({ message: 'Post not found' });

//   post.title = title;
//   post.datetime = datetime;
//   post.body = body;
//   const updated = await post.save();
//   res.json(updated);
// };

// export const deletePost = async (req, res) => {
//   // Find the post by the MongoDB _id passed in the URL parameters
//   const post = await Post.findById(req.params.id);

//   // If no post is found, return a 404 Not Found response
//   if (!post) return res.status(404).json({ message: 'Post not found' });

//   // Delete the post from the database
//   await post.deleteOne();

//   // Return a 204 No Content response to indicate successful deletion
//   res.status(204).end();
// };





// i want my above controller to be perfect as the below 
