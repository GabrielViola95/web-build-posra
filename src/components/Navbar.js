import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import './Navbar.css';
import { useAuth, isAuth } from '../context/authContext';

const Navbar = () => {
    const { user } = useAuth();

    const [showNavbar, setShowNavbar] = useState(false);

    const [scrollShowNavbar, setScrollShowNavbar] = useState(true);
    const controlNavbar = () => {
        if(window.scrollY > 100) {
            setScrollShowNavbar(false)
        }
        else {
            setScrollShowNavbar(true)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar)
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        };
    }, []);
    

    const handleNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const closeMobileMenu = () => {
        setShowNavbar(!showNavbar)
    };


    return (
        <nav className={scrollShowNavbar === true ? 'navbar_main' : 'navbar_main scroll-top'}>
            <div className="navbar-container">

                <Link to="/" className='navbar-logo'>
                    <img src={logo} alt="logo guidano posracionalismo" /> <span className='title-page'> <small>el</small> Posracionalista </span>
                </Link>

                <div className="menu-icon">
                    <i onClick={handleNavbar} className={showNavbar ?'fas fa-bars' : 'fas fa-times'} ></i>
                </div>
                <ul className={showNavbar ? 'nav-menu' : 'nav-menu active'}>
                    <li onClick={closeMobileMenu} className="nav-item">
                        <Link className='nav-links' to="/"  >Inicio </Link>
                    </li>
                    <li onClick={closeMobileMenu} className="nav-item">
                        <Link className='nav-links' to="/info" >Biblioteca</Link>
                    </li >
                    <li onClick={closeMobileMenu} className="nav-item"><Link className='nav-links' to="/foro" >Foro</Link></li>
                    {!user && <li onClick={closeMobileMenu} className="nav-item"><Link className='nav-links' to="/login" >Ingresar</Link></li>}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar