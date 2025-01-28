import { Navigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import API from "./pages/api";
import Builder from "./pages/builder";
import Dashboard from "./pages/dashboard";

import { NAVIGATION_TYPES, UI_ACTIONS } from "./constants";
import ProjectWrapper from "./contexts/ProjectContext";
import WizardWrapper from "./contexts/WizardContext";
import DashboardLayout from "./layout/dashboard";
import ProjectSettingsLayout from "./layout/project-settings";
import RouteAnimWrapper from "./layout/RouteAnimWrapper";
import WizardLayout from "./layout/wizard";
import TooFastCowboy from "./pages/dashboard/TooFastCowboy";
import Login from "./pages/login";
import NewProject from "./pages/new-project";
import Profile from "./pages/profile";
import ProjectIntegrations from "./pages/project-integrations";
import ProjectSettings from "./pages/project-settings";
import Projects from "./pages/projects";
import RunOverview from "./pages/run-overview";
import Specc from "./pages/specc";
import SpeccOverview from "./pages/specc-overview";
import ComingSoon from "./pages/status-pages/ComingSoon";
import EventPage from "./pages/wizard/event";
import GetDataPage from "./pages/wizard/get-data";
import SchedulerPage from "./pages/wizard/scheduler";
import StartSpeccPage from "./pages/wizard/start-specc";
import StrategyPage from "./pages/wizard/strategy";
import TransferPage from "./pages/wizard/transfer";
import TransformationPage from "./pages/wizard/transformation";
import UniqueDestinationPage from "./pages/wizard/unique-destination";
import UniqueSourcePage from "./pages/wizard/unique-source";
// import UploadAPI from "./pages/my-apis/upload";
import ClientDetails from "@pages/clients/ClientDetails.jsx";
import Clients from "@pages/clients/Clients.jsx";
import ApiDetails from "@pages/my-apis/ApiDetails.jsx";
import EditApi from "@pages/my-apis/edit-api/index.jsx";
import AddApi from "@pages/my-apis/new-api/index.jsx";
import AuthDetails from "@pages/my-auths/AuthDetails.jsx";
import MyAuths from "@pages/my-auths/MyAuths.jsx";
import AnimatedOutlet from "./layout/AnimatedOutlet";
import ApiAuthentication from "./pages/api/Authentication/ApiAuthentication";
import MyAPIUpload from "./pages/api/upload/MyAPIUpload";
import ProjectAPIUpload from "./pages/api/upload/ProjectAPIUpload";
import ExecutionSummary from "./pages/execution-summary";
import ExecutionSummaryDetails from "./pages/execution-summary/execution-summary-details";
import MyApis from "./pages/my-apis";
import ApiDetailsPage from "./pages/my-apis/ApiDetailsPage";
import FilterData from "./pages/wizard/filter-data";
import GroupData from "./pages/wizard/group-data";
import Matching from "./pages/wizard/matching";
import BuildMatch from "./pages/wizard/matching/build-match";
import GetData from "./pages/wizard/matching/get-data";
import Results from "./pages/wizard/matching/results";
import SelectEndpoint from "./pages/wizard/matching/select-endpoint";
import Webhook from "./pages/wizard/webhook";

export const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: (
              <RouteAnimWrapper>
                <Dashboard />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/clients",
            element: (
              <RouteAnimWrapper>
                <Clients />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/clients/:clientId",
            element: (
              <RouteAnimWrapper>
                <ClientDetails />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "my-apis/upload",
            element: (
              <RouteAnimWrapper>
                <MyAPIUpload />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/execution-summary",
            element: (
              <RouteAnimWrapper>
                <ExecutionSummary />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/execution-summary/details",
            element: (
              <WizardWrapper>
                <AnimatedOutlet />
              </WizardWrapper>
            ),
            children: [
              {
                path: ":speccID",
                element: (
                  <RouteAnimWrapper>
                    <ExecutionSummaryDetails />
                  </RouteAnimWrapper>
                ),
              },
            ],
          },
          {
            path: "/coming-soon",
            element: (
              <RouteAnimWrapper>
                <TooFastCowboy />
              </RouteAnimWrapper>
            ),
          },

          {
            path: "/builder",
            element: (
              <RouteAnimWrapper>
                <Builder />
              </RouteAnimWrapper>
            ),
          },

          {
            path: "/projects",
            element: (
              <RouteAnimWrapper>
                <Projects />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/profile",
            element: (
              <RouteAnimWrapper>
                <Profile />
              </RouteAnimWrapper>
            ),
          },
          {
            element: (
              <RouteAnimWrapper>
                <ApiDetailsPage />
              </RouteAnimWrapper>
            ),
            children: [
              {
                path: "/my-apis",
                element: (
                  <RouteAnimWrapper>
                    <MyApis />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/my-apis/:apiId",
                element: (
                  <RouteAnimWrapper>
                    <ApiDetails />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/my-apis/:apiId/edit",
                element: (
                  <RouteAnimWrapper>
                    <EditApi />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/my-apis/add-api",
                element: (
                  <RouteAnimWrapper>
                    <AddApi />
                  </RouteAnimWrapper>
                ),
              },
            ],
          },
          {
            path: "/my-auths",
            element: (
              <RouteAnimWrapper>
                <MyAuths />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/my-auths/:authId",
            element: (
              <RouteAnimWrapper>
                <AuthDetails />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/new-project",
            element: (
              <RouteAnimWrapper>
                <NewProject />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/project/:urlProjectID/integrations",
            element: (
              <ProjectWrapper>
                <RouteAnimWrapper>
                  <ProjectIntegrations />
                </RouteAnimWrapper>
              </ProjectWrapper>
            ),
          },
          {
            path: "/specc/:URLspeccID/overview",
            element: (
              <RouteAnimWrapper>
                <SpeccOverview />
              </RouteAnimWrapper>
            ),
          },
        ],
      },
      {
        element: (
          <ProjectWrapper>
            <ProjectSettingsLayout />
          </ProjectWrapper>
        ),
        children: [
          {
            path: "/project/:urlProjectID/settings",
            element: (
              <RouteAnimWrapper>
                <ProjectSettings />
              </RouteAnimWrapper>
            ),
            handle: {
              navigationButton: {
                text: "Confirm Settings",
                action: NAVIGATION_TYPES.INTEGRATIONS,
                actionConf: {
                  action: UI_ACTIONS.NAVIGATE,
                  to: (a) => `project/${a}/integrations`,
                },
              },
            },
          },

          {
            path: "/project/:urlProjectID/settings/authenticate-apis",
            element: (
              <RouteAnimWrapper>
                <ApiAuthentication />
              </RouteAnimWrapper>
            ),
          },

          {
            path: "/project/:urlProjectID/settings/api/:direction",
            element: (
              <RouteAnimWrapper>
                <ProjectAPIUpload />
              </RouteAnimWrapper>
            ),
            handle: {
              navigationButton: {
                text: "Save API",
                action: NAVIGATION_TYPES.PROJECT_SETTINGS,
                actionConf: {
                  action: UI_ACTIONS.NAVIGATE,
                  to: (a) => `project/${a}/settings`,
                },
              },
            },
          },
          {
            path: "/project/:urlProjectID/myapi/:myapiid",
            element: (
              <RouteAnimWrapper>
                <API isMyAPI />
              </RouteAnimWrapper>
            ),
            handle: {
              navigationButton: {
                text: "Save API",
                action: NAVIGATION_TYPES.PROJECT_SETTINGS,
                actionConf: {
                  action: UI_ACTIONS.NAVIGATE,
                  to: (a) => `project/${a}/settings`,
                },
              },
            },
          },
          {
            path: "/specc/:speccID/upload",
            element: (
              <RouteAnimWrapper>
                <Specc />
              </RouteAnimWrapper>
            ),
            handle: {
              navigationButton: {
                text: "Save API",
                action: NAVIGATION_TYPES.PROJECT_SETTINGS,
                actionConf: {
                  action: UI_ACTIONS.NAVIGATE,
                  to: (a) => `project/${a}/settings`,
                },
              },
            },
          },
          {
            path: "/specc/:speccID/auth",
            element: (
              <RouteAnimWrapper>
                <Specc />
              </RouteAnimWrapper>
            ),
            handle: {
              navigationButton: {
                text: "Save API",
                action: NAVIGATION_TYPES.PROJECT_SETTINGS,
                actionConf: {
                  action: UI_ACTIONS.NAVIGATE,
                  to: (a) => `project/${a}/settings`,
                },
              },
            },
          },
        ],
      },
      {
        element: (
          <WizardWrapper>
            <WizardLayout />
          </WizardWrapper>
        ),
        children: [
          {
            path: "/specc/:speccID/get-data",
            element: (
              <RouteAnimWrapper>
                <GetDataPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/webhook",
            element: (
              <RouteAnimWrapper className="flex w-full h-full">
                <Webhook />
              </RouteAnimWrapper>
            ),
          },
          {
            element: (
              <RouteAnimWrapper className="flex w-full h-full">
                <Matching />
              </RouteAnimWrapper>
            ),
            children: [
              {
                path: "/specc/:speccID/matching/get-data",
                element: (
                  <RouteAnimWrapper className="flex w-full h-full">
                    <GetData />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/specc/:speccID/matching/results",
                element: (
                  <RouteAnimWrapper className="flex w-full h-full">
                    <Results />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/specc/:speccID/matching/build-match",
                element: (
                  <RouteAnimWrapper className="flex w-full h-full">
                    <BuildMatch />
                  </RouteAnimWrapper>
                ),
              },
              {
                path: "/specc/:speccID/matching/select-endpoint",
                element: (
                  <RouteAnimWrapper className="flex w-full h-full">
                    <SelectEndpoint />
                  </RouteAnimWrapper>
                ),
              },
            ],
          },
          {
            path: "/specc/:speccID/transformation",
            element: (
              <RouteAnimWrapper>
                <TransformationPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/transfer",
            element: (
              <RouteAnimWrapper>
                <TransferPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/event",
            element: (
              <RouteAnimWrapper>
                <EventPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/unique-source",
            element: (
              <RouteAnimWrapper>
                <UniqueSourcePage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/unique-destination",
            element: (
              <RouteAnimWrapper>
                <UniqueDestinationPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/strategy",
            element: (
              <RouteAnimWrapper>
                <StrategyPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/scheduler",
            element: (
              <RouteAnimWrapper>
                <SchedulerPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/start-specc",
            element: (
              <RouteAnimWrapper>
                <StartSpeccPage />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/group-data",
            element: (
              <RouteAnimWrapper>
                <GroupData />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/filter-data",
            element: (
              <RouteAnimWrapper>
                <FilterData />
              </RouteAnimWrapper>
            ),
          },
          {
            path: "/specc/:speccID/webhook",
            element: (
              <RouteAnimWrapper className="flex w-full h-full">
                <Webhook />
              </RouteAnimWrapper>
            ),
          },
        ],
      },
      {
        path: "/specc/:URLspeccID/run/:hash",
        element: (
          <RouteAnimWrapper>
            <RunOverview />
          </RouteAnimWrapper>
        ),
      },
      {
        path: "/coming-soon",
        element: (
          <RouteAnimWrapper>
            <ComingSoon />
          </RouteAnimWrapper>
        ),
      },
    ],
  },
];
