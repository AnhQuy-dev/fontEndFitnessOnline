// import React, { createContext, useState, useEffect } from 'react';

// export const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
//     const [user, setUser] = useState(null);
//     const [notificationMessage, setNotificationMessage] = useState('');
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         // fetchUserData();
//     }, []);

//     function handleStoreUser(tokenData) {
//         try {
//             // Store token
//             localStorage.setItem("tokenData", JSON.stringify(tokenData));
//             setNotificationMessage('Login successful!');
//         } catch (error) {
//             console.error("Error storing user data:", error);
//             setNotificationMessage('Login failed. Please try again.');
//         }
//     }

//     function handleLogout() {
//         localStorage.removeItem("tokenData");
//         setUser(null);
//         setIsLoggedIn(false);
//         setNotificationMessage('Logged out successfully!');
//     }

//     const clearNotification = () => setNotificationMessage('');
//     const refreshUserData = () => {
//     };

//     let value = {
//         user,
//         setUser,
//         isLoggedIn,
//         setIsLoggedIn,
//         handleStoreUser,
//         handleLogout,
//         notificationMessage,
//         setNotificationMessage,
//         clearNotification,
//         refreshUserData,
//         isLoading
//     };

//     return (
//         <DataContext.Provider value={value}>
//             {children}
//         </DataContext.Provider>
//     );
// };