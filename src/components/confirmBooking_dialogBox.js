import * as React from 'react';
import { useState, useEffect } from 'react';
import { SERVER_URL } from '../assets/url.js';
import axios from 'axios';
import MuiSpinner from './spinner.js';
import {
    Autocomplete, Divider, TextField, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Box
} from '@mui/material';


export default function ConfirmBooking({ showDialog, setShowDialog, user, alertSnackbar, serviceProvider }) {

    // for spinner
    const [loading, setLoading] = useState(false);
    // autocomplete date list
    const [dateList, setDateList] = useState([{ labelDate: "", date: "", time: "", _id: "" }]);
    // selected date and time
    const [dateTime, setDateTime] = useState("");
    // address
    const [address, setAddress] = useState("");

    // to load available date
    useEffect(() => {
        setDateTime("");
        setAddress("")
        if (showDialog) { getDates() }
    }, [showDialog])

    // to get service provider available date
    const getDates = () => {

        setLoading(true);
        axios.get(`${SERVER_URL}/get/date?serviceProvider=${serviceProvider._id}`)
            .then(res => {
                addDateList(res.data.dateList);
            })
            .catch(err => {
                console.log(err.message);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    // to format date 
    const addDateList = async (data) => {

        let dateList = [];
        await data.map(e => {
            let labelDate = new Date(e.date).toDateString() + " " + e.time;
            let date = e.date;
            let time = e.time;
            let _id = e._id
            dateList.push({ labelDate, date, time, _id });
        });
        setDateList(dateList);
    }

    // to book service
    const handleBooking = () => {

        if (dateTime === "" || address === "") {
            alertSnackbar("error", "Please Fill the Details", true);
        } else {

            setLoading(true);
            axios({
                method: "Patch",
                url: `${SERVER_URL}/patch/bookService`,
                headers: {
                    "Content-Type": "application/json",
                    "auth_token": user.token,
                },
                data: {
                    serviceProviderId: serviceProvider._id,
                    bookingId: dateTime._id,
                    customerId: user._id,
                    address: address,
                    type: serviceProvider.serviceType,
                }
            })
                .then(res => {
                    alertSnackbar("success", res.data.msg, true);
                })
                .catch(err => {
                    alertSnackbar("error", err.response.data.msg, true);
                    console.log(err.message);
                })
                .finally(() => {
                    setLoading(false);
                    handleClose();
                })
        }
    }

    // dialog box close handler
    const handleClose = () => {
        setShowDialog(false);
    };


    return (
        <Dialog open={showDialog} onClose={handleClose}>

            {loading
                ?
                // spinner
                <Box sx={{ p: 2, width: 450 }}>
                    <MuiSpinner />
                </Box>
                :
                <Box sx={{ p: 2, width: 450 }}>

                    {/* text */}
                    <DialogTitle sx={{ p: 1 }}>Confirm Booking</DialogTitle>

                    <Divider />
                    <DialogContent sx={{ p: 1 }}>

                        {/* date autocomplete */}
                        <Autocomplete
                            fullWidth
                            disablePortal
                            disableClearable
                            options={dateList}
                            getOptionLabel={dateList => dateList.labelDate}
                            isOptionEqualToValue={(opt, val) => opt === val}
                            onChange={(e, v) => setDateTime(v)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Date" />
                            )}
                            sx={{ my: 1 }}
                        />

                        {/* address box */}
                        <TextField
                            fullWidth
                            multiline
                            label="Address"
                            placeholder="enter your address"
                            rows={4}
                            sx={{ my: 1 }}
                            onChange={e => setAddress(e.target.value)}
                        />

                        {/* instruction text */}
                        <DialogContentText>
                            Select required date of your service and also fill your address in the given area above.
                        </DialogContentText>

                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ p: 1 }}>

                        {/* cancel button */}
                        <Button
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: "capitalize" }}
                            onClick={handleClose}>
                            Cancel
                        </Button>

                        {/* confirm booking button */}
                        <Button
                            size="small"
                            variant="contained"
                            onClick={handleBooking}
                            sx={{ textTransform: "capitalize" }}>
                            Confirm Booking
                        </Button>

                    </DialogActions>

                </Box>
            }

        </Dialog>
    );
}