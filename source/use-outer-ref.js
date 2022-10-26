import { useRef } from "react";

export default function useOuterRef(outerRef, value) {
	let innerRef = useRef(value);

	return outerRef ?? innerRef;
}
