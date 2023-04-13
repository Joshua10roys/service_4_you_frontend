import logo from "../../assets/Pictures/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../assets/url.js";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import BackdropWithSpinner from "../../components/backdrop.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    TextField, Typography, Box, Paper, InputLabel, FormHelperText, Divider,
    InputAdornment, IconButton, Input, FormControl, Button
} from "@mui/material";


function SignIn({ alertSnackbar, setSignIn }) {

    // hooks
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false);
    // password visibility
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => { event.preventDefault() };

    // formik hook
    const formik = useFormik({

        initialValues: {
            username: "",
            password: "",
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
        }),

        onSubmit: async (value) => {

            setFetching(true);

            axios({
                method: "POST",
                url: `${SERVER_URL}/customer/signIn`,
                headers: { "Content-Type": "application/json", },
                data: { ...value },
            })
                .then((res) => {
                    localStorage.setItem("auth_token", res.data.token);
                    setSignIn(true, res.data.userType, res.data._id, res.data.toke);
                    alertSnackbar("success", res.data.msg, true);
                    navigate("/");
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
                <Paper elevation={24} sx={{ p: 4, borderRadius: 2, width: "300px" }}>

                    {/* logo and title */}
                    <Box>
                        <img className="img" alt="logo" src={logo} />
                        <Divider />
                        <Typography variant="h5" fontFamily="Lobster" align="center" sx={{ pt: 2 }} >
                            Customer Sign In
                        </Typography>
                    </Box>

                    <form onSubmit={formik.handleSubmit}>

                        {/* username */}
                        <Box>
                            <TextField
                                fullWidth
                                id="username"
                                type="text"
                                size="small"
                                variant="standard"
                                label="Username"
                                placeholder="email"
                                value={formik.values.username}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                sx={{ mt: 1 }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                                {formik.errors.username && formik.touched.username ? formik.errors.username : ""}
                            </FormHelperText>
                        </Box>

                        {/* password */}
                        <Box>
                            <FormControl
                                fullWidth
                                size="small"
                                variant="standard"
                                sx={{ mt: 2 }}
                            >
                                <InputLabel htmlFor="password">Password</InputLabel>
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
                                    {formik.errors.password && formik.touched.password ? formik.errors.password : ""}
                                </FormHelperText>
                            </FormControl>
                        </Box>

                        {/* signIn button */}
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mt: 4, mb: 2, display: "block", textTransform: "capitalize" }}
                            onClick={formik.handleSubmit}>
                            Sign In
                        </Button>

                    </form>

                    {/* sign up */}
                    <Button
                        onClick={() => navigate("/customer/signUp")}
                        sx={{ textDecoration: "underline", textTransform: "capitalize", flexGrow: 1 }}>
                        Sign Up
                    </Button>

                    {/* forgot Password */}
                    <Button
                        onClick={() => navigate("/customer/forgotPassword")}
                        sx={{ textDecoration: "underline", textTransform: "capitalize", float: "right", color: "red" }}>
                        Forgot Password
                    </Button>

                </Paper>
            </Box>
        </>
    )
}

export default SignIn;