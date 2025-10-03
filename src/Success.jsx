import React, { useEffect } from 'react';
 import { Link, useNavigate } from 'react-router-dom';

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL parameters
   const urlParams = new URLSearchParams(window.location.search);
   const token = urlParams.get('token');
   if (token) {
     // Store token in localStorage
     localStorage.setItem('token', token);
     // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
     }, 2000);
  }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center', minWidth: '100vw' }}>
      <h1>Success!</h1>
      <p>You have successfully logged in.</p>
      <p>Redirecting to home page...</p>
      <br />
      <button>
        <Link to='/'>Go to Home</Link>
      </button>
     </div>
  );
}

 export default Success;