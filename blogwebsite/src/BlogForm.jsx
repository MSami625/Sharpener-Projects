import React, { useState, useEffect, useRef } from 'react';

function BlogForm({ onAddBlog, onUpdateBlog, editBlog }) {
  const [blogData, setBlogData] = useState({ imageUrl: '', title: '', description: '' });
  const [errors, setErrors] = useState({});
  const titleRef = useRef();

  useEffect(() => {
    if (editBlog) {
      setBlogData(editBlog);
      titleRef.current.focus();
    } else {
      setBlogData({ imageUrl: '', title: '', description: '' });
    }
  }, [editBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prevData => ({ ...prevData, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!blogData.imageUrl) {
      errors.imageUrl = 'Image URL is required';
    } else if (!isValidURL(blogData.imageUrl)) {
      errors.imageUrl = 'Enter a valid URL';
    }

    if (!blogData.title) {
      errors.title = 'Title is required';
    }
    
    if (!blogData.description) {
      errors.description = 'Description is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (editBlog) {
        onUpdateBlog({ ...blogData });
      } else {
        onAddBlog(blogData);
      }
      setBlogData({ imageUrl: '', title: '', description: '' });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <input
        type="text"
        name="imageUrl"
        placeholder="Image URL"
        value={blogData.imageUrl}
        onChange={handleChange}
        className="input-field"
      />
      {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}

      <input
        type="text"
        name="title"
        placeholder="Title"
        ref={titleRef}
        value={blogData.title}
        onChange={handleChange}
        className="input-field"
      />
      {errors.title && <p className="error">{errors.title}</p>}

      <textarea
        name="description"
        placeholder="Blog Description"
        value={blogData.description}
        onChange={handleChange}
        className="input-field"
      ></textarea>
      {errors.description && <p className="error">{errors.description}</p>}

      <button type="submit" className="submit-button">
        {editBlog ? 'Update Blog' : 'Post Blog'}
      </button>
    </form>
  );
}

export default BlogForm;
