import React from 'react';
import Insights from './Insights';
import Orders from './Order';

function AdminDashboard(props) {
    return (
        <main>
        <div className="header">
            <div className="left">
                <h1>Dashboard</h1>
                <ul className="breadcrumb">
                    <li><a href="#">Analytics</a></li>
                    <li><a href="#" className="active">Shop</a></li>
                </ul>
            </div>
            <a href="#" className="report">
                <i className='bx bx-cloud-download'></i>
                <span>Download CSV</span>
            </a>
        </div>

        <Insights />
        <Orders />
    </main>
    );
}

export default AdminDashboard;