import { useRef, useCallback } from 'react';

import useInsertionEffect from './use-insertion-effect.js';

export default function useImmutableCallback(callback, dependencies = []) {
	let callbackRef = useRef();

	useInsertionEffect(() => {
		callbackRef.current = callback;
	});

	return useCallback(
		function (...args) {
			return callbackRef.current?.(...args);
		},
		[callbackRef, ...dependencies],
	);
}
