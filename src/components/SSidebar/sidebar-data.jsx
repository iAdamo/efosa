// import { motion } from "framer-motion";
// import { sidebarFlyIn, sidebarFlyOut } from "@/animations";
// import { Group } from "react-aria-components";
// import SidebarMenuItem from "./SidebarMenuItem";
// import Upload from "@assets/icons/upload.svg?react";
// import KeyIcon from "@assets/icons/key.svg?react";
// import CollapseIcon from "@assets/icons/round-double-arrow.svg?react";
// import ExpandIcon from "@assets/icons/round-double-arrow-open.svg?react";
// import STabs from "../STabs";
// import Node from "@assets/icons/node.svg?react";
// import LeftArrow from "@assets/icons/left-arrow.svg?react";
// import Connect from "@assets/icons/connect.svg?react";
// import FingerScan from "@assets/icons/finger-scan.svg?react";
// import { FingerPrintIcon } from "@heroicons/react/solid";
// import TestTube from "@assets/icons/test-tube.svg?react";
// import Add from "@assets/icons/add.svg?react";
// import Strategy from "@assets/icons/strategy.svg?react";
// import Scheduler from "@assets/icons/scheduler.svg?react";
// import Matching from "@assets/icons/matching.svg?react";

// export const setupOptions = [
//   {
//     section: "Settings",
//     options: [
//       {
//         name: "Upload API",
//         icon: <Upload alt="upload" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//       {
//         name: "Authentication",
//         icon: <KeyIcon alt="key" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//     ],
//   },
//   {
//     section: "Build",
//     options: [
//       {
//         name: "Add nodes",
//         icon: <Node alt="node" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//       {
//         name: "Get data",
//         icon: <LeftArrow alt="arrow" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//       {
//         name: "Connect",
//         icon: <Connect alt="connect" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//       {
//         name: "Unique identifier",
//         icon: <FingerScan alt="finger-scan" className="icon-grey-5 h-4 w-4" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//       {
//         name: "Test",
//         icon: <TestTube alt="finger-scan" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//     ],
//   },
//   {
//     section: "Activate",
//     options: [
//       {
//         name: "Strategy",
//         icon: <Strategy alt="strategy" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//         strategies: [
//           {
//             name: "Matching",
//             icon: <Matching alt="matching" />,
//             isErrored: false,
//             isValidated: false,
//             isLoading: false,
//             options: [
//               {
//                 name: "Build match",
//                 icon: <></>,
//                 isErrored: false,
//                 isValidated: false,
//                 isLoading: false,
//               },
//               {
//                 name: "Pagination",
//                 icon: <></>,
//                 isErrored: false,
//                 isValidated: false,
//                 isLoading: false,
//               },
//               {
//                 name: "See result",
//                 icon: <></>,
//                 isErrored: false,
//                 isValidated: false,
//                 isLoading: false,
//               },
//             ],
//           },
//           {
//             name: "Transfer historic",
//             icon: <TestTube alt="finger-scan" className="icon-grey-5" />,
//             isErrored: false,
//             isValidated: false,
//             isLoading: false,
//             options: [
//               {
//                 name: "See result",
//                 icon: <></>,
//                 isErrored: false,
//                 isValidated: false,
//                 isLoading: false,
//               },
//               {
//                 name: "Transfer",
//                 icon: <></>,
//                 isErrored: false,
//                 isValidated: false,
//                 isLoading: false,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         name: "Scheduler",
//         icon: <Scheduler alt="scheduler" className="icon-grey-5" />,
//         isErrored: false,
//         isValidated: false,
//         isLoading: false,
//       },
//     ],
//   },
// ];

// export const moduleOptions = [];

// const createMenu = () => {
//   const list = [];

//   setupOptions.map((setupItem, index) => {
//     list.push(
//       <Group key={uuidv4()} className={"flex flex-col gap-[0px]"}>
//         <div class="text-white text-xs font-normal font-['Inter'] leading-[14px] tracking-tight py-[10px]">
//           {setupItem.section}
//         </div>
//         {setupItem.options.map((setupOptions) => {
//           return (
//             <Group key={uuidv4()} className={"flex flex-col gap-[0px]"}>
//               <SidebarMenuItem
//                 key={uuidv4()}
//                 name={setupOptions.name}
//                 icon={
//                   setupOptions.isErrored ? (
//                     <Warning alt="warning" className="icon-error" />
//                   ) : setupOptions.isValidated ? (
//                     <Check alt="check" className="icon-success" />
//                   ) : setupOptions.isLoading ? (
//                     <CircularProgress imgClassName="w-5 h-5" />
//                   ) : (
//                     setupOptions.icon
//                   )
//                 }
//               />
//               {setupOptions.strategies?.map((strategy) => {
//                 return (
//                   <SAccordion
//                     key={uuidv4()}
//                     title={
//                       <div className="flex justify-between gap-[5px]">
//                         <Matching alt="matching" />
//                         <div class="text-[#ea35fa] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
//                           {strategy.name}
//                         </div>
//                       </div>
//                     }
//                     content={strategy.options.map((option) => {
//                       return (
//                         <div className="flex flex-col ">
//                           <div className="flex justify-between py-[10px] px-[10px] pl-10 pr-[10px]">
//                             <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
//                               Build match
//                             </div>
//                             {isAuthenticated && (
//                               <Check alt="check" className="icon-success" />
//                             )}
//                           </div>
//                           <div className="flex justify-between py-[10px] px-[10px] pl-10 pr-[10px]">
//                             <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
//                               Pagination
//                             </div>
//                             {isAuthenticated && (
//                               <Check alt="check" className="icon-success" />
//                             )}
//                           </div>
//                           <div className="flex justify-between py-[10px] px-[10px] pl-10 pr-[10px]">
//                             <div class="text-[#aeaeae] text-xs font-normal font-['Inter'] leading-[14px] tracking-tight">
//                               See result
//                             </div>
//                             {isAuthenticated && (
//                               <Check alt="check" className="icon-success" />
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                     titleClassname="justify-between flex items-center gap-2  p-[10px]"
//                     accordionClassname="pl-[0px]"
//                     iconClassName="!w-5 !h-auto"
//                   />
//                 );
//               })}
//             </Group>
//           );
//         })}
//       </Group>
//     );
//     if (index !== setupOptions.length - 1) {
//       list.push(
//         <div key={uuidv4()} class="h-[0px] border-b border-grey-3 my-[8px]" />
//       );
//     }
//   });
//   console.log(list);
//   return list;
// };
