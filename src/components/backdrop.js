import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


function BackdropWithSpinner() {

    return (
        <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress sx={{ color: "white" }} />
        </Backdrop>
    );
}

export default BackdropWithSpinner;