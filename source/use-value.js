import { useState } from 'react';
import useImmutableCallback from './use-immutable-callback.js';

export default function useValue(props) {
	let { value, defaultValue, onChange } = props;

	let [stateValue, setStateValue] = useState(value ?? defaultValue);
	let onValueChange = useImmutableCallback(function (event, value = event?.target?.value) {
		onChange?.(event, value);
		setStateValue(value);
	});

	return [value ?? stateValue, onValueChange];
}
