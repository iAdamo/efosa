import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Breadcrumb } from "react-aria-components";
import { Breadcrumbs } from "react-aria-components";
import HomeIcon from "@assets/icons/home.svg?react";
import ArrowIcon from "@assets/icons/acrd-open.svg?react";
import Upload from "@assets/icons/upload.svg?react";
import Specc from "@assets/icons/specc.svg?react";
import Building from "@assets/icons/building.svg?react";
import Integration from "@assets/icons/integration.svg?react";
import Webhook from "@assets/icons/webhook.svg?react";
import Settings from "@assets/icons/settings.svg?react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";
import Group from "@assets/icons/group.svg?react";
import FolderIcon from "@assets/icons/dashboard/sidebar/folder.svg?react";
import ExecutionIcon from "@/Icons/ExecutionIcon";
import ApiIcon from "@assets/icons/api.svg?react";
import AuthenticateIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";
import AuthKeyIcon from "@assets/icons/dashboard/sidebar/authKeyIcon.svg?react";
import ClientUserIcon from "@assets/icons/dashboard/sidebar/ClientUsers.svg?react";
import ZapIcon from "@assets/icons/dashboard/sidebar/zap.svg?react";
import SideBarHome from "@assets/icons/dashboard/sidebar/SideBarHome.svg?react";

export default function SBreadcrumbs(props) {
	const { speccID, projectID, customLabel } = props;
	//const { projectID, projectName } = useContext(ProjectContext);

	// let truncatedProjectName = projectName;
	// if (projectName.length > 20) {
	// 	truncatedProjectName = projectName.substring(0, 20) + "...";
	// }

	const breadCrumbComponent = (type, name, isLast = false, secondType = '') => {
		return (
			<div className="flex items-center gap-[5px] rounded-[5px]">
				{getBreadcrumbIcon(secondType || type)}
				<div class={`text-xs font-medium font-['Inter'] leading-3`}>
					{name}
				</div>
			</div>
		);
	};

	const getBreadcrumbIcon = (type) => {
		switch (type) {
			case "home":
				return <HomeIcon alt="home" className="icon-grey-5" />;
			case "specc":
				return <Specc alt="specc" className="icon-grey-5" />;
			case "integration":
				return <Integration alt="integration" className="icon-grey-5" />;
			case "transformation":
				return <Building alt="transformation" className="icon-grey-5" />;
			case "upload":
				return <Upload alt="upload" className="icon-grey-5" />;
			case "webhook":
				return <Webhook alt="webhook" className="icon-grey-5" />;
			case "settings":
				return <Settings alt="settings" className={`icon-grey-5`} />;
			case "groupData":
				return <Group alt="group" className="icon-grey-5" />;
			case "project":
				return <FolderIcon alt="projects" className="icon-white" />;
			case "executionSummary":
				return <ExecutionIcon alt="execution" className="icon-grey-5" />
			case "api":
				return <ApiIcon alt="api" className="icon-grey-5" />
			case "my-apis":
			case "edit":
				return <ZapIcon alt="my-apis" className="icon-grey-5" />
			case "authenticate":
				return <AuthenticateIcon alt="authenticate" className="icon-grey-5" />
			case "my-auths":
				return <AuthKeyIcon alt="authenticate" className="icon-grey-5" />
			case "clients":
				return <ClientUserIcon alt="authenticate" className="icon-grey-5" />
			case "dashboard":
				return <SideBarHome alt="authenticate" className="icon-grey-5" />
			default:
				return <HomeIcon alt="home" className="icon-grey-5" />;
		}
	};

	const params = useParams();

	const routes = [
		{
			path: "/",
			breadcrumb: () => breadCrumbComponent("home", "Home"),
			props: { redirectUrl: "/" },
		},
		{
			path: "/projects",
			breadcrumb: () => breadCrumbComponent("project", "All Projects"),
			props: { redirectUrl: "/projects" },
		},
		{
			path: "/specc",
			breadcrumb: () => breadCrumbComponent("specc", "Project"),
			props: { redirectUrl: `/project/${projectID}/integrations` },
		},
		{
			path: "/project/:id/integrations",
			breadcrumb: () => breadCrumbComponent("integration", "Integrations"),
			props: { redirectUrl: `/project/${projectID}/integrations` },
		},
		{
			path: "/project/:id",
			breadcrumb: () => breadCrumbComponent("integration", "Integrations"),
			props: { redirectUrl: `/project/${projectID}/integrations` },
		},
		{
			path: "/project/:id/settings",
			breadcrumb: () => breadCrumbComponent("settings", "Settings"),
			props: { redirectUrl: `/project/${projectID}/settings` },
		},
		{
			path: "/project/:id/settings/authenticate-apis",
			breadcrumb: () => breadCrumbComponent("authenticate", "Authenticate APIs"),
			props: { redirectUrl: `/project/${projectID}/settings/authenticate-apis` },
		},
		{
			path: "/specc/:id/",
			breadcrumb: () => breadCrumbComponent("integration", "Integrations"),
			props: { redirectUrl: `/project/${projectID}/integrations` },
		},
		{
			path: "/specc/:id/transformation",

			breadcrumb: () => breadCrumbComponent("transformation", "Build"),
			props: { redirectUrl: `/specc/${speccID}/transformation` },
		},
		{
			path: "/specc/:id/get-data",

			breadcrumb: () => breadCrumbComponent("get-data", "Get Data"),
			props: { redirectUrl: `/specc/${speccID}/get-data` },
		},
		{
			path: "/specc/:id/unique-source",

			breadcrumb: () => breadCrumbComponent("unique-source", "Unique Source"),
			props: { redirectUrl: `/specc/${speccID}/unique-source` },
		},
		{
			path: "/specc/:id/unique-destination",

			breadcrumb: () =>
				breadCrumbComponent("unique-destination", "Unique Destination"),
			props: {
				redirectUrl: `/specc/${speccID}/unique-destination`,
			},
		},
		{
			path: "/specc/:id/transfer",

			breadcrumb: () => breadCrumbComponent("transfer", "Test"),
			props: {
				redirectUrl: `/specc/${speccID}/transfer`,
			},
		},
		{
			path: "/my-apis/upload",

			breadcrumb: () => breadCrumbComponent("upload", "Upload", true),
			props: {
				redirectUrl: "/my-apis/upload",
			},
		},
		{
			path: "/my-apis",
			breadcrumb: () => breadCrumbComponent("my-apis", "MyAPIs"),
			props: { redirectUrl: "/my-apis" },
		},
		{
			path: "/my-apis/:id",
			breadcrumb: () => breadCrumbComponent("my-apis", customLabel),
			props: { redirectUrl: `/my-apis/${params.apiId}` },
		},
		{
			path: "/my-apis/:id/edit",
			breadcrumb: () => breadCrumbComponent(customLabel, "Edit", false, "edit"),
			props: { redirectUrl: `/my-apis/${params.apiId}/edit` },
		},
		{
			path: "/specc/:id/webhook",
			breadcrumb: () => breadCrumbComponent("webhook", "Webhook"),
			props: { redirectUrl: `/project/${projectID}/webhook` },
		},
		{
			path: "/specc/:id/group-data",
			breadcrumb: () => breadCrumbComponent("groupData", "Group"),
			props: { redirectUrl: `/specc/${speccID}/group-data` },
		},
		{
			path: "/execution-summary",
			breadcrumb: () => breadCrumbComponent("executionSummary", "Execution summary"),
			props: { redirectUrl: `/execution-summary` },
		},
		{
			path: "/execution-summary/details",
			breadcrumb: () => breadCrumbComponent("api", "Project Name"),
			props: { redirectUrl: `/execution-summary/details` },
		},
		{
			path: "/execution-summary/details/:id",
			breadcrumb: () => breadCrumbComponent("api", "Specc Name"),
			props: { redirectUrl: `/execution-summary/details/${params.speccID}` },
		},
		{
			path: "/my-auths",
			breadcrumb: () => breadCrumbComponent("my-auths", "My Auths"),
			props: { redirectUrl: '/my-auths' },
		},
		{
			path: "/my-auths/:id",
			breadcrumb: () => breadCrumbComponent("my-auths", customLabel),
			props: { redirectUrl: `/my-auths/${params.clientID}` },
		},
		{
			path: "/clients",
			breadcrumb: () => breadCrumbComponent("clients", "Clients"),
			props: { redirectUrl: '/clients' },
		},
		{
			path: "/clients/:id",
			breadcrumb: () => breadCrumbComponent("clients", customLabel),
			props: { redirectUrl: `/clients/${params.clientID}` },
		},
	];

	const breadcrumbs = useBreadcrumbs(routes, {
		excludePaths: ["/project"],
	});

	const filteredBreadcrumbs = location.pathname.includes("/execution-summary/details")
		? breadcrumbs.filter(({ match }) => match.pathname !== "/")
		: breadcrumbs;

	return (
		<Breadcrumbs className="gap-[10px] flex items-center ">
			{breadcrumbs.map(({ match, breadcrumb, redirectUrl }, index) => {
				const isLast = index === breadcrumbs.length - 1;
				return (
					<Breadcrumb key={match.key}>
						<NavLink to={redirectUrl} className={`flex items-center gap-[10px] ${isLast ? 'bg-grey-14 text-custom-patternGrey rounded-[5px] py-2 px-2.5 ' : 'text-gradient-grey-2'}`}>
							{breadcrumb}
							{index !== breadcrumbs.length - 1 && (
								<ArrowIcon alt="arrow" className="icon-white" />
							)}
						</NavLink>
					</Breadcrumb>
				)
			})}
		</Breadcrumbs>
	);
}
