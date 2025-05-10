import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State to toggle the menu

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false); // Close menu when a link is clicked

  return (
    <nav>
      <h1 className="cof">Caffinity@</h1>
      <div className="menu-toggle" onClick={toggleMenu}>
        <i class="fas fa-bars" style={{color: "white"}}></i> {/* Hamburger Icon */}
      </div>
      <div className={`menu ${isOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/" className="navl" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/recipes" className="navl" onClick={closeMenu}>Recipes</Link></li>
          {user && <li><Link to="/recommendations" className="navl" onClick={closeMenu}>Recommendations</Link></li>}

          {user ? (
            <li><Link to="#" className="navl" onClick={() => { logout(); closeMenu(); }}>Logout</Link></li>
          ) : (
            <li><Link to="/login" className="navl" onClick={closeMenu}>Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
