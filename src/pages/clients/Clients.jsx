import {useContext, useMemo, useState} from "react";

import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import SBreadcrumbs from "@/components/SBreadcrumbs";
import PlusIcon from "@assets/icons/plusIcon.svg?react";
import ClientCard from "./partial/ClientCard";
import ClientUserIcon from "@assets/icons/dashboard/sidebar/ClientUsers.svg?react";
import {GeneralContext} from "@contexts/GeneralContext.jsx";
import CreateClientModal from "@pages/clients/partial/CreateClientModal.jsx";
import EmptyData from "@components/EmptyData.jsx";

export default function Clients(props) {
    const { clients } = useContext(GeneralContext);
    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = useState(false);

    const filteredClients = useMemo(() => {
        let list = [];
        if (searchText === "") {
            list = [...clients];
        } else {
            list = [...clients.filter(client => client.name?.toLowerCase().includes(searchText.toLowerCase()))]
        }

        return list;
    }, [searchText, clients]);

    return (
        <div className="w-full h-screen flex flex-col gap-10 pl-8 p-10">
            <SBreadcrumbs/>
            <div className="w-full flex">
                <div className="w-1/2 flex flex-col gap-2">
						<span className="text-[28px] font-medium leading-larger">
							Clients
						</span>
                    <span
                        className="w-full max-w-[585px] text-base font-normal text-grey-17 font-['Inter'] tracking-wide">
							You can effortlessly manage your clients right within Specc. You can create, view, edit, and delete client information whenever you need to.
						</span>
                </div>

                <div className="w-1/2 flex justify-end items-center gap-4">
                    <CustomInput
                        variant="searchBox"
                        className="max-w-[365px] w-full"
                        inputClassName="w-full"
                        placeholder="Search"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div>
                        <Button
                            className="gap-2"
                            variant="primary"
                            onClick={() => setOpen(true)}
                        >
                            <PlusIcon/>
                            <span className="text-lg font-bold">New Client</span>
                        </Button>

                        <CreateClientModal open={open} setOpen={setOpen}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col overflow-auto gap-[14px] h-full">
                {filteredClients.length > 0 ? (
                    filteredClients.map((client) => <ClientCard key={client?.id} client={client}/>
                    )) : <EmptyData
                        icon={<ClientUserIcon className="w-10 h-10" />}
                        info='Your list of clients is empty, start by adding a new client'
                    />
                }
            </div>
        </div>
    );
}
