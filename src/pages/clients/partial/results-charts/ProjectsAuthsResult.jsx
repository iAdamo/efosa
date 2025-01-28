import React from "react";

const ProjectsAuthsResult = ({ client }) => {
    return (
        <div className="space-y-12 col-span-1 md:col-span-1">
            <div className="grid grid-cols-1 gap-4">
                <div
                    className="bg-[#141619] flex flex-col justify-start h-[100px] rounded-lg border border-solid border-[#454c5466] shadow-[0px_4px_80px_#00000033] p-4">
                    <h3 className="text-sm text-[#f8f9fa66] tracking-wide mb-2">TOTAL PROJECTS</h3>
                    <p className="text-2xl font-semibold text-[#f8f9fa]">{client.projects_count}</p>
                </div>

                <div
                    className="bg-[#141619] flex flex-col justify-start h-[100px] rounded-lg border border-solid border-[#454c5466] shadow-[0px_4px_80px_#00000033] p-4">
                    <h3 className="text-sm text-[#f8f9fa66] tracking-wide mb-2">SAVED AUTHENTICATIONS</h3>
                    <p className="text-2xl font-semibold text-[#f8f9fa]">{client.auths_count}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectsAuthsResult;
