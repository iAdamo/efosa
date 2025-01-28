import loadingGif from "@assets/loaders/specc_loader_grad_dark.gif";

export default function Loading({ ...props }) {
  return (
    <div
      className={`${
        props.className
          ? props.className
          : "w-screen h-screen z-dialog flex justify-center items-center fixed top-0 left-0"
      } `}
    >
      <img
        src={loadingGif}
        alt="loading"
        className={` ${
          props.imgClassName ? props.imgClassName : "p-[100px] h-[250px] w-auto"
        }`}
      />
    </div>
  );
}
