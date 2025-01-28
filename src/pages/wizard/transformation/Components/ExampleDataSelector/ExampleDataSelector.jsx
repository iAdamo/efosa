import SInput from "@/components/SInput";
import useOutsideClickHandler from "@/hooks/useOutsideHandler";
import useGlobalStore from "@/store/globalStore";
import EyeCross from "@assets/icons/eye-cross.svg?react";
import Eye from "@assets/icons/eye.svg?react";
import { useEffect, useRef, useState } from "react";
import { Cell, Column, ColumnResizer, ResizableTableContainer, Row, Table, TableBody, TableHeader } from "react-aria-components";

export default function ExampleDataSelector({ direction, exampleDataRows, renderType, ...props }) {
  const [selectedData, setSelectedData] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(100);
  const [showData, setShowData] = useState(false);
  const [headers, setHeaders] = useState([]);

  const { setExampleDataGraph, transformationModuleData } = useGlobalStore((s) => ({
    setExampleDataGraph: s.setExampleDataGraph,
    transformationModuleData: s.transformationModuleData,
  }));

  const exampleDataWrapper = useRef(null);
  useOutsideClickHandler(exampleDataWrapper, () => {
    console.log("clickong outside");
    //props.changeExampleDataIsOpen(false);
  });

  useEffect(() => {
    const updateHeight = () => {
      if (exampleDataWrapper.current) {
        setCurrentHeight(exampleDataWrapper.current.offsetHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (exampleDataWrapper.current) {
      resizeObserver.observe(exampleDataWrapper.current);
    }

    return () => {
      if (exampleDataWrapper.current) {
        resizeObserver.unobserve(exampleDataWrapper.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("selectedData", selectedData);
    setExampleDataGraph(selectedData);
  }, [selectedData, setExampleDataGraph]);

  useEffect(() => {
    let headers = [];
    switch (renderType) {
      case "wizard":
      case "matching":
        if (exampleDataRows[0]) {
          headers = Object.keys(exampleDataRows[0]);
        }
        break;

      case "executionSummary":
        if (transformationModuleData && transformationModuleData?.listOfDataObjects?.length) {
          transformationModuleData.listOfDataObjects.forEach((item) => {
            headers = Object.keys(item?.datarow || {});
          });
        }
        break;

      default:
        break;
    }

    setHeaders(headers);
  }, [exampleDataRows, renderType, transformationModuleData, setHeaders]);

  const dataToRender = (() => {
    switch (renderType) {
      case "wizard":
        return exampleDataRows;
      case "executionSummary":
        return transformationModuleData?.listOfDataObjects || [];
      default:
        return [];
    }
  })();

  return (
    <div ref={exampleDataWrapper} className="w-full h-[inherit] absolute">
      <div className="flex flex-col h-full">
        <div className="flex justify-between border-b border-grey-2 items-center p-5">
          <div className="flex ">
            <span className="addNodeHeading">Select Example Data &nbsp;</span>
            <span className={`addNodeAPI ${direction === "SOURCE" ? "text-custom-sourceTextColor" : "text-custom-destinationTextColor"}`}> API 1</span>
            {showData ? (
              <Eye onClick={() => setShowData(!showData)} alt="eye" className="ml-5 icon-grey-5" />
            ) : (
              <EyeCross onClick={() => setShowData(!showData)} alt="eye" className="ml-5 icon-grey-5" />
            )}
          </div>
        </div>
        <div className="flex flex-col p-5 gap-[15px] pt-[15px] overflow-hidden">
          <div className="add-node-search-container !justify-start !w-[85%]">
            <SInput type="text" className="modal-header input" placeholder="Search" icon="search" onChange={(e) => {}} />
            <span className="text-white" />
          </div>
          {/* currentHeight >= window.innerHeight * 0.65
                ? "overflow-scroll"
                : "h-full" */}
          <div
            // className={` example-data-div  ${
            //   currentHeight >= window.innerHeight * 0.65
            //     ? "overflow-scroll"
            //     : "h-full"
            // } `}
            className={` example-data-div overflow-scroll`}>
            <ResizableTableContainer>
              <Table aria-label="Table with resizable columns">
                <TableHeader>
                  {headers.map((header, index) => (
                    <Column key={`header-${index}`} id={`header-${index}`} isRowHeader minWidth="24%" maxWidth="70%">
                      <div className="flex-wrapper">
                        <span tabIndex={-1} className="column-name">
                          {header}
                        </span>
                        <ColumnResizer />
                      </div>
                    </Column>
                  ))}
                </TableHeader>
                <TableBody>
                  {dataToRender.map((item, index) => {
                    const datarow = renderType === "executionSummary" ? item?.datarow || {} : item;
                    return (
                      <Row
                        onAction={() => {
                          console.log("clicking on row", index);
                          setSelectedData(index);
                        }}
                        key={item.id}
                        className={selectedData === index ? "selected" : ""}>
                        {headers.map((header, index) => (
                          <Cell key={`row-${item.id}=${index}`}>{JSON.stringify(datarow[header])}</Cell>
                        ))}
                      </Row>
                    );
                  })}
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div>

          {/* <div
            className={" example-data-div h-full"}
            // style={{
            //   height:
            //     temp.length * 25 + 200 > window.innerHeight * 0.45
            //       ? `${Number.parseInt(window.innerHeight * 0.35)}px`
            //       : `${temp.length * 25 + 40}px`,
            // }}
          >
            <ResizableTableContainer id="adfb">
              <Table aria-label="Table with controlled, resizable columns saved in local storage">
                <TableHeader>
                  <Column className="px-14 whitespace-nowrap">
                    Parameter name 1
                  </Column>
                  <ColumnResizer />
                  <Column className="px-14 whitespace-nowrap">
                    Parameter name 1
                  </Column>
                  <Column className="px-14 whitespace-nowrap">
                    Parameter name 1
                  </Column>
                  <Column className="px-14 whitespace-nowrap">
                    Parameter name 1
                  </Column>
                </TableHeader>
                <TableBody>
                  {temp.map((item, index) => (
                    <Row
                      className={selectedData === index ? "selected" : ""}
                      key={index}
                    >
                      <Cell className="px-14 whitespace-nowrap">
                        List item with data{index}
                      </Cell>

                      <Cell className="px-14 whitespace-nowrap">
                        List item with data
                      </Cell>
                      <Cell className="px-14 whitespace-nowrap">
                        List item with data
                      </Cell>
                      <Cell className="px-14 whitespace-nowrap">
                        List item with data
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </ResizableTableContainer>
          </div> */}
        </div>
      </div>
    </div>
  );
}
