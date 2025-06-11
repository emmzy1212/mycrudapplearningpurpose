import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Update this if your backend URL changes
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Get all posts
export const fetchPosts = async () => {
  try {
    const response = await apiClient.get('/posts');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
    throw error;
  }
};

// Get post by ID
export const fetchPostById = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching post with ID ${id}:`, error.message);
    throw error;
  }
};

// Create new post (note the '/createposts' route)
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post('/createposts', postData);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
    throw error;
  }
};

// Update post by ID
export const updatePost = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/updateposts/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating post with ID ${id}:`, error.message);
    throw error;
  }
};

// Delete post by ID (note the '/delete/:id' route)
export const deletePost = async (id) => {
  try {
    await apiClient.delete(`/delete/${id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deleting post with ID ${id}:`, error.message);
    throw error;
  }
};

export default apiClient;
