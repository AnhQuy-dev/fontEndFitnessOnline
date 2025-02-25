import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/css/blogDetail.css';
import CommentsSection from './CommentsSection';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    // Fetch current blog details
    setLoading(true);
    axios.get(`http://localhost:8082/api/blogs/${id}`)
      .then((response) => {
        setBlog(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blog details:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    // Fetch other blogs (exclude the current one)
    axios.get("http://localhost:8082/api/blogs")
      .then((response) => {
        const allBlogs = response.data.data.filter((b) => b.id != id);
        const shuffledBlogs = allBlogs.sort(() => 0.5 - Math.random());
        const randomBlogs = shuffledBlogs.slice(0, 4);
        setBlogs(randomBlogs);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
      });
  }, [id]);

  const formatDateTime = (createdAt) => {
    const date = new Date(createdAt[0], createdAt[1] - 1, createdAt[2], createdAt[3], createdAt[4], createdAt[5]);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div>
    <div id="blogdetail-container">
      {/* Blog detail on the left side */}
      <div className="blog-detail" style={{ flex: 8, paddingLeft: '30px', paddingRight: '20px', marginRight: '50px' }}>
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <h2>{blog.title}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <p><strong>Category:</strong> {blog.category}</p>
                <p><strong>Tags:</strong> {blog.tags}</p>
              </div>
              <p style={{ alignSelf: 'flex-end' }}><strong>Created At:</strong> {formatDateTime(blog.createdAt)}</p>
            </div>
            <div>
              {blog.content.split('\n').map((paragraph, index) => (
                <React.Fragment key={index}>
                  <p style={{ fontSize: '1.2em', lineHeight: '1.6' }}>{paragraph}</p>
                  {blog.thumbnailUrl && blog.thumbnailUrl[index]?.imageUrl && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                      <img
                        src={blog.thumbnailUrl[index].imageUrl}
                        alt={`Related image ${index}`}
                        style={{ maxWidth: '80%', height: 'auto', borderRadius: '8px' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Related blog links on the right side */}
      <div className="related-blogs" style={{ flex: 3 }}>
        <h3 style ={{ borderBottom: '2px solid #F9690E', width: '144px', paddingBottom: '5px' }}>Other Blogs</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {blogs.map((relatedBlog) => (
            <li key={relatedBlog.id} style={{ borderBottom: '0.4px solid #007bff', width: '320px', paddingBottom: '5px', display: 'flex', marginBottom: '15px' }}>
              <Link className='blog-list-item' to={`/blog/${relatedBlog.id}`} style={{ textDecoration: 'none', color: '#007bff', display: 'flex', width: '100%' }}>
                <div style={{ marginRight: '10px', width: '80px', height: '80px', overflow: 'hidden' }}>
                  <img
                    src={relatedBlog.thumbnailUrl[0].imageUrl}
                    alt={relatedBlog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold' }}>{relatedBlog.title}</span>
                  <span style={{ fontSize: '0.9em', color: '#555' }}>
                    {formatDateTime(relatedBlog.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <h3 style={{ borderBottom: '2px solid #F9690E', width: '144px', paddingBottom: '5px' }}>News Blogs</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {blogs.map((relatedBlog) => (
            <li key={relatedBlog.id} style={{ borderBottom: '0.4px solid #007bff', width: '320px', paddingBottom: '5px', display: 'flex', marginBottom: '15px' }}>
              <Link className='blog-list-item' to={`/blog/${relatedBlog.id}`} style={{ textDecoration: 'none', color: '#007bff', display: 'flex', width: '100%' }}>
                <div style={{ marginRight: '10px', width: '80px', height: '80px', overflow: 'hidden' }}>
                  <img
                    src={relatedBlog.thumbnailUrl[0].imageUrl}
                    alt={relatedBlog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold' }}>{relatedBlog.title}</span>
                  <span style={{ fontSize: '0.9em', color: '#555' }}>
                    {formatDateTime(relatedBlog.createdAt)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div> 
    </div>
    <div>
      <CommentsSection blogId={id} />
    </div>
    </div>
  );
};

export default BlogDetail;