import { ResizableBox } from "react-resizable";

export default function ResizableContainer({
  children,
  maxConstraints,
  minConstraints,
  height,
  width,
  axis,
  ...props
}) {
  return (
    <ResizableBox
      ref={props.reference}
      className={`h-auto ${props.className} z-[25000]`}
      width={width}
      axis={axis ?? "both"}
      height={height}
      maxConstraints={maxConstraints}
      minConstraints={minConstraints}
      handle={(h, ref) => (
        <span className={`custom-handle custom-handle-${h}`} ref={ref} />
      )}
      handleSize={[8, 8]}
      resizeHandles={["sw", "se", "nw", "ne", "w", "e", "n", "s"]}
    >
      {children}
    </ResizableBox>
  );
}
