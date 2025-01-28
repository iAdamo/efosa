import React, { useEffect, useRef, useState } from 'react';
import { Collapse, Box, Tooltip, styled } from '@mui/material';
import Button from '@/components/Button';

function CustomCollapse({ children, openIcon, closeIcon, open, handleToggle, collapsedMinSize, className, collapseButtonElement, collapseButton, tooltipText, opacityZero=false, ...props }) {
    const childRef = useRef(null);
    const [childWidth, setChildWidth] = useState(0);
    useEffect(() => {
        if (childRef.current) {
            setChildWidth(childRef.current.offsetWidth);
        }
    }, [children]);

    const StyledTooltip = styled(({ className, ...props }) => (
        <Tooltip title={tooltipText ? tooltipText : open ? "Collapse" : "Expand"} arrow placement="right-start" {...props} classes={{ popper: className }} />
    ))`
        & .MuiTooltip-tooltip {
          background: #F8F9FA;
          color: #1E2023;
          font-size: 16px,
        }
        & .MuiTooltip-arrow {
          color: #F8F9FA;
        }
      `;

    return (
        <div className='relative w-max'>
            <Collapse
                className={`rounded-lg ${className}`}
                in={open}
                collapsedSize={collapsedMinSize || childWidth}
                sx={{
                    height: '100% !important',
                }}
            >
                <Box sx={{ height: '100%' }} ref={childRef}>
                    {collapseButton && <>
                        {collapseButtonElement ?
                            <><StyledTooltip>{collapseButtonElement}</StyledTooltip></>
                            :
                            <StyledTooltip>
                                <div className='absolute top-3 -right-3 z-10' >
                                    <Button onClick={handleToggle} className='h-6 bg-black w-6 border rounded-full flex items-center justify-center'>
                                        {open ? openIcon || '->' : closeIcon || '<-'}
                                    </Button>
                                </div>
                            </StyledTooltip>
                        }
                    </>}
                    <Box sx={{opacity: open ? 1 : opacityZero ? 0 : 1, transition: 'opacity 0.3s ease-in-out'}}>
                    {children}
                    </Box>
                </Box>
            </Collapse>
        </div>

    );
}

export default CustomCollapse;