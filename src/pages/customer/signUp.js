import logo from "../../assets/Pictures/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { SERVER_URL } from "../../assets/url.js";
import BackdropWithSpinner from "../../components/backdrop.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    TextField, Typography, Box, Paper, InputLabel, FormHelperText, Divider,
    InputAdornment, IconButton, Input, FormControl, Button, Grid
} from "@mui/material";


function SignUp({ alertSnackbar }) {

    // hooks
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false)

    // password visibility
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => { event.preventDefault() };

    // formik hook
    const formik = useFormik({

        initialValues: {
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            contactNumber: "",
        },

        validationSchema: yup.object({
            username: yup
                .string()
                .required("required")
                .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "looks invalid"),
            password: yup
                .string()
                .required("required")
                .min(6, "too short")
                .max(12, "too large"),
            confirmPassword: yup
                .string()
                .required("required")
                .oneOf([yup.ref("password"), null], "password doesn't match"),
            firstName: yup
                .string()
                .required("required"),
            lastName: yup
                .string(),
            contactNumber: yup
                .string()
                .required("required"),
        }),

        onSubmit: async (value) => {

            const { confirmPassword, ...data } = value;
            setFetching(true);

            axios({
                method: "POST",
                url: `${SERVER_URL}/customer/signUp`,
                headers: { "Content-Type": "application/json", },
                data: { ...data },
            })
                .then((res) => {
                    alertSnackbar("success", res.data.msg, true);
                    navigate("/customer/signIn");
                })
                .catch((err) => {
                    alertSnackbar("error", err.response.data.msg, true);
                })
                .finally(() => {
                    formik.resetForm();
                    setFetching(false);
                })
        }
    })

    return (
        <>
            {fetching && <BackdropWithSpinner />}

            <Box className="background">
                <Paper elevation={24} sx={{ p: { xs: 2, md: 4 }, m: { xs: 2, md: 4 }, maxWidth: { xs: "400px", md: "650px" }, borderRadius: 2 }}>

                    {/* logo and title */}
                    <Box>
                        <img className="img" alt="logo" src={logo} />
                        <Divider />
                        <Typography variant="h5" fontFamily="Lobster" align="center" pt="10px" >
                            Customer Sign Up
                        </Typography>
                    </Box>

                    <form onSubmit={formik.handleSubmit} >

                        <Grid container columnSpacing={4} >
                            <Grid item xs={12} md={6}>

                                {/* username */}
                                <Box>
                                    <TextField
                                        fullWidth
                                        id="username"
                                        type="text"
                                        size="small"
                                        variant="standard"
                                        label="Username *"
                                        placeholder="email"
                                        value={formik.values.username}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        sx={{ mt: 1 }}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.username && formik.touched.username
                                            ? formik.errors.username : ""}
                                    </FormHelperText>
                                </Box>

                                {/* password */}
                                <FormControl
                                    fullWidth
                                    size="small"
                                    variant="standard"
                                    sx={{ mt: 1 }}
                                >
                                    <InputLabel htmlFor="password">Password *</InputLabel>
                                    <Input
                                        fullWidth
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formik.values.password}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.password && formik.touched.password
                                            ? formik.errors.password : ""}
                                    </FormHelperText>
                                </FormControl>

                                {/* confirm password */}
                                <Box>
                                    <TextField
                                        fullWidth
                                        id="confirmPassword"
                                        type="password"
                                        size="small"
                                        variant="standard"
                                        label="Confirm Password *"
                                        value={formik.values.confirmPassword}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        sx={{ mt: 1 }}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.confirmPassword && formik.touched.confirmPassword
                                            ? formik.errors.confirmPassword : ""}
                                    </FormHelperText>
                                </Box>

                            </Grid>
                            <Grid item xs={12} md={6}>

                                {/* first name */}
                                <Box>
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        type="text"
                                        size="small"
                                        variant="standard"
                                        label="First Name *"
                                        value={formik.values.firstName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        sx={{ mt: 1 }}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.firstName && formik.touched.firstName
                                            ? formik.errors.firstName : ""}
                                    </FormHelperText>
                                </Box>

                                {/* last name */}
                                <Box>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        type="text"
                                        size="small"
                                        variant="standard"
                                        label="Last Name"
                                        value={formik.values.lastName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        sx={{ mt: 1 }}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.lastName && formik.touched.lastName
                                            ? formik.errors.lastName : ""}
                                    </FormHelperText>
                                </Box>


                                {/* contact number */}
                                <Box>
                                    <TextField
                                        fullWidth
                                        id="contactNumber"
                                        type="text"
                                        size="small"
                                        variant="standard"
                                        label="Contact Number *"
                                        value={formik.values.contactNumber}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        sx={{ mt: 1 }}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.contactNumber && formik.touched.contactNumber
                                            ? formik.errors.contactNumber : ""}
                                    </FormHelperText>
                                </Box>

                            </Grid>
                        </Grid>

                        {/* sign up button */}
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{ mt: 4, mb: 2, width: "120px", textTransform: "capitalize" }}
                            onClick={formik.handleSubmit}>
                            sign up
                        </Button>

                        {/* cancel button */}
                        <Button
                            variant="outlined"
                            sx={{ ml: 2, mt: 4, mb: 2, width: "120px", textTransform: "capitalize" }}
                            onClick={() => navigate("/")}>
                            cancel
                        </Button>

                    </form>

                </Paper>
            </Box>
        </>
    )
}

export default SignUp;