import React from 'react';

function Home(props) {
    return (
        
        <div className='home'>
            <h1>Home</h1>
            <ul className="insights">
            <li>
                <i className='bx bx-calendar-check'></i>
                <span className="info">
                    <h3>1,074</h3>
                    <p>Paid Order</p>
                </span>
            </li>
            <li>
                <i className='bx bx-show-alt'></i>
                <span className="info">
                    <h3>3,944</h3>
                    <p>Site Visit</p>
                </span>
            </li>
            <li>
                <i className='bx bx-line-chart'></i>
                <span className="info">
                    <h3>14,721</h3>
                    <p>Searches</p>
                </span>
            </li>
            <li>
                <i className='bx bx-dollar-circle'></i>
                <span className="info">
                    <h3>$6,742</h3>
                    <p>Total Sales</p>
                </span>
            </li>
        </ul>
        </div>
    );
}

export default Home;