import { useRef, useEffect } from 'react';

export default function useLatestValueRef(value) {
	let ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref;
}
