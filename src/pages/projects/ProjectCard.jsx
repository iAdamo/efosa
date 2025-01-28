import Button from '@/components/Button';
import CustomTooltip from '@/components/CustomTooltip';
import EditIcon from "@assets/icons/Edit.svg?react";
import Settings from "@assets/icons/dashboard/sidebar/settings.svg?react";
import DeleteIcon from "@assets/icons/delete.svg?react";
import InfoDetailIcon from "@assets/icons/infoIconDetails.svg?react";
import RepeatIcon from "@assets/icons/repeatIcon.svg?react";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, closeIcons, deleteClick }) {
    const navigate = useNavigate();
    const formattedTime = moment(project?.created_at).format("DD-MM-YY");

    return (
        <div className='p-4 bg-grey-15 rounded-lg cursor-pointer group hover:bg-project-card-gradient hover:backdrop-blur'>
            <div className='flex flex-col gap-5'>
                <div className='flex gap-6 items-center'>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-custom-ghostWhite font-normal text-lg leading-[14px]'>{project?.name}</span>
                        <CustomTooltip
                            title={
                                <div className="flex flex-col py-3 px-4 gap-[8px]">
                                    <div className="flex flex-col gap-[3px]">
                                        <div class="text-white text-base font-medium font-['Inter'] leading-[11px]">
                                            Project ID
                                        </div>
                                        <div class="text-[#aeaeae] text-base font-medium font-['Inter'] leading-[11px]">
                                            #{project?.id}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[3px]">
                                        <div class="text-white text-base font-medium font-['Inter'] leading-[11px]">
                                            Number of Speccs
                                        </div>
                                        <div class="text-[#aeaeae] text-base font-medium font-['Inter'] leading-[11px]">
                                            02
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[3px]">
                                        <div class="text-white text-base font-medium font-['Inter'] leading-[11px]">
                                            Activated Speccs
                                        </div>
                                        <div class="text-secondary-mint-green text-base font-medium font-['Inter'] leading-[11px]">
                                            01
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[3px]">
                                        <div class="text-status-error text-base font-medium font-['Inter'] leading-[11px]">
                                            Stopped Speccs
                                        </div>
                                        <div class="text-[#aeaeae] text-base font-medium font-['Inter'] leading-[11px]">
                                            01
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            <div><InfoDetailIcon /></div>
                        </CustomTooltip>
                    </div>
                    <span className='text-grey-11'>Created on {formattedTime}</span>
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-2 items-center flex-1'>
                        <Button variant='stripe'>{project?.sourceAPI?.name}</Button>
                        <RepeatIcon />
                        <Button variant='stripe'>{project?.destinationAPI?.name}</Button>
                    </div>

                    <div className='flex items-center gap-5'>
                        {!closeIcons && <>
                            <Button className='flex gap-1.5 items-center group' onClick={() => deleteClick(project?.id, project?.name)}>
                                <DeleteIcon className="h-4 w-5 fill-grey-16 group-hover:fill-grey-18 " />
                            </Button>

                            <Button
                                onClick={() => {
                                    navigate(`/project/${project?.id}/settings`);
                                }}
                            >
                                <Settings className="h-4 w-5 text-grey-16 group-hover:text-grey-18" />
                            </Button>
                        </>}

                        <Button className='flex gap-1.5 items-center group' >
                            <span className='text-grey-16 group-hover:text-grey-18'>Edit</span>
                            <EditIcon className='text-grey-16 group-hover:text-grey-18' />
                        </Button>
                        <Button
                            className='py-2.5 px-[35px] border border-grey-13 rounded-[10px] hover:bg-gradient-pink-4 hover:border-main-pink-5'
                            onClick={() => {
                                navigate(`/project/${project?.id}/integrations`);
                            }}
                        >Open</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard