import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when clicking main content on mobile
    const handleMainClick = () => {
        if (sidebarOpen) setSidebarOpen(false);
    };

    return (
        <div className={sidebarOpen ? 'sidebar-open' : ''}>
            <button
                className="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
            >
                <Menu size={28} />
            </button>


            <div className="dashboard-container">
                <Sidebar isOpen={sidebarOpen} />
                <main className="dashboard-content" onClick={handleMainClick}>
                    <Outlet />
                </main>
            </div>
        </div>

    );
};

export default DashboardLayout;
