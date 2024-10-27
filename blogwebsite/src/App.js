import React, { useState } from 'react';
import BlogForm from './BlogForm';
import BlogList from './BlogList';
import './App.css';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);

  const addBlog = (newBlog) => {
    setBlogs([...blogs, { id: Date.now(), ...newBlog }]);
  };

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
    setEditBlog(null);
  };

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return (
    <div  style={{textAlign:'center'}} >
      <h1>Your Blog</h1>
      <p>Total Blog: {blogs.length}</p>
      <BlogForm onAddBlog={addBlog} onUpdateBlog={updateBlog} editBlog={editBlog} />
      <hr/>
      <BlogList blogs={blogs} onEdit={setEditBlog} onDelete={deleteBlog} />
    </div>
  );
}

export default App;
