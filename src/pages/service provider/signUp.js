import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { SERVER_URL } from "../../assets/url.js";
import BackdropWithSpinner from "../../components/backdrop.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    TextField, Typography, Box, Paper, InputLabel, FormHelperText, Divider, Container,
    InputAdornment, IconButton, FormControl, Button, Grid, OutlinedInput
} from "@mui/material";


function ServiceProviderSignUp({ alertSnackbar }) {

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
            city: "",
            district: "",
            state: "",
            serviceType: "",
            about: "",
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
            city: yup
                .string()
                .required("required"),
            district: yup
                .string()
                .required("required"),
            state: yup
                .string()
                .required("required"),
            serviceType: yup
                .string()
                .required("required"),
            about: yup
                .string()
                .required("required"),
        }),

        onSubmit: async (value) => {

            const { confirmPassword, ...data } = value;
            setFetching(true);

            axios({
                method: "POST",
                url: `${SERVER_URL}/serviceProvider/signUp`,
                headers: { "Content-Type": "application/json", },
                data: { ...data },
            })
                .then((res) => {
                    alertSnackbar("success", res.data.msg, true);
                    navigate("/serviceProvider/signIn");
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

            <Box className="background2">
                <Container maxWidth={"lg"}>
                    <Paper elevation={24} sx={{ p: { xs: 2, md: 4 }, m: { xs: 2, md: 4 }, borderRadius: 2 }}>

                        {/* title */}
                        <Box>
                            <Typography variant="h5" fontFamily="Lobster" align="center" pb="20px" >
                                Service Provider Sign Up
                            </Typography>
                            <Divider />
                        </Box>

                        <form onSubmit={formik.handleSubmit} style={{ paddingTop: "25px" }}>

                            <Grid container columnSpacing={3} rowSpacing={3} >

                                {/* username */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="username"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="Username *"
                                        placeholder="email"
                                        value={formik.values.username}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.username && formik.touched.username
                                            ? formik.errors.username : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* password */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <FormControl
                                        fullWidth
                                        size="medium"
                                    >
                                        <InputLabel htmlFor="password">Password *</InputLabel>
                                        <OutlinedInput
                                            id="password"
                                            label="Password *"
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
                                            } />
                                        <FormHelperText sx={{ color: "red" }}>
                                            {formik.errors.password && formik.touched.password
                                                ? formik.errors.password : ""}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* confirm password */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="confirmPassword"
                                        type="password"
                                        size="medium"
                                        variant="outlined"
                                        label="Confirm Password *"
                                        value={formik.values.confirmPassword}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.confirmPassword && formik.touched.confirmPassword
                                            ? formik.errors.confirmPassword : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* first name */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="firstName"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="First Name *"
                                        value={formik.values.firstName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.firstName && formik.touched.firstName
                                            ? formik.errors.firstName : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* last name */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="lastName"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="Last Name"
                                        value={formik.values.lastName}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.lastName && formik.touched.lastName
                                            ? formik.errors.lastName : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* contact number */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="contactNumber"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="Contact Number *"
                                        value={formik.values.contactNumber}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.contactNumber && formik.touched.contactNumber
                                            ? formik.errors.contactNumber : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* state */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="state"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="State *"
                                        value={formik.values.state}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.state && formik.touched.state
                                            ? formik.errors.state : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* district */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="district"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="District *"
                                        value={formik.values.district}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.district && formik.touched.district
                                            ? formik.errors.district : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* city */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="city"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="City *"
                                        value={formik.values.city}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.city && formik.touched.city
                                            ? formik.errors.city : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* service type */}
                                <Grid item xs={12} md={6} lg={4}>
                                    <TextField
                                        fullWidth
                                        id="serviceType"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        label="Service Type *"
                                        value={formik.values.serviceType}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.serviceType && formik.touched.serviceType
                                            ? formik.errors.serviceType : ""}
                                    </FormHelperText>
                                </Grid>

                                {/* about */}
                                <Grid item xs={12} md={12} lg={8}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        id="about"
                                        type="text"
                                        size="medium"
                                        variant="outlined"
                                        rows={2}
                                        label="About *"
                                        placeholder="Describe shortly about yourself and your service"
                                        value={formik.values.about}
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}

                                    />
                                    <FormHelperText sx={{ color: "red" }}>
                                        {formik.errors.about && formik.touched.about
                                            ? formik.errors.about : ""}
                                    </FormHelperText>
                                </Grid>

                            </Grid>

                            <Box>

                                {/* sign up button */}
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: 4, mb: 2, width: "120px", textTransform: "capitalize" }}
                                    onClick={formik.handleSubmit}>
                                    sign up
                                </Button>

                                {/* sign in button */}
                                <Button
                                    variant="contained"
                                    sx={{ ml: 2, mt: 4, mb: 2, width: "120px", textTransform: "capitalize" }}
                                    onClick={() => navigate("/serviceProvider/signIn")}>
                                    sign in
                                </Button>

                                {/* cancel button */}
                                <Button
                                    variant="outlined"
                                    sx={{ ml: 2, mt: 4, mb: 2, width: "120px", textTransform: "capitalize" }}
                                    onClick={() => navigate("/")}>
                                    cancel
                                </Button>

                            </Box>

                        </form>

                    </Paper>
                </Container>
            </Box>
        </>
    )
}

export default ServiceProviderSignUp;