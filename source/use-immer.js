import immer from 'immer';
import { useState, useReducer, useCallback } from 'react';

export function useImmer(state) {
	let [value, setValue] = state;

	let setImmerValue = useCallback(
		newValue => {
			if (typeof newValue === 'function') {
				setValue(immer(newValue));
			} else {
				setValue(newValue);
			}
		},
		[setValue],
	);

	return [value, setImmerValue];
}

export function useImmerState(initialvalue) {
	return useImmer(useState(initialvalue));
}

export function useImmerReducer(reducer, initialState) {
	let immerReducer = function (state, action) {
		return immer(state, function (draft) {
			return reducer(draft, action);
		});
	};

	return useReducer(immerReducer, initialState);
}
