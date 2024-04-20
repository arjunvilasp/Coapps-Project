import React, { useContext, useState } from 'react'
import './Header.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const Header = () => {
    const { authToken, logout, location } = useContext(AuthContext); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [authenticated,setAuthenticated] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const handleLogout = () => {
        logout();
        navigate('/');
    };
  return (
    <div className='header-container'>
        <Link className='logo link' to={'/'}>
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081986.png" alt='Logo'/>
            <h2>DailyMart</h2>
        </Link>
        <div className='search-container'>
            <div className='search-box'>
                <button className='category'>
                  <ArrowDropDownIcon/>
                  Categories
                </button>
                <input type='text' placeholder='Search here..'/>
                <button>
                    <SearchIcon/>
                </button>
            </div>
            <div className='location'>
                <LocationOnOutlinedIcon/>
                {
                    location ?
                    location :
                <p>Location</p>
                }
            </div>
        </div>
        <div className='header-options-container'>
                    <Link to={'/cart'} className='link'>
                <div className='option'>
                    <ShoppingCartOutlinedIcon/>
                    <p>Cart</p>
                </div>
                    </Link>
                    <div className='option' onClick={toggleDropdown}>
                    <PersonOutlineOutlinedIcon/>
                    <p>Account</p>
                    <ArrowDropDownIcon/>
                        <div className='dropdown-content'>
                        <Link to='/profile' className='link'>Profile</Link>
                            {
                                authToken ? 
                            
                            <button onClick={handleLogout}>Logout</button>
                            :
                            <Link to='/login' className='link'>Login</Link>
                        }
                        </div>
                </div>
            </div>
    </div>
  )
}

export default Header