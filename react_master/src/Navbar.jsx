import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
 

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
     
      <ul style={styles.navLinks}>
        
        
          <>
          <li><Link to="/login" style={styles.link}>Login </Link></li>
            <Link to="/company" style={styles.link}>Company</Link>
            <li><Link to="/add-employee" style={styles.link}>Add Employee</Link></li>
            <li><Link to="/add-department" style={styles.link}>Add department</Link></li>
            <Link to="/designations" style={styles.link}>Designations</Link>
            
            <li><button onClick={handleLogout} style={styles.button}>Logout</button></li>
          </>
        
       
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1f2937',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
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
