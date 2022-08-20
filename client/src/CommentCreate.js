import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`http://posts.com/posts/${postId}/comments`, {
        content,
      });
    } catch (err) {
      console.log(err);
    }

    setContent('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <input
            value={content}
            className="form-control"
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
