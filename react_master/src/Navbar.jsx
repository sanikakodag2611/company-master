import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navLinks}>
        {!isLoggedIn ? (<>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
           <li><Link to="/add-employee" style={styles.link}>Add Employee</Link></li>
        </>
          
        ) : (
          <>
           
            <li><Link to="/add-department" style={styles.link}>Add Department</Link></li>
            <li><Link to="/designations" style={styles.link}>Designations</Link></li>
            <li><Link to="/company" style={styles.link}>Company</Link></li>
            <li><Link to="/upload" style={styles.link}>Upload File</Link></li>
            <li><Link to="/bar-chart" style={styles.link}>Bar Chart</Link></li>
            <li><Link to="/line-chart" style={styles.link}>Line Chart</Link></li>
            <li><Link to="/pie-chart" style={styles.link}>Pie Chart</Link></li>           
            <li><button onClick={handleLogout} style={styles.button}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1f2937',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

export default Navbar;
