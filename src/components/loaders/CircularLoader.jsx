import circularLoader from "@assets/loaders/progress-circular.gif";
export default function CircularLoader({ ...props }) {
  return (
    <img
      src={circularLoader}
      alt="loading"
      className={` ${props.imgClassName ? props.imgClassName : ""}`}
    />
  );
}
