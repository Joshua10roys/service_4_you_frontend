import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { SERVER_URL } from "../../assets/url.js";
import axios from "axios";
import BackdropWithSpinner from "../../components/backdrop";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Divider, Grid, Paper, Box, Typography, Toolbar, Button, Container,
    Stack, Autocomplete, TextField, Rating
} from "@mui/material";


function MyBooking({ user, alertSnackbar }) {

    // status options
    const statusOption = [
        { value: "", label: "All" },
        { value: "Booked", label: "Booked" },
        { value: "Completed", label: "Completed" },
        { value: "Canceled", label: "Canceled" }
    ];
    // for display progress
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    // for status autocomplete
    const [status, setStatus] = useState({ value: "", label: "All" });
    // for service type autocomplete
    const [service, setService] = useState({ value: "", label: "All" });
    const [serviceList, setServicesList] = useState([]);
    // for date picker
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs().add(7, "days"));
    // service list
    const [myBookingList, setMyBookingList] = useState([]);

    // useeffect to load service list
    useEffect(() => {
        getMyBooking();
    }, []);

    // to get my booking list
    const getMyBooking = () => {

        setFetching(true);
        // console.log(status);
        // console.log(fromDate, toDate,);
        // console.log(service);
        // console.log(user);
        axios({
            method: "GET",
            url: `${SERVER_URL}/get/myBookings/${user._id}?service=${service.value}&status=${status.value}&fromDate=${fromDate}&toDate=${toDate}`,
            headers: { "auth_token": user.token }
        })
            .then(res => {
                setMyBookingList(res.data.myBookingList);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setFetching(false)
            })
    }

    // to fetch available service from db
    const getServiceList = () => {
        setLoading(true);
        axios.get(`${SERVER_URL}/get/serviceList`)
            .then((res) => {
                addServiceList(res.data.serviceList)
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }

    // to add service list
    const addServiceList = async (service) => {
        let list = [];
        await service.map(e => list.push({ value: e, label: e }));
        setServicesList(list);
    }

    // filter clear handler
    const handleClear = () => {
        setStatus({ value: "", label: "All" });
        setService({ value: "", label: "All" });
        setFromDate(dayjs());
        setToDate(dayjs().add(7, "days"));
    }


    return (
        <>
            <Box sx={{ backgroundColor: 'whitesmoke', minHeight: "100vh" }}>

                {/* filter toolbar starts */}
                <Toolbar sx={{
                    position: "fixed", width: { md: "98%" }, top: { xs: 58, sm: 64 }, py: { xs: 2, md: 0 }, px: 1,
                    zIndex: 1000, backgroundColor: "rgb(220,192,165)"
                }}>
                    <Container maxWidth={"xl"} style={{ paddingLeft: 0, paddingRight: 0 }} >

                        <Grid container direction="row" justifyContent="flex-start" spacing={1} flexWrap={true} >

                            {/* text filter */}
                            <Grid item xs={12} sm={3} md={2} lg={"auto"}>
                                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: "15px", sm: "22px" }, pt: { xs: 0, sm: 1 } }}>
                                    Filters
                                </Typography>
                            </Grid>

                            {/* status */}
                            <Grid item xs={6} sm={4.5} md={2}>
                                <Box sx={{ pt: 1 }}>
                                    <Autocomplete
                                        fullWidth
                                        disablePortal
                                        size="small"
                                        id="service"
                                        clearIcon={null}
                                        disableClearable
                                        options={statusOption}
                                        getOptionLabel={statusOption => statusOption.label}
                                        value={status}
                                        onChange={(e, v) => setStatus(v)}
                                        isOptionEqualToValue={(opt, val) => true}
                                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                                        renderInput={(params) => <TextField {...params} label="Status" />}
                                    />
                                </Box>
                            </Grid>

                            {/* service */}
                            <Grid item xs={6} sm={4.5} md={2}>
                                <Box sx={{ pt: 1 }}>
                                    <Autocomplete
                                        disablePortal
                                        fullWidth
                                        size="small"
                                        id="service"
                                        clearIcon={null}
                                        disableClearable
                                        loading={loading}
                                        options={serviceList}
                                        getOptionLabel={serviceList => serviceList.label}
                                        value={service}
                                        onFocus={() => getServiceList()}
                                        onChange={(e, v) => setService(v)}
                                        isOptionEqualToValue={(opt, val) => true}
                                        sx={{ backgroundColor: "white", borderRadius: 1 }}
                                        renderInput={(params) => <TextField {...params} label="Service" />}
                                    />
                                </Box>
                            </Grid>

                            {/* from date */}
                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ overflowX: "hidden" }} >
                                        <DatePicker
                                            disableFuture
                                            format='DD/MM/YYYY'
                                            label="From Date"
                                            value={fromDate}
                                            onChange={(newValue) => setFromDate(newValue)}
                                            slotProps={{ textField: { size: 'small' } }}
                                            sx={{ backgroundColor: "white", borderRadius: 1 }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            {/* to date */}
                            <Grid item xs={6} sm={4} md={3} lg={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ overflowX: "hidden" }}>
                                        <DatePicker
                                            disablePast
                                            format='DD/MM/YYYY'
                                            label="To Date"
                                            value={toDate}
                                            onChange={(newValue) => setToDate(newValue)}
                                            slotProps={{ textField: { size: 'small' } }}
                                            sx={{ backgroundColor: "white", borderRadius: 1 }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>

                            {/* button apply */}
                            <Grid item xs={"auto"}>
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: "capitalize", mt: 1 }}
                                    onClick={getMyBooking} >
                                    Apply
                                </Button>
                            </Grid>

                            {/* button clear */}
                            <Grid item xs={"auto"} >
                                <Button
                                    variant="Outlined"
                                    onClick={handleClear}
                                    sx={{
                                        backgroundColor: "white", border: "1px solid skyblue",
                                        textTransform: "capitalize", mt: 1
                                    }}>
                                    Clear Filters
                                </Button>
                            </Grid>

                        </Grid>

                    </Container>
                </Toolbar>
                {/* filter toolbar ends */}

                {/* card services details */}
                {fetching
                    ?
                    // backdrop on loadiing
                    <BackdropWithSpinner />
                    :
                    myBookingList.length == 0
                        ?
                        // if no date to show
                        <Container sx={{ position: "relative", top: 128, zIndex: 900, p: 4 }} maxWidth={"xl"}>
                            <Paper sx={{ m: 2, p: 2 }}>
                                <Typography variant="h6" fontWeight="bold" align="center" >No Data Found</Typography>
                            </Paper>
                        </Container>
                        :
                        // card container
                        <Container sx={{ position: "relative", top: { xs: 270, sm: 200, md: 160, lg: 110 }, zIndex: 900, p: 4 }} maxWidth={"xl"}>
                            <Grid container justifyContent="space-evenly" spacing={4}>

                                {myBookingList.map(item => (
                                    <Grid item xs={12} sm={6} lg={4} key={item._id}>
                                        <Paper sx={{ p: 2 }}>

                                            {/* name with profile pic */}
                                            <Stack direction="column">

                                                <Typography align="center" fontFamily="Poppins" fontWeight="bold" variant="h6">
                                                    {item.serviceType}
                                                </Typography>
                                                <Typography variant="subtitle2" pl={1} pt={1}>
                                                    <b>Status:</b>{" " + item.workStatus}
                                                </Typography>
                                                <Typography fontFamily="Poppins" variant="body.1" pl={1} pb={1}>
                                                    <b>Agent Name:</b>{" " + item.serviceProviderId.firstName + " " + item.serviceProviderId.lastName}
                                                </Typography>

                                            </Stack>

                                            <Grid container direction="row">

                                                {/* booking id */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Typography variant="subtitle2" p={1}>Booking Id:<b>{" #" + item.bookingId}</b></Typography>
                                                </Grid>

                                                <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                                                {/* date */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Typography variant="subtitle2" p={1}>{new Date(item.date).toDateString()}</Typography>
                                                </Grid>

                                            </Grid >

                                        </Paper>
                                    </Grid>
                                ))}

                            </Grid>
                        </Container >
                }

            </Box >
        </>
    )
}

export default MyBooking;