import { useEffect, useState } from "react";
import { SERVER_URL } from "../assets/url.js";
import axios from "axios";
import profile from "../assets/Pictures/profile.JPG";
import BackdropWithSpinner from "../components/backdrop";
import ConfirmBooking from "../components/confirmBooking_dialogBox.js";
import {
    Divider, Grid, Paper, Box, Typography, Toolbar, Button, Container, Stack, Autocomplete, TextField, Rating
} from "@mui/material";


function Services({ user, alertSnackbar }) {

    // for display progress
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    // values for autocomplete
    const [service, setService] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [rating, setRating] = useState("");
    // list items for autocomplete
    const [serviceList, setServicesList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [ratingList, setRatingList] = useState(["5", "4+", "3+", "2+", "1+"]);
    // service list
    const [serviceProviderList, setServiceProviderList] = useState([]);
    // for dialog box
    const [showDialog, setShowDialog] = useState(false);
    const [serviceProvider, setServiceProvider] = useState({});

    // useeffect to load service list
    useEffect(() => {
        getServiceProviders();
    }, [])

    // to fetch service provider
    const getServiceProviders = () => {

        setFetching(true);

        axios.get(`${SERVER_URL}/get/serviceProviders?service=${service}&state=${state}&district=${district}&city=${city}&rating=${rating}`)
            .then(res => {
                setServiceProviderList(res.data.result);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setFetching(false))
    }

    // to fetch available service from db
    const getServiceList = () => {
        setLoading(true);
        axios.get(`${SERVER_URL}/get/serviceList`)
            .then((res) => { setServicesList(res.data.serviceList) })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }

    // to fetch available states from db
    const getStateList = () => {
        setLoading(true);
        axios.get(`${SERVER_URL}/get/stateList`)
            .then((res) => { setStateList(res.data.stateList) })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }

    // to fetch available district by state from db
    const getDistrictList = () => {
        if (state !== "") {
            setLoading(true);
            axios.get(`${SERVER_URL}/get/districtList/${state}`)
                .then((res) => { setDistrictList(res.data.districtList) })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false))
        }
    }

    // to fetch cities by district from db
    const getCityList = () => {
        if (district !== "") {
            setLoading(true);
            axios.get(`${SERVER_URL}/get/cityList/${district}`)
                .then((res) => { setCityList(res.data.cityList) })
                .catch((err) => console.log(err))
                .finally(() => setLoading(false))
        }
    }

    // filter clear handler
    const handleClear = () => {
        setService("");
        setState("");
        setDistrict("");
        setCity("");
        setRating("");
    }

    // booking dialog box handler
    const bookingHandler = (serviceProvider) => {
        setServiceProvider(serviceProvider);
        setShowDialog(true);
    }


    return (
        <>
            <ConfirmBooking showDialog={showDialog} setShowDialog={setShowDialog} user={user}
                alertSnackbar={alertSnackbar} serviceProvider={serviceProvider} />

            <Box sx={{ backgroundColor: 'whitesmoke', height: "100vh" }}>

                {/* filter toolbar starts */}
                <Toolbar sx={{ position: "fixed", width: "98%", top: { xs: 58, sm: 64 }, py: { xs: 2, lg: 0 }, zIndex: 1000, backgroundColor: "lightblue" }}>
                    <Container maxWidth={"xl"}>

                        <Grid container direction="row" justifyContent="space-evenly" spacing={1} flexWrap={true} >

                            {/* text filter */}
                            <Grid item xs={2} md={1} lg={"auto"}>
                                <Typography variant="h6" fontWeight="bold">Filters</Typography>
                            </Grid>

                            {/* service */}
                            <Grid item xs={5} md={4} lg={2}>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    size="small"
                                    id="service"
                                    clearIcon={null}
                                    disableClearable
                                    loading={loading}
                                    options={serviceList}
                                    value={service}
                                    onFocus={() => getServiceList()}
                                    onChange={(e, v) => setService(v)}
                                    isOptionEqualToValue={(opt, val) => true}
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    renderInput={(params) => <TextField {...params} label="Service" />}
                                />
                            </Grid>

                            {/* state */}
                            <Grid item xs={5} md={4} lg={2}>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    size="small"
                                    id="state"
                                    loading={loading}
                                    clearIcon={null}
                                    disableClearable
                                    options={stateList}
                                    value={state}
                                    onFocus={() => getStateList()}
                                    onChange={(e, v) => setState(v)}
                                    isOptionEqualToValue={(opt, val) => true}
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    renderInput={(params) => <TextField {...params} label="State" />}
                                />
                            </Grid>

                            {/* district */}
                            <Grid item xs={4} md={3} lg={2}>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    size="small"
                                    id="district"
                                    loading={loading}
                                    disableClearable
                                    clearIcon={null}
                                    options={districtList}
                                    value={district}
                                    onFocus={() => getDistrictList()}
                                    onChange={(e, v) => setDistrict(v)}
                                    isOptionEqualToValue={(opt, val) => true}
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    renderInput={(params) => <TextField {...params} label="District" />}
                                />
                            </Grid>

                            {/* city */}
                            <Grid item xs={4} md={4} lg={2}>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    size="small"
                                    id="city"
                                    loading={loading}
                                    disableClearable
                                    clearIcon={null}
                                    options={cityList}
                                    value={city}
                                    onFocus={() => getCityList()}
                                    onChange={(e, v) => setCity(v)}
                                    isOptionEqualToValue={(opt, val) => true}
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    renderInput={(params) => <TextField {...params} label="City" />}
                                />
                            </Grid>

                            {/* rating */}
                            <Grid item xs={4} md={4} lg={1}>
                                <Autocomplete
                                    disablePortal
                                    size="small"
                                    id="rating"
                                    clearIcon={null}
                                    disableClearable
                                    options={ratingList}
                                    value={rating}
                                    onChange={(e, v) => setRating(v.split("")[0])}
                                    isOptionEqualToValue={(opt, val) => true}
                                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                                    renderInput={(params) => <TextField {...params} label="Rating" />}
                                />
                            </Grid>

                            {/* button apply */}
                            <Grid item xs={5} md={2} lg={"auto"}>
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: "capitalize" }}
                                    onClick={getServiceProviders} >
                                    Apply
                                </Button>
                            </Grid>

                            {/* button clear */}
                            <Grid item xs={5} md={2} lg={"auto"}>
                                <Button
                                    variant="Outlined"
                                    onClick={handleClear}
                                    sx={{ minWidth: 120, backgroundColor: "white", border: "1px solid skyblue", textTransform: "capitalize" }}>
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
                    serviceProviderList.length == 0
                        ?
                        // if no date to show
                        <Container sx={{ position: "relative", top: 128, zIndex: 900, p: 4 }} maxWidth={"xl"}>
                            <Paper sx={{ m: 2, p: 2 }}>
                                <Typography variant="h6" fontWeight="bold" align="center" >No Data Found</Typography>
                            </Paper>
                        </Container>
                        :
                        // card container
                        <Container sx={{ position: "relative", top: { xs: 220, md: 175, lg: 128 }, zIndex: 900, p: 4 }} maxWidth={"xl"}>
                            <Grid container justifyContent="space-evenly" spacing={4}>

                                {serviceProviderList.map(item => (
                                    <Grid item xs={12} md={6} key={item._id}>
                                        <Paper sx={{ p: 2 }}>

                                            {/* name with profile pic */}
                                            <Stack direction="row">
                                                <Box sx={{ display: { xs: "none", sm: "block" } }}><img className="profilPic" src={profile} /></Box>
                                                <Box sx={{ pl: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 0 } }}>
                                                    <Typography fontFamily="Poppins" fontWeight="bold" variant="h6">{item.firstName + " " + item.lastName}</Typography>
                                                    <Typography lineHeight={1.5} variant="p">{item.about}</Typography><br />
                                                </Box>
                                            </Stack>

                                            <Grid container direction="row">

                                                {/* service type */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Typography variant="subtitle2" p={1}>Service:<b>{" " + item.serviceType}</b></Typography>
                                                </Grid>

                                                <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                                                {/* city */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Typography variant="subtitle2" p={1}>City:{" " + item.city}</Typography>
                                                </Grid>

                                                <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                                                {/* rating */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Stack direction="row">
                                                        <Typography variant="subtitle2" sx={{ pl: 1, mt: 1, display: "inline" }}>Rating:</Typography>
                                                        <Rating value={+item.rating} precision={0.5} readOnly sx={{ mt: 1, mr: 1 }} />
                                                    </Stack>
                                                </Grid>

                                                <Grid item sx={{ display: "flex" }}><Divider orientation="vertical" flexItem /></Grid>

                                                {/* button book now */}
                                                <Grid item xs={12} sm={"auto"}>
                                                    <Button
                                                        onClick={() => bookingHandler(item)}
                                                        variant="contained" size="small" sx={{ mt: { xs: 2, sm: 0 }, ml: { xs: 1, sm: 2 } }} >
                                                        Book Now
                                                    </Button>
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

export default Services;