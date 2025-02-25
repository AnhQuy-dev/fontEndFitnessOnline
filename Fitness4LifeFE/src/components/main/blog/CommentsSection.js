import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CommentsSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch comments for the current blog
    axios.get(`http://localhost:8082/api/blogs/blog/${blogId}/comment`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }, [blogId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();  // Ngăn chặn reload trang khi submit

    if (newComment.trim()) {
      setIsSubmitting(true);
      const commentData = {
        content: newComment,
        blogId,
        isPublished: true,
        userId: 2452, // Example user ID
        userName: 'John Doe', // Example user name
      };

      axios.post('http://localhost:8082/api/blogs/comment/create', commentData)
        .then((response) => {
          setNewComment('');
          setIsSubmitting(false);
          
          // Thêm bình luận mới vào danh sách bình luận hiện tại
          setComments((prevComments) => [
            ...prevComments,
            {
              ...commentData,
              id: response.data.id, // Giả sử API trả về id của bình luận mới
              createdAt: new Date(), // Thêm thời gian hiện tại
            },
          ]);
        })
        .catch((error) => {
          console.error('Error submitting comment:', error);
          setIsSubmitting(false);
        });
    }
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString(); // Format the date as needed
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.userName}</strong></p>
              <p>{comment.content} <span className="comment-time">({formatDate(comment.createdAt)})</span></p>
            </div>
          ))
        )}
      </div>

      <form className="comment-form" onSubmit={handleCommentSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          rows="4"
          style={{ flex: 1, marginRight: '8px' }}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
