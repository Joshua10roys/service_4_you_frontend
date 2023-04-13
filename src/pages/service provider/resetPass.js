import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from "formik";
import axios from 'axios';
import { SERVER_URL } from '../../assets/url.js';
import BackdropWithSpinner from '../../components/backdrop.js';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    TextField, Typography, Box, Paper, InputLabel, FormHelperText,
    InputAdornment, IconButton, Input, FormControl, Button,
} from "@mui/material";


function ServiceProviderResetPassword({ alertSnackbar }) {

    const navigate = useNavigate();
    // random token from params
    const { randomToken } = useParams();
    // hooks
    const [fetching, setFetching] = useState(false);
    // password visibility
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => { event.preventDefault() };

    // formik
    const formik = useFormik({

        initialValues: {
            password: "",
            confirmPassword: "",
        },

        validationSchema: yup.object({
            password: yup
                .string()
                .required("required")
                .min(6, "too short")
                .max(12, "too large"),
            confirmPassword: yup
                .string()
                .required("required")
                .oneOf([yup.ref("password"), null], "password doesn't match"),
        }),

        onSubmit: (value) => {

            setFetching(true);
            const { password, ...rest } = value;

            axios({
                method: "POST",
                url: `${SERVER_URL}/serviceProvider/resetPassword/${randomToken}`,
                headers: { "Content-Type": "application/json" },
                data: { ...value },
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

            <Box className="background">
                <Paper elevation={24} sx={{ m: { xs: 2, md: 4 }, p: 4, borderRadius: 2, maxWidth: "350px" }}>

                    {/* title & description */}
                    <Box>
                        <Typography variant="h5" fontFamily="Lobster" align="center" pt="10px" >
                            Reset Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" fontStyle="italic" sx={{ mt: 2 }}>
                            Enter your new password
                        </Typography>
                    </Box>


                    {/* form */}
                    <form onSubmit={formik.handleSubmit}>

                        {/* password */}
                        <Box>
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
                        </Box>

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

                        {/* button submit */}
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{ mt: 4, mb: 2, textTransform: "capitalize" }}
                            onClick={formik.handleSubmit}>
                            Submit
                        </Button>

                    </form>

                </Paper>
            </Box>
        </>
    )
}

export default ServiceProviderResetPassword;