import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "./assets/url.js";
// components
import BackdropWithSpinner from "./components/backdrop.js";
import MuiSnackbar from "./components/snackbar.js";
import Navbar from "./components/navbar.js";
import MyAvailability from "./components/myAvailability_model.js";
// pages
import HomePage from "./pages/homePage.js";
import Services from "./pages/services.js";
import MyBooking from "./pages/customer/myBooking.js";
import MyAppoinments from "./pages/service provider/myAppoinment.js";
// customer
import SignIn from "./pages/customer/signIn.js";
import SignUp from "./pages/customer/signUp.js";
import ForgotPassword from "./pages/customer/forgotPass.js";
import ResetPassword from "./pages/customer/resetPass.js";
// service provider
import ServiceProviderSignIn from "./pages/service provider/signIn.js";
import ServiceProviderSignUp from "./pages/service provider/signUp.js";
import ServiceProviderForgotPassword from "./pages/service provider/forgotPass.js";
import ServiceProviderResetPassword from "./pages/service provider/resetPass.js";


function App() {

  // navigation hook
  const navigate = useNavigate();

  // useState hooks
  const [fetching, setFetching] = useState(false);
  const [user, setUser] = useState({ auth: false, type: "", _id: "", token: "" });
  const [snackbar, setSnackbar] = useState({ severity: "info", message: "", open: false });
  const [open, setOpen] = useState(false);

  // fn for alert snackbar
  const alertSnackbar = (severity, message, open) => {
    setSnackbar({ severity: severity, message: message, open: open });
  }

  // fn for sign in
  const setSignIn = (status, type, _id, token) => {
    setUser({ auth: status, type: type, _id: _id, token: token });
  }

  // fn for sign out
  const setSignOut = (message) => {
    setUser({ auth: false, type: "", _id: "", token: "" });
    localStorage.clear();
    alertSnackbar("success", message, true);
    navigate("/home");
  }

  // useEffect hooks to check token validity
  useEffect(() => {

    if (localStorage.getItem("auth_token")) {

      setFetching(true);
      axios.get(`${SERVER_URL}/get/checkUser/${localStorage.getItem("auth_token")}`)
        .then(res => {
          setSignIn(true, res.data.userType, res.data._id, localStorage.getItem("auth_token"));
        })
        .catch(err => {
          setSignOut("Session Expired");
        })
        .finally(() => {
          setFetching(false);
        })
    }

  }, [])

  // customer routes
  const CustomerRoutes = () => {
    return (
      user.type !== "" && <>{(user.auth && user.type === "customer") ? <Outlet /> : <Navigate to='/home' />}</>
    )
  }

  // service provider routes
  const ServiceProviderRoutes = () => {
    return (
      user.type !== "" && <>{(user.auth && user.type === "service provider") ? <Outlet /> : <Navigate to='/home' />}</>
    )
  }


  return (
    <>

      {fetching && <BackdropWithSpinner />}
      <MuiSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
      <MyAvailability open={open} setOpen={setOpen} user={user} alertSnackbar={alertSnackbar} />

      <Routes>

        {/* authentication system routes */}
        <Route path="/customer/signIn" element={<SignIn alertSnackbar={alertSnackbar} setSignIn={setSignIn} />} />
        <Route path="/customer/signUp" element={<SignUp alertSnackbar={alertSnackbar} />} />
        <Route path="/customer/forgotPassword" element={<ForgotPassword alertSnackbar={alertSnackbar} />} />
        <Route path="/customer/resetPassword/:randomToken" element={<ResetPassword alertSnackbar={alertSnackbar} />} />
        <Route path="/serviceProvider/signIn" element={<ServiceProviderSignIn alertSnackbar={alertSnackbar} setSignIn={setSignIn} />} />
        <Route path="/serviceProvider/signUp" element={<ServiceProviderSignUp alertSnackbar={alertSnackbar} />} />
        <Route path="/serviceProvider/forgotPassword" element={<ServiceProviderForgotPassword alertSnackbar={alertSnackbar} />} />
        <Route path="/serviceProvider/resetPassword/:randomToken" element={<ServiceProviderResetPassword alertSnackbar={alertSnackbar} />} />

        <Route element={<><Navbar user={user} setOpen={setOpen} setSignOut={setSignOut} /><Outlet /></>}>

          {/* public routes */}
          <Route path="*" element={<Navigate replace to={'/home'} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/allServices" element={<Services user={user} alertSnackbar={alertSnackbar} />} />

          {/* customer router */}
          <Route element={<CustomerRoutes />}>
            <Route path="/myBookings" element={<MyBooking user={user} alertSnackbar={alertSnackbar} />} />
          </Route>

          {/* service provider routes */}
          <Route element={<ServiceProviderRoutes />}>
            <Route path="/myAppoinments" element={<MyAppoinments user={user} alertSnackbar={alertSnackbar} />} />
          </Route>

        </Route>

      </Routes>

    </>
  );

}

export default App;