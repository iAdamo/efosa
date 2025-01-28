const LogoSmall = (props) => {
  const {height, width} = props;
  return (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width={width}
  height={height}
  fill="none"
  viewBox="0 0 43 43"
>
  <path fill="#1963B0" d="M28.016 14.008h14.007V0H28.016v14.008z"></path>
  <path
    fill="#2EA5E9"
    d="M28.016 28.015h14.007V14.007H28.016v14.008z"
  ></path>
  <path
    fill="#62D9FF"
    d="M14.008 28.015h14.008V14.007H14.008v14.008z"
  ></path>
  <path
    fill="#6663FF"
    d="M14.008 42.024h14.008V28.016H14.008v14.008z"
  ></path>
  <path
    fill="#4C41CA"
    d="M28.016 42.024h14.007V28.016H28.016v14.008z"
  ></path>
  <path fill="#ADABFF" d="M0 42.024h14.008V28.016H0v14.008z"></path>
</svg>
  );
}
  export default LogoSmall;
  