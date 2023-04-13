import { Container, Typography, Box, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";


// text responsive theme
let theme = createTheme();
theme.typography.h2 = {
    [theme.breakpoints.up('xs')]: {
        fontSize: '2rem',
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: '3rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '3.5rem',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
        fontSize: '4.5rem',
    },
};


function HomePage() {

    return (
        <Box className="homePage">
            <Container maxWidth={"xl"}>

                <Stack justifyContent="center" alignItems="center" height="100vh" >
                    <ThemeProvider theme={theme}>
                        <Typography noWrap fontFamily="Lobster" fontWeight="normal" variant="h2">Find the Best Service Provider</Typography>
                        <Typography fontFamily="Lobster" fontWeight="normal" variant="h2">In Your Area</Typography>
                    </ThemeProvider>
                </Stack>

            </Container>
        </Box >
    )
}

export default HomePage;