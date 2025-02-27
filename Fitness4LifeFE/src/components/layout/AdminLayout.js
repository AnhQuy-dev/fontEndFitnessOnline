import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../admin/Sidebar';
import Navbar from '../admin/Navbar';
import '../../style/style.css';

function AdminLayout(props) {
  const [menuItems, setMenuItems] = useState([]);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // Add state for sidebar collapse

  const handleSetMenuItems = (items) => {
    setMenuItems(items);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prevState) => !prevState); // Toggle sidebar collapse state
  };

  return (
    <div>
      <Sidebar 
        setMenuItems={handleSetMenuItems} 
        isCollapsed={isSidebarCollapsed}  // Pass collapse state to Sidebar
      />
      <div className="content">
        <Navbar 
          menuItems={menuItems} 
          onToggleSidebar={toggleSidebar}  // Pass the toggle function to Navbar
        />
        <main>
          <Outlet /> {/* Child pages */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
