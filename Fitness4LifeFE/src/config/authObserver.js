/**
 * Authentication Observer Service
 * Implements the observer pattern to notify components of authentication state changes
 */

class AuthObserver {
    constructor() {
      this.observers = [];
      
      // Add storage event listener to sync across tabs
      window.addEventListener('storage', (e) => {
        if (e.key === 'tokenData') {
          this.notifyObservers();
        }
      });
    }
  
    // Add component callback to observer list
    subscribe(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Observer callback must be a function');
      }
      this.observers.push(callback);
      return () => this.unsubscribe(callback); // Return function to unsubscribe
    }
  
    // Remove component callback from observer list
    unsubscribe(callback) {
      this.observers = this.observers.filter(obs => obs !== callback);
    }
  
    // Notify all observers of auth state change
    notifyObservers() {
      this.observers.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in auth observer callback:', error);
        }
      });
    }
  
    // Call when user logs in
    notifyLogin(userData) {
      // Store previous token data to detect changes
      const prevTokenData = localStorage.getItem('tokenData');
      
      if (userData) {
        localStorage.setItem('tokenData', JSON.stringify(userData));
      }
      
      // Only notify if data actually changed
      const newTokenData = localStorage.getItem('tokenData');
      if (prevTokenData !== newTokenData) {
        this.notifyObservers();
      }
    }
  
    // Call when user logs out
    notifyLogout() {
      const hadToken = localStorage.getItem('tokenData') !== null;
      localStorage.removeItem('tokenData');
      
      // Only notify if there was actually a token before
      if (hadToken) {
        this.notifyObservers();
      }
    }
  }
  
  // Create singleton instance
  const authObserver = new AuthObserver();
  export default authObserver;