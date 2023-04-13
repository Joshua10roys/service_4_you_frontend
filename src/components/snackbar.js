import * as React from 'react';
import { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GrowTransition = (props) => {
    return <Grow {...props} />;
}

export default function MuiSnackbar({ snackbar, setSnackbar }) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ severity: snackbar.severity, message: snackbar.message, open: false });
    };

    return (
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleClose}
            TransitionComponent={GrowTransition} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
            <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    );
}