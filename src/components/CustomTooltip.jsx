import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';

const CustomTooltip = ({ title, children, placement = "bottom" }) => {
    const theme = createTheme({
        components: {
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: '#333',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Tooltip
                title={
                    <div>
                        {typeof title === "string" ? (
                            <Typography variant="body2">{title}</Typography>
                        ) : (
                            title
                        )}
                    </div>
                }

                placement={placement}
            >
                {children}
            </Tooltip>
        </ThemeProvider>
    );
};

export default CustomTooltip;
