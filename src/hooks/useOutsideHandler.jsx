import { useEffect } from "react";

const useOutsideClickHandler = (ref, handler) => {
	useEffect(() => {
		const listener = (event) => {
			if (!ref.current || ref.current.contains(event.target)) {
				return;
			}

			let closest = event.target;
			if (!event.target.classList.contains("toolbarcog")) {
				closest = closest.closest(".toolbarcog");
			}

			if (closest && closest.getAttribute("istoolbar") === "1") {
				return;
			}
			handler(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, handler]);
};

export default useOutsideClickHandler;
