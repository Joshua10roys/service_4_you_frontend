import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { SERVER_URL } from "../../assets/url.js";
import BackdropWithSpinner from "../../components/backdrop";
import axios from "axios";
import { TextField, Typography, Box, Paper, FormHelperText, Button } from "@mui/material";


function ForgotPassword({ alertSnackbar }) {

    // hooks
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false);

    // formik
    const formik = useFormik({

        initialValues: {
            username: "",
        },

        validationSchema: yup.object({
            username: yup
                .string()
                .required("required")
                .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "not a valid id"),
        }),

        onSubmit: (value) => {

            setFetching(true);

            axios({
                method: "POST",
                url: `${SERVER_URL}/customer/forgotPassword`,
                headers: { "Content-Type": "application/json" },
                data: { ...value },
            })
                .then((res) => {
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
                <Paper elevation={24} sx={{ m: { xs: 2, md: 4 }, p: 4, borderRadius: 2, maxWidth: "350px" }}>

                    {/* title & description */}
                    <Box>
                        <Typography variant="h5" fontFamily="Lobster" align="center" pt="10px" >
                            Forgot Password
                        </Typography>

                        <Typography variant="body2" color="text.secondary" align="center" fontStyle="italic" sx={{ mt: 2 }}>
                            Enter the registered username and hit proceed,<br />
                            Password reset link will be sent to the registered email address.
                        </Typography>
                    </Box>

                    {/* form */}
                    <form onSubmit={formik.handleSubmit}>

                        {/* username */}
                        <Box>
                            <TextField
                                fullWidth
                                autoFocus
                                id="username"
                                type="text"
                                size="small"
                                variant="standard"
                                label="Username *"
                                placeholder="email"
                                value={formik.values.username}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                sx={{ mt: 2 }}
                            />
                            <FormHelperText sx={{ color: "red" }}>
                                {formik.errors.username && formik.touched.username
                                    ? formik.errors.username : ""}
                            </FormHelperText>
                        </Box>

                        {/* button submit */}
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mt: 3, mb: 2, textTransform: "capitalize" }}
                            onClick={formik.handleSubmit}>
                            Proceed
                        </Button>

                    </form>

                </Paper>
            </Box>
        </>
    )
}

export default ForgotPassword;