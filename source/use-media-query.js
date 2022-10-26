import { useMemo, useState, useEffect } from "react";

export default function useMediaQuery(query) {
	let mediaQueryList = useMemo(() => window.matchMedia(query), [query]);

	let [match, setMatch] = useState(mediaQueryList.matches);

	useEffect(() => {
		mediaQueryList.addEventListener("change", function (event) {
			setMatch(event.matches);
		});
	}, [mediaQueryList]);

	return match;
}
