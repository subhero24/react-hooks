import { useState } from 'react';
import useImmutableCallback from './use-immutable-callback.js';

function initialValue(initialState) {
	if (typeof initialState === 'function') {
		return initialState();
	} else {
		return initialState;
	}
}

export default function useSessionStorageState(key, initialState) {
	let [state, setState] = useState(function () {
		try {
			let sessionStorageValue = window.sessionStorage.getItem(key);
			if (sessionStorageValue) {
				return JSON.parse(sessionStorageValue);
			} else {
				return initialValue(initialState);
			}
		} catch (error) {
			return initialValue(initialState);
		}
	});

	let setSessionStorageState = useImmutableCallback(value => {
		let result;
		if (typeof value === 'function') {
			result = value(state);
		} else {
			result = value;
		}

		window.sessionStorage.setItem(key, JSON.stringify(result));

		setState(result);
	});

	return [state, setSessionStorageState];
}
