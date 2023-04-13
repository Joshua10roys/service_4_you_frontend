import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/Pictures/logo.png';
import { useNavigate } from 'react-router-dom';


function Navbar({ user, setOpen, setSignOut }) {

    const navigate = useNavigate();

    // for anchor on small screen
    const [anchorElNav, setAnchorElNav] = useState(null)
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };


    return (
        <>
            <AppBar position={"fixed"} elevation={5} sx={{ backgroundColor: "white" }}>
                <Container maxWidth={"xl"}>
                    <Toolbar disableGutters>

                        {/* logo & name */}
                        <img src={Logo} alt='logo' width={50} className="pointer" onClick={() => navigate('/home')} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            className="pointer"
                            onClick={() => navigate('/home')}
                            sx={{
                                ml: 1,
                                textDecoration: "none",
                                color: "black",
                                fontWeight: 700,
                                textAlign: 'left',
                                flexGrow: 1,
                            }}
                        >
                            Service 4 You
                        </Typography>

                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>

                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="black"
                                sx={{ backgroundColor: "whitesmoke" }}
                            >
                                <MenuIcon />
                            </IconButton>

                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/home");
                                        handleCloseNavMenu();
                                    }}>
                                    <Typography component="a" textAlign="center">Home</Typography>
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        navigate("/allServices");
                                        handleCloseNavMenu();
                                    }}>
                                    <Typography component="a" textAlign="center"> All Services</Typography>
                                </MenuItem>

                                {
                                    user.type === "customer"
                                        ?
                                        <MenuItem
                                            onClick={() => {
                                                navigate('/myBookings');
                                                handleCloseNavMenu();
                                            }}>
                                            <Typography component="a" textAlign="center"> My Bookings</Typography>
                                        </MenuItem>
                                        :
                                        ""
                                }
                                {
                                    user.type === "service provider"
                                        ?
                                        <MenuItem
                                            onClick={() => {
                                                setOpen(true);
                                                handleCloseNavMenu();
                                            }}>
                                            <Typography component="a" textAlign="center">My Availability</Typography>
                                        </MenuItem>
                                        :
                                        ""
                                }
                                {
                                    user.type === "service provider"
                                        ?
                                        <MenuItem
                                            onClick={() => {
                                                navigate('/myAppoinments');
                                                handleCloseNavMenu();
                                            }}>
                                            <Typography component="a" textAlign="center"> My Appointments</Typography>
                                        </MenuItem>
                                        :
                                        ""
                                }
                                {
                                    !user.auth
                                    &&
                                    <MenuItem
                                        onClick={() => {
                                            navigate('/customer/signIn');
                                            handleCloseNavMenu();
                                        }}>
                                        <Typography component="a" textAlign="center">Customer Sign In / Sign Up</Typography>
                                    </MenuItem>
                                }
                                {
                                    !user.auth
                                    &&
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/serviceProvider/signIn");
                                            handleCloseNavMenu();
                                        }}>
                                        <Typography component="a" textAlign="center">Service Provider Sign In / Sign-Up</Typography>
                                    </MenuItem>
                                }
                                {user.auth
                                    &&

                                    <MenuItem
                                        onClick={() => {
                                            setSignOut("Your Signed-Out");
                                            handleCloseNavMenu();
                                        }}>
                                        <Typography component="a" textAlign="center">Sign Out</Typography>
                                    </MenuItem>
                                }

                            </Menu>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                            <Button onClick={() => navigate("/home")}
                                sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                Home
                            </Button>

                            <Button onClick={() => navigate("/allServices")}
                                sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                All Services
                            </Button>
                            {
                                user.type === "customer"
                                    ?
                                    <Button
                                        onClick={() => navigate('/myBookings')}
                                        sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}
                                    >
                                        My Bookings
                                    </Button>
                                    :
                                    ""
                            }
                            {
                                user.type === "service provider"
                                    ?
                                    <>

                                        <Button onClick={() => setOpen(true)}
                                            sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                            My Availability
                                        </Button>

                                        <Button onClick={() => navigate('/myAppoinments')}
                                            sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                            My Appointments
                                        </Button>

                                    </>
                                    :
                                    ""
                            }
                            {
                                !user.auth
                                    ?
                                    <>
                                        <Button onClick={() => navigate('/customer/signIn')}
                                            sx={{ ml: 1, color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                            Customer Sign In / Sign Up
                                        </Button>

                                        <Button onClick={() => navigate("/serviceProvider/signIn")}
                                            sx={{ ml: 1, color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                            Service Provider Sign In / Sign-Up
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <Button onClick={() => setSignOut("Your Signed-Out")}
                                            sx={{ color: "black", textTransform: 'capitalize', fontWeight: 700 }}>
                                            Sign Out
                                        </Button>
                                    </>
                            }

                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

export default Navbar;