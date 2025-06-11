import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../controllers/postsController.js';

const router = express.Router();

router.get('/posts', getAllPosts);
router.post('/createposts', createPost);
router.get('/posts/:id', getPostById);
router.put('/updateposts/:id', updatePost);
router.delete('/delete/:id', deletePost);

export default router;

