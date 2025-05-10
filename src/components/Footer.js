import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">
      <h2>Questions? Email <a href="mailto:rexgaming998@gmail.com">Caffinity998@gmail.com</a></h2>
      


      <button className="language-btn">
        English <img src="./down-arrow-regular-24.png" alt="Arrow" />
      </button>

      <p className="footer-note">© 2025 Coffee Recommender. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
