import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ menuItems, onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredItems(
      term ? menuItems.filter((item) => item.label.toLowerCase().includes(term.toLowerCase())) : []
    );
  };

  const handleSuggestionClick = (path) => navigate(path);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredItems.length > 0) {
      navigate(filteredItems[0].path);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filteredItems.length > 0) {
      navigate(filteredItems[0].path);
    }
  };

  return (
    <nav>
      <i className="bx bx-menu" onClick={onToggleSidebar}></i>
      <form onSubmit={handleSubmit}>
        <div className="form-input">
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" type="submit">
            <i className="bx bx-search"></i>
          </button>
        </div>
        {filteredItems.length > 0 && (
          <ul className="search-suggestions">
            {filteredItems.map((item, index) => (
              <li key={index}>
                <a href="#" onClick={() => handleSuggestionClick(item.path)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </form>
      <input type="checkbox" id="theme-toggle" hidden />
      <label htmlFor="theme-toggle" className="theme-toggle"></label>
      <a href="#" className="notif">
        <i className="bx bx-bell"></i>
        <span className="count">12</span>
      </a>
      <a href="/user/profile" className="profile">
      </a>
    </nav>
  );
};

export default Navbar;
