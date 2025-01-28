
function WizardInput({ label, suffixClassName, suffix, onSuffixClick, ...props }) {
	return (
		<div
			className={
				"relative px-[20px] py-[10px] flex flex-col gap-[2px] w-full justify-between border border-grey-13 last:rounded-b-api-component first:rounded-t-api-component hover:border-secondary-yellow hover:bg-secondary-yellow/10"
			}
		>
			<input
				className="bg-transparent w-100"
				placeholder={label}
				{...props}
			/>
			{suffix &&
				<span
					onClick={() => onSuffixClick?.()}
					className={`absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer ${suffixClassName}`}>
					{suffix}
				</span>
			}
		</div>
	);
}

export default WizardInput;
