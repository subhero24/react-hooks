import { useState } from 'react';
import useImmutableCallback from './use-immutable-callback.js';

function initialValue(initialState) {
	if (typeof initialState === 'function') {
		return initialState();
	} else {
		return initialState;
	}
}

export default function useLocalStorageState(key, initialState) {
	let [state, setState] = useState(function () {
		try {
			let localStorageValue = window.localStorage.getItem(key);
			if (localStorageValue) {
				return JSON.parse(localStorageValue);
			} else {
				return initialValue(initialState);
			}
		} catch (error) {
			return initialValue(initialState);
		}
	});

	let setLocalStorageState = useImmutableCallback(value => {
		let result;
		if (typeof value === 'function') {
			result = value(state);
		} else {
			result = value;
		}

		window.localStorage.setItem(key, JSON.stringify(result));

		setState(result);
	});

	return [state, setLocalStorageState];
}
