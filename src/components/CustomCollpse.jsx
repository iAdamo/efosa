import React, { useState } from 'react';
import { Collapse, Box } from '@mui/material';
import Button from '@/components/Button';

function HorizontalCollapse({ open, setOpen, children, openIcon, closeIcon, maxWidth, handleToggle }) {
    // const [open, setOpen] = useState(false);


    return (
        <div className='relative'>
            <div className='absolute top-0 right-0 z-10'>
                <Button onClick={handleToggle} variant="primary" color="primary">
                    {open ? openIcon || '-' : closeIcon || '+'}
                </Button>
            </div>

            <Collapse
                orientation="horizontal"
                in={open}
                timeout="auto"
                collapsedSize={50}
                //   unmountOnExit
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    border: open ? '' : '1px solid #454C5466',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    transition: 'width 5s ease',
                    height: '100%',
					maxWidth: maxWidth || 'max-content',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        alignItems: 'center',
                        width: open ? '100%' : '0px',
                        // opacity: open ? 1 : 0,
                        height: '100%',
                        transition: 'all 0.5s ease',
                    }}
                >
                    {children}
                </Box>
            </Collapse>
        </div>

    );
}

export default HorizontalCollapse;





// const [open1, setOpen1] = useState(false);
// const [open2, setOpen2] = useState(false);
// const [open3, setOpen3] = useState(false);

// const handleToggle1 = () => {
// 	setOpen1(!open1);
// 	// setOpen2(false);

// };

// const handleToggle2 = () => {
// 	setOpen2(!open2);
// 	// setOpen1(false);

// };

// const handleToggle3 = () => {
// 	setOpen3(!open3);
// 	// setOpen1(true)
// };




{/* <Collapse
				orientation="horizontal"
				in={open1}
				timeout="auto"
				collapsedSize={20}
				// unmountOnExit
				sx={{
					display: 'flex',
					flexDirection: 'row',
					width: open1 ? '700px' : '20px', // Change width based on state
					minWidth: '20px',
					transition: 'width 5s ease', // Add a smooth transition effect
					overflow: 'hidden', // Prevent content overflow
					height: '100%',
				}}
			>
				<Button onClick={handleToggle1} variant="contained" color="primary">
					Toggle
				</Button>
				<GetData
					node={parentNode}
					meatballs={allMeatballs}
					expanded={expandedMeatballs}
				/>
			</Collapse>

			<Collapse
				orientation="horizontal"
				in={open2}
				timeout="auto"
				collapsedSize={20}
				// unmountOnExit
				sx={{
					display: 'flex',
					flexDirection: 'row',
					width: open2 ? '700px' : '20px', // Change width based on state
					minWidth: '20px',
					transition: 'width 5s ease', // Add a smooth transition effect
					overflow: 'hidden', // Prevent content overflow
					height: '100%',
				}}
			>
				<Button onClick={handleToggle2} variant="contained" color="primary">
					Toggle
				</Button>
				<GetData
					node={parentNode}
					meatballs={allMeatballs}
					expanded={expandedMeatballs}
				/>
			</Collapse>

			<Collapse
				orientation="horizontal"
				in={open3}
				timeout="auto"
				collapsedSize={20}
				// unmountOnExit
				sx={{
					display: 'flex',
					flexDirection: 'row',
					width: open3 ? '700px' : '20px', // Change width based on state
					minWidth: '20px',
					transition: 'width 5s ease', // Add a smooth transition effect
					overflow: 'hidden', // Prevent content overflow
					height: '100%',
				}}
			>
				<Button onClick={handleToggle3} variant="contained" color="primary">
					Toggle
				</Button>
				<GetData
					node={parentNode}
					meatballs={allMeatballs}
					expanded={expandedMeatballs}
				/>
			</Collapse> */}