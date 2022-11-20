import { useRef, useEffect } from 'react';

import useImmutableCallback from './use-immutable-callback.js';

export default function useTimeout(func, delay) {
	let firedRef = useRef(false);
	let timeoutRef = useRef();
	let callback = useImmutableCallback(func);

	useEffect(() => {
		if (firedRef.current) return;
		if (timeoutRef.current == undefined) {
			timeoutRef.current = Date.now();
		}

		function handler() {
			callback();
			firedRef.current = true;
		}

		let now = Date.now();
		let moment = timeoutRef.current + delay - now;
		let timeout = setTimeout(handler, Math.max(moment, 0));

		return function () {
			clearTimeout(timeout);
		};
	}, [callback, delay, firedRef]);
}
