import React from 'react'
import RepeatIcon from "@assets/icons/repeatIcon.svg?react";
import UnionIcon from "@assets/icons/oneDirectional-union.svg?react";
import { Checkbox } from '@mui/material';

function DataDirection() {
  return (
    <div className="p-4 bg-add-api-btn-gradient rounded-lg border border-grey-12 w-[362px] ">
				<div>
					<span className="text-grey-17">DATA DIRECTION</span>
					<div className="p-2 flex gap-3 mt-3 mb-2 items-center">
						<RepeatIcon className={"h-5 w-6"} />
						<span className="text-grey-17 text-lg">Two way integration</span>
					</div>
					<div className="p-2 flex gap-3 items-center bg-hover-grey-1 rounded-[5px]">
						<UnionIcon />
						<div >From
							<span className="py-0.5 px-2 rounded bg-secondary-pink-light font-semibold text-lg text-secondary-pink-light-1 mx-1">STRIPE</span>
							to
							<span className="py-0.5 px-2 rounded bg-secondary-aqua font-semibold text-lg text-secondary-aqua-1 ml-1">TRIPLETEX</span>
						</div>
					</div>
				</div>
				<div className="mt-[38px] flex">
					<div className="border-r border-gradient-grey-6 pr-5 mr-5">
						<div className="mb-2">
							<span className="py-1 px-2 rounded bg-secondary-pink-light text-secondary-pink-light-1 font-semibold mr-1">STRIPE</span>
							<span className="text-secondary-pink-light-1 font-medium" >SETTINGS</span>
						</div>
						<div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-lg font-medium pl-1">Get</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Post</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Update</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Delete</span>
							</div>
						</div>
					</div>
					<div className="">
						<div className="mb-2">
							<span className="py-1 px-2 rounded bg-secondary-aqua text-secondary-aqua-1 font-semibold mr-1">TRIPLETEX</span>
							<span className="text-secondary-aqua-1 font-medium" >SETTINGS</span>
						</div>
						<div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Get</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-lg font-medium pl-1">Post</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Update</span>
							</div>
							<div className="p-2 flex items-center">
								<Checkbox
									size="small"
									sx={{
										'&.Mui-checked': { color: '#A8A9AB', padding: 0 },
										'&.MuiCheckbox-root': { color: '#A8A9AB', padding: 0 }
									}}
								/>
								<span className="text-grey-17 text-lg font-medium pl-1">Delete</span>
							</div>
						</div>
					</div>
					<div>
					</div>
				</div>
			</div>
  )
}

export default DataDirection