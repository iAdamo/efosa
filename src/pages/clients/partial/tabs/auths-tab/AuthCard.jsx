import Button from '@/components/Button';
import EditIcon from "@assets/icons/Edit.svg?react";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import GlobeIcon from "@/Icons/GlobeIcon.jsx";

const AuthInfo = ({ label, value, isLast }) => (
    <div
        className={`flex items-start gap-2 w-[160px] box-border ${
            !isLast ? 'border-r border-[#454c54]' : ''
        }`}
    >
        <span className='text-sm font-normal text-[#706D79]'>{label}</span>
        <span className="text-sm font-normal text-white max-w-[95px] md:max-w-[160px] truncate">
            {value}
        </span>
    </div>
);

function AuthCard ({auth }) {
    const navigate = useNavigate();
    const formattedTime = moment(auth?.created_at).format("DD-MM-YY");

    return (
        <div className='p-4 bg-grey-15 rounded-lg cursor-pointer group hover:bg-project-card-gradient hover:backdrop-blur'>
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start gap-3">
                    <div className="flex items-center gap-5">
                         <span className='text-custom-ghostWhite font-normal text-lg leading-[14px]'>
                           {auth?.name}
                        </span>

                        <Button
                            className="flex items-center justify-center px-2 py-1 gap-2 w-20 h-6 border border-opacity-40 border-gray-600 rounded-full"
                            onClick={() => {}}
                        >
                            <GlobeIcon />
                            OAuth
                        </Button>

                        <AuthInfo label="Created on" value={formattedTime}/>
                        <AuthInfo label="Used in" value={`${12} Speccs`}/>
                        <AuthInfo label="API" value={auth.apiKeyName}/>
                        <AuthInfo label="Assigned to" value={`Client name`} isLast/>
                    </div>
                </div>

                <div className='flex items-center gap-5'>
                    <Button className='flex gap-1.5 items-center group'>
                        <span className='text-grey-16 group-hover:text-grey-18'>Edit</span>
                        <EditIcon className='text-grey-16 group-hover:text-grey-18'/>
                    </Button>
                    <Button
                        className='py-2.5 px-[35px] border border-grey-13 rounded-[10px] hover:bg-gradient-pink-4 hover:border-main-pink-5'
                        onClick={() => {
                            navigate(`/project/${project?.id}/integrations`);
                        }}
                    >View details</Button>
                </div>
            </div>
        </div>
    )
}

export default AuthCard