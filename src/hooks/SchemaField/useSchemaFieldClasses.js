import { useMemo } from "react";
import { DIRECTION } from "@constants";
const useSchemaFieldClasses = (thisObject, dragElement, booleanModal, dataModal, isCollapsed, direction, isLinkedTo, links) => {




  const className = useMemo(() => {
    let classname;
    let hide = false;

    if (thisObject.fullNode) {
      if (thisObject.isOutput) {
        classname =
          "absolute z-20 -right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move dot-object";
      } else {
        classname =
          "absolute z-20 -translate-x-6 -translate-y-1/2 w-3 h-3 rounded-full   hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move dot-object";
        if (isLinkedTo) {
          hide = false;
        } else {
          hide = true;
        }
      }

      if (thisObject.isOutput) {
        hide = false;
      }

      if (dragElement) {
        if (dragElement.fullNode?.id == thisObject.fullNode?.id || dragElement?.ON?.nodeID == thisObject.fullNode?.id) {
          hide = false;
        } else {
          if (!hide) {
            classname += " opacity-30";
          }
        }
      }

      if (hide) {
        classname += " opacity-0";
      }
    } else {
      if (thisObject.isField) {
        if (direction == "SOURCE") {
          classname =
            "absolute z-20 -right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";
        }
        if (direction == "DESTINATION") {
          classname =
            "absolute z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full  -left-0  hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";
        }

        if (thisObject.activeField.type === "boolean") {
          classname += " dot-boolean";
        }
        if (thisObject.activeField.type === "integer") {
          classname += " dot-integer";
        }
        if (thisObject.activeField.type === "number") {
          classname += " dot-number";
        }
        if (thisObject.activeField.type === "string") {
          classname += " dot-string";
        }
      }

      if (thisObject.isON && !thisObject.isField) {
        if (thisObject.isInput) {
          classname =
            "absolute z-20 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full  -left-3  hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";

          if (thisObject?.ONConfig?.isForObjects) {
            classname += " dot-object";
          } else {
            if (thisObject.ONConfig && thisObject.ONConfig.package != "Conditional") {
              if (thisObject.ONConfig.fromString == 1) {
                classname += " dot-string";
              }
              if (thisObject.ONConfig.fromInteger == 1) {
                classname += " dot-integer";
              }
              if (thisObject.ONConfig.fromBoolean == 1) {
                classname += " dot-boolean";
              }
              if (thisObject.ONConfig.fromDecimal == 1) {
                classname += " dot-number";
              }
            }
            if (thisObject.ONConfig.name == "Node as ON") {
              classname += " dot-object";
            }

            if (thisObject.ONConfig.package == "Conditional") {
              if (thisObject.type == "string") {
                classname += " dot-string";
              }
              if (thisObject.type == "integer") {
                classname += " dot-integer";
              }
              if (thisObject.type == "boolean") {
                classname += " dot-boolean";
              }
              if (thisObject.type == "number") {
                classname += " dot-number";
              }
            }
          }
        }
        if (thisObject.isOutput) {
          classname =
            "absolute z-20 -right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";

          if (thisObject?.ONConfig?.isForObjects) {
            classname += " dot-object";
          } else {
            if (thisObject.ONConfig && thisObject.ONConfig.package != "Conditional") {
              if (thisObject.ONConfig.toString == 1) {
                classname += " dot-string";
              }
              if (thisObject.ONConfig.toInteger == 1) {
                classname += " dot-integer";
              }
              if (thisObject.ONConfig.toBoolean == 1) {
                classname += " dot-boolean";
              }
              if (thisObject.ONConfig.toDecimal == 1) {
                classname += " dot-number";
              }
            }
            if (thisObject.ONConfig && thisObject.ONConfig.name == "Node as ON") {
              classname += " dot-object";
            }

            if (thisObject.ONConfig && thisObject.ONConfig.package == "Conditional") {
              if (thisObject.type == "string") {
                classname += " dot-string";
              }
              if (thisObject.type == "integer") {
                classname += " dot-integer";
              }
              if (thisObject.type == "boolean") {
                classname += " dot-boolean";
              }
              if (thisObject.type == "number") {
                classname += " dot-number";
              }
            }
          }
        }
      }

      if (thisObject.matchbox) {
        if (direction == "SOURCE") {
          classname =
            "absolute z-20 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full  -left-0  hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";
        } else {
          classname =
            "absolute z-20 -right-0 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full hover:scale-150 hover:shadow-md transition-all duration-200 cursor-move";
        }
        classname += " dot-string";
      }

      if (dragElement) {
        if (dragElement.generatedID == thisObject.generatedID) {
          classname += " active";
        }

        if (thisObject.direction == "SOURCE" && dragElement.generatedID != thisObject.generatedID) {
          classname += " opacity-30";
        }

        if (dragElement.type != thisObject.type) {
          classname += " opacity-30";
        }
        if (thisObject.isOutput) {
          classname += " opacity-30";
        }
      }
    }

    if (thisObject.fullNode) {
    }

    return classname;
  }, [JSON.stringify(thisObject), dragElement?.type, booleanModal, dataModal, JSON.stringify(links)]);

  const blockClassName = useMemo(() => {
    if (!thisObject.activeField) return null;
    let classname = "relative flex justify-end schema-block";

    if (thisObject.ONConfig) {
      classname += " reverse  textalign-left ";
    }
    if (direction == DIRECTION.DESTINATION) {
      classname += " reverse  textalign-left ";
    }

    if (isCollapsed) {
      classname += " collapsed";
    }
    /*
        if (isInOperationNode) {
            classname +=
                " opacity-50 hover:opacity-100 hover:bg-[#F7F7F7] cursor-pointer px-3";
        }
        */
    if (dragElement) {
      if (thisObject.activeField.type !== dragElement.type) {
        classname += " opacity-50";
      }
      if (thisObject.activeField.direction === "SOURCE" && thisObject.activeField.id !== dragElement.id) {
        classname += " opacity-50";
      }
    }
    return classname;
  }, [direction, JSON.stringify(thisObject), isCollapsed, dragElement?.type]);

  return { className, blockClassName };
};

export default useSchemaFieldClasses;
