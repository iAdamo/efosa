import { BallTriangle } from "react-loader-spinner";

const AuthenticateButton = ({ title, onClick, icon, loading, disabled }) => (
	<button
		type="button"
		className="text-white bg-[#080808] rounded-md flex items-center justify-center gap-1.5 w-[128px] h-9 font-semibold text-sm"
		onClick={onClick}
		disabled={loading || disabled}
	>
		{loading ? (
			<BallTriangle
				width="32"
				height="32"
				color="#fff"
				ariaLabel="loading-indicator"
			/>
		) : (
			title
		)}
		{icon || ""}
	</button>
);

export default AuthenticateButton;
