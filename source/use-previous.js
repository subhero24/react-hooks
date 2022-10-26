import { useRef, useEffect } from "react";

export default function usePrevious(value) {
	let ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref.current;
}
