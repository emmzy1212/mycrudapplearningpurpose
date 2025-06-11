import { useParams, Link } from 'react-router-dom';

const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams(); // Get the post ID from the URL

  // Ensure both sides are strings before comparing
  const post = posts.find(post => String(post._id) === String(id));

  // Optional debug logs
  console.log("URL ID:", id);
  console.log("Post IDs:", posts.map(p => p._id));
  console.log("Matched Post:", post);

  // If posts hasn't loaded yet (e.g. initial render)
  if (!posts.length) {
    return (
      <main className="PostPage">
        <p>Loading post...</p>
      </main>
    );
  }

  return (
    <main className="PostPage">
      {post ? (
        <article className="post">
          <h2>{post.title}</h2>
          <p className="postDate">{post.datetime}</p>
          <p className="postBody">{post.body}</p>

          <button
            className="deleteButton"
            onClick={() => handleDelete(post._id)}
          >
            Delete
          </button>

          <Link to={`/edit/${post._id}`}>
            <button className="editButton">Edit Post</button>
          </Link>
        </article>
      ) : (
        <section>
          <h2>Post Not Found</h2>
          <p>Sorry, the post you're looking for doesn't exist.</p>
          <Link to="/">Visit Our Homepage</Link>
        </section>
      )}
    </main>
  );
};

export default PostPage;
