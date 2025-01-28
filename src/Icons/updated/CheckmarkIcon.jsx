const CheckmarkIcon = (props) => {
  const {color, display} = props;
  return (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="13"
  height="10"
  fill='none'
  viewBox="0 0 13 10"
  className={display}
>
  <path
    stroke={`${(color) ? color : '#fff'}`}
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M11.995 1.225L4.66 8.558 1.328 5.225"
  ></path>
</svg>
);
 }
export default CheckmarkIcon;
