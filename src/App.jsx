import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from './api/Api';

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();

  // useEffect to fetch posts from the backend when the app loads
  useEffect(() => {
    const fetchposts = async () => {
      try {
        const response = await api.get('/posts'); // make GET request to backend
        setPosts(response.data); // set the posts to local state
        console.log(response); // log the full response
      } catch (err) {
        // Error handling
        if (err.response) {
          // Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    };
    fetchposts(); // call the fetch function
  }, []);

  // useEffect to filter search results every time posts or search changes
  useEffect(() => {
    const filteredResults = posts.filter((post) =>
      post.body.toLowerCase().includes(search.toLowerCase()) ||
      post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults.reverse()); // reverse to show latest first
  }, [posts, search]);

  // This is the function called on form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the page from refreshing
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');

    // i will use this to pass the form input as props to the newpost component here in this code 
    // No need to add id manually because MongoDB assigns _id automatically
    const newPost = { title: postTitle, datetime, body: postBody };

    try {
      // this part '/createposts', is the end point and here  (newPost)  is going to pass the post to the newpost
      const response = await api.post('/createposts', newPost); // POST request to backend
      const allPosts = [...posts, response.data]; // add new post to existing posts
      setPosts(allPosts); // update local state

      // After successfully submitting a new post (as indicated by the api.post call), these lines:
      // Clear the form fields for the title and body.
      // Reset the input fields on the screen so they're empty and ready for a new post.
      setPostTitle('');
      setPostBody('');
      navigate('/'); // redirect to home
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  // update function
  // We pass this function to the EditPost component frontend using props, and we pass the posts there so we can see the post we want to edit.
  // Function to handle editing an existing post
  const handleEdit = async (id) => {
    // Format the current date and time for the updated post
    // this creates an object with the datetime value (which you formatted on the frontend) when the post was updated 
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');

    // Create the updated post object with new title and body from form inputs
    // const updatedPost = { id, title: editTitle, datetime, body: editBody };
    // This line: sends that entire object, including datetime, to your backend via a PUT request.
    const updatedPost = {
      title: editTitle,      // New title from the edit form input
      datetime,              // Current date and time
      body: editBody         // New body/content from the edit form input
    };

    try {
      // Send a PUT request to update the post in the backend using the post's ID
      const response = await api.put(`/updateposts/${id}`, updatedPost);

      // Update the posts state function with the edited post
      setPosts(
        posts.map(post =>
          // Check if this is the post we just edited by comparing its MongoDB _id
          post._id === id
            ? { ...response.data } // If match, replace with updated post
            : post // Else, keep the existing post
        )
      );

       

      // Clear the form fields after editing
      setEditTitle('');
      setEditBody('');

      // Redirect the user back to the homepage
      navigate('/');
    } catch (err) {
      // Log any error that occurs during the request
      console.log(`Error: ${err.message}`);
    }
  };

  // we pass this to the postpage component cus that's where we need the delete function
  // we don't need response for delete method, we just want to await api called delete, and i will put a template literal (`/delete/${id}`) for the end of the url, and then the id of the post we want to delete.
  const handleDelete = async (id) => {
    try {
      // Send DELETE request to backend API using the post's _id
      await api.delete(`/delete/${id}`);

      // Filter out the deleted post from the local posts list
      // post._id this is where we add the id matching how our id is stored in the database
      const postsList = posts.filter(post => post._id !== id);

      // Update the setstate function with the new filtered list
      setPosts(postsList); // Update the UI with the new list

      // Navigate to home page or posts list
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />

        <Route path="/post" element={
          <NewPost
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />
        } />
        
        <Route path="/edit/:id" element={
          <EditPost
            posts={posts}
            handleEdit={handleEdit}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editBody={editBody}
            setEditBody={setEditBody}
          />
        } />
        <Route path="/post/:id" element={
          <PostPage posts={posts} handleDelete={handleDelete} />
        } />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;



// import Header from './Header';
// import Nav from './Nav';
// import Footer from './Footer';
// import Home from './Home';
// import NewPost from './NewPost';
// import PostPage from './PostPage';
// import EditPost from './EditPost';
// import About from './About';
// import Missing from './Missing';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { format } from 'date-fns';
// import api from './api/Api';

// function App() {
//   const [posts, setPosts] = useState([]);
//   const [search, setSearch] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [postTitle, setPostTitle] = useState('');
//   const [postBody, setPostBody] = useState('');
//   const [editTitle, setEditTitle] = useState('');
//   const [editBody, setEditBody] = useState('');
//   const navigate = useNavigate();


//   useEffect(( ) => {

//     const fetchposts = async () => {
//       try {
//         const response = await api.get('/posts');
//         setPosts(response.data);
//         console.log(response);
//       } catch (err) {
//         if (err.response) {
//           // Not in the 200 response range
//           console.log(err.response.data);
//           console.log(err.response.status);
//           console.log(err.response.headers);
//         } else {
//           console.log(`Error: ${err.message}`);
//         }
//       }
//     }
//     fetchposts();
//   }, []
//   );


//   useEffect(() => {
//     const filteredResults = posts.filter((post) =>
//       post.body.toLowerCase().includes(search.toLowerCase()) ||
//       post.title.toLowerCase().includes(search.toLowerCase())
//     );
//     setSearchResults(filteredResults.reverse());
//   }, [posts, search]);

//   // This is the function called on form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // prevent the page from refreshing
//     const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
//     const datetime = format(new Date(), 'MMMM dd, yyyy pp');
//     // i will use this to pass the form input as props to the newpost component here in this code 
//     const newPost = { id, title: postTitle, datetime, body: postBody };
//     try {
//       // this part '/posts', is the end point and here  (newPost)  is going to pass the post to the newpost
//       const response =  await  api.post('/createposts', newPost);
//       const allPosts = [...posts, response.data];
//       setPosts(allPosts);
//       // After successfully submitting a new post (as indicated by the api.post call), these lines:
//       // Clear the form fields for the title and body.
//       //  Reset the input fields on the screen so they're empty and ready for a new post.
//       setPostTitle('');
//       setPostBody('');
//       navigate('/');
//     } catch (err) {
//       console.log(`Error: ${err.message}`);
//     }
//   };


//   // ...................
// // update function
//   // We pass this function to the EditPost component frontend using props, and we pass the posts there so we can see the post we want to edit.
//   // Function to handle editing an existing post
// const handleEdit = async (id) => {
//   // Format the current date and time for the updated post
//    //  this creates an object with the datetime value (which you formatted on the frontend) when the post was created 
//   const datetime = format(new Date(), 'MMMM dd, yyyy pp');

//   // Create the updated post object with new title and body from form inputs
//   //  const updatedPost = { id, title: editTitle, datetime, body: editBody };
//   // This line:  sends that entire object, including datetime, to your backend via a PUT request.
//   const updatedPost = {
//     id,                          // ID of the post being edited
//     title: editTitle,           // New title from the edit form input
//     datetime,                   // Current date and time
//     body: editBody              // New body/content from the edit form input
//   };

//   try {
//     // Send a PUT request to update the post in the backend using the post's ID
//     const response = await api.put(`/posts/${id}`, updatedPost);

//     // Update the local state (posts array) with the edited post:
//     //     // Check if this is the post we just edited by comparing its ID
//     //   posts.map(post => post._id === id ? { ...response.data } : post)
//     // );

//     // Update the posts state function with the edited post
//     setPosts(
//    posts.map(post => 
//     // Check if this is the post we just edited by comparing its ID
//     post._id === id 
//       ? { 
//           // If it matches, replace it with the updated post from the server
//           ...response.data 
//         } 
//       : post // Otherwise, keep the post unchanged
//     )
//     );

//     // Clear the form fields after editing
//     setEditTitle('');
//     setEditBody('');

//     // Redirect the user back to the homepage
//     navigate('/');
//   } catch (err) {
//     // Log any error that occurs during the request
//     console.log(`Error: ${err.message}`);
//   }
// };



// // datetime is included in the request and sent to your backend automatically because you added it to the object you passed to api.put().


// // ........................
// // we pass this to the postpage component cus thats where we need the delete function
// // // we don't need response for delete method, we just want to await api called delete, and i will put a template literal (`/posts/${id}`)for the end of the url, and then the id of the post we want to delete. 
// const handleDelete = async (id) => {
//   try {
//     // Send DELETE request to backend API using the post's _id
//     await api.delete(`/delete/${id}`);

//     // Filter out the deleted post from the local posts list
//     // post._id this is where we add the id matching how our id is stored in the database
//     // In MongoDB, each document has _id, not id, but if i have the data somewhere and store it with id, it will work
//     const postsList = posts.filter(post => post._id !== id);

//     // This creates a new array excluding the post whose id matches the one we want to remove
//    // Update the setstate function with the new filtered list
//     // Update the UI with the new list
//     setPosts(postsList);

//     // Navigate to home page or posts list
//     navigate('/');
//   } catch (err) {
//     console.log(`Error: ${err.message}`);
//   }
// };



//   return (
//     <div className="App">
//       <Header title="React JS Blog" />
//       <Nav search={search} setSearch={setSearch} />
//       <Routes>
//         <Route path="/" element={<Home posts={searchResults} />} />
//         <Route path="/post" element={
//           <NewPost
//             handleSubmit={handleSubmit}
//             postTitle={postTitle}
//             setPostTitle={setPostTitle}
//             postBody={postBody}
//             setPostBody={setPostBody}
//           />
//         } />
//         <Route path="/edit/:id" element={
//           <EditPost
//             posts={posts}
//             handleEdit={handleEdit}
//             editTitle={editTitle}
//             setEditTitle={setEditTitle}
//             editBody={editBody}
//             setEditBody={setEditBody}
//           />
//         } />
//         <Route path="/post/:id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
//         <Route path="/about" element={<About />} />
//         <Route path="*" element={<Missing />} />
//       </Routes>
//       <Footer />
//     </div>
//   );
// }

// export default App;
