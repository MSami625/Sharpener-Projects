import React from 'react';
import BlogItem from './BlogItem';

function BlogList({ blogs, onEdit, onDelete }) {
  return (
    <div style={{display:'flex', flexWrap:'wrap', gap:'10px',  alignItems:'center', justifyContent:'flex-start' }}>
      {blogs.map((blog) => (
        <BlogItem
          key={blog.id}
          blog={blog}
          onEdit={() => onEdit(blog)}
          onDelete={() => onDelete(blog.id)}
        />
      ))}
    </div>
  );
}

export default BlogList;
