import React from 'react';

function BlogItem({ blog, onEdit, onDelete }) {
  return (
    <div className="blog-item">
    <h2 className="blog-title">{blog.title}</h2>
    {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="blog-image" />}
    <p className="blog-description">{blog.description}</p>
    <button onClick={onEdit} className="edit-button">Edit Blog</button>
    <button onClick={onDelete} className="delete-button">Delete Blog</button>
  </div>
  );
}

export default BlogItem;
