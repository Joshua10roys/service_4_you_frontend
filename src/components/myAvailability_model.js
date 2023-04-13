import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../assets/url.js';
import MuiSpinner from './spinner.js';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Box, Typography, Modal, Radio, RadioGroup, FormControlLabel, FormLabel,
    Chip, Button, Divider, Grid, Paper, Stack, Tooltip
} from '@mui/material';


const style1 = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};


export default function MyAvailability({ open, setOpen, user, alertSnackbar }) {

    const [date, setDate] = useState({});
    const [timing, setTiming] = useState("");
    const [dateList, setDateList] = useState([]);
    const [loading, setLoading] = useState(false);

    // model close handler fn
    const handleClose = () => {
        setOpen(false);
    };

    // date delete handler fn
    const handleDelete = (_id) => {

        setLoading(true);
        axios({
            method: "delete",
            url: `${SERVER_URL}/delete/bookingDate/${_id}`,
            headers: { "auth_token": user.token },
        })
            .then(res => {
                alertSnackbar("success", res.data.msg, true);
            })
            .catch(err => {
                alertSnackbar("error", err.response.data.msg, true);
            })
            .finally(() => {
                getDates();
            })
    };

    // adding date handler
    const handleAdd = () => {

        if (Object.keys(date).length === 0 || timing === "") {

            alertSnackbar("error", "Please select date & time", true);

        } else if (new Date(date) < new Date()) {

            alertSnackbar("warning", "Select date from tomorrow", true);

        } else {

            setLoading(true);

            let newDate = new Date(date);

            let dd = newDate.getDate();
            let mm = newDate.getMonth();
            let yy = newDate.getFullYear();

            axios({
                method: "POST",
                url: `${SERVER_URL}/post/date/${user._id}`,
                headers: {
                    "Content-Type": "application/json",
                    "auth_token": user.token
                },
                data: { date: new Date(yy, mm, dd), time: timing }
            })
                .then(res => {
                    alertSnackbar("success", res.data.msg, true);
                })
                .catch(err => {
                    alertSnackbar("error", err.response.data.msg, true);
                })
                .finally(() => {
                    setDate({});
                    setTiming("");
                    getDates();
                })
        }
    }

    // getting dates fn
    const getDates = () => {

        setLoading(true);
        axios.get(`${SERVER_URL}/get/date/${user._id}`)
            .then(res => {
                setDateList(res.data.dateList);
            })
            .catch(err => {
                console.log(err.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    // loading data on model open
    useEffect(() => {
        if (open) { getDates() }
    }, [open]);


    return (
        <Modal open={open} onClose={handleClose} sx={style1} >

            {loading
                ?
                // spinner
                <Paper elevation={20} sx={{ width: 600, p: { xs: 1, md: 2 }, m: { xs: 1, md: 2 } }}>
                    <MuiSpinner />
                </Paper>
                :
                <Paper elevation={20} sx={{ maxWidth: 600, p: { xs: 1, md: 2 }, m: { xs: 1, md: 2 } }}>
                    <Box sx={{ border: "1px solid lightgray", p: { xs: 1, md: 2 } }}>

                        <Typography variant='body2' pb={1}>My Dates:</Typography>

                        <Grid container justifyContent="space-evenly" rowSpacing={1} columnSpacing={1}>

                            {/* dates chips */}
                            {dateList.map(item => (
                                item.bookingStatus
                                    ?
                                    // if booked
                                    <Grid item key={item._id}>
                                        <Tooltip title="Date Booked" placement="top" followCursor arrow>
                                            <Chip label={new Date(item.date).toDateString() + " " + item.time} variant="outlined" color="success" />
                                        </Tooltip>
                                    </Grid>
                                    :
                                    // for not booked
                                    <Grid item key={item._id}>
                                        <Tooltip title="Not Booked" placement="top" followCursor arrow>
                                            <Chip label={new Date(item.date).toDateString() + " " + item.time} variant="outlined"
                                                color="default" onDelete={() => handleDelete(item._id)} />
                                        </Tooltip>
                                    </Grid>
                            ))}

                        </Grid>

                    </Box>

                    <Box sx={{ border: "1px solid lightgray", p: { xs: 1, md: 2 } }}>
                        <Grid container>

                            {/* date picker */}
                            <Grid item xs={12} sm={"auto"}>
                                <Stack direction="row">
                                    <FormLabel sx={{ pt: 1, pr: 1 }}>Date:</FormLabel>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']} sx={{ pt: 0, pr: 1 }}>
                                            <DatePicker
                                                format='DD/MM/YYYY'
                                                disablePast
                                                onChange={(newValue) => setDate(newValue)}
                                                slotProps={{ textField: { size: 'small' } }}
                                                sx={{ width: 80 }} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Stack>
                            </Grid>

                            <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                            {/* timing radio */}
                            <Grid item xs={12} sm={"auto"}>
                                <RadioGroup row value={timing} onChange={(event) => setTiming(event.target.value)}>

                                    <FormLabel sx={{ ml: 1, mt: 1, pr: 1 }}>Timing:</FormLabel>
                                    <FormControlLabel
                                        value="FN"
                                        label="FN"
                                        control={<Radio size="small" sx={{ pr: 0.5 }} />}
                                    />
                                    <FormControlLabel
                                        value="AN"
                                        label="AN"
                                        control={<Radio size="small" sx={{ pr: 0.5 }} />}
                                    />

                                </RadioGroup>
                            </Grid>

                            <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                            {/* button */}
                            <Grid item xs={12} sm={"auto"}>

                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={handleAdd}
                                    sx={{ textTransform: "capitalize", fontWeight: "bold", ml: 2 }}>
                                    Add
                                </Button>

                            </Grid>

                        </Grid>
                    </Box>
                </Paper>
            }

        </Modal>
    );
}