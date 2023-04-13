import { Container, CircularProgress } from "@mui/material";


function MuiSpinner() {

    return (
        <Container style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
        </Container>
    )
}

export default MuiSpinner;