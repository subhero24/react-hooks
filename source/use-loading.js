import { useEffect, useRef, useState } from 'react';

import useImmutableCallback from './use-immutable-callback.js';

export function useLoader(options = {}) {
	let { delayBusyMs = 200, minBusyMs = 500 } = options;

	let busyRef = useRef(false);
	let timerRef = useRef();
	let timestampRef = useRef();

	let stopPromiseRef = useRef();
	let startPromiseRef = useRef();

	let [loading, setLoading] = useState(false);

	let start = useImmutableCallback(async () => {
		if (loading) {
			if (busyRef.current === false) {
				busyRef.current = true;
				clearTimeout(timerRef.current);
			}
		} else {
			if (busyRef.current === false) {
				busyRef.current = true;
				startPromiseRef.current = createPromise();
				timerRef.current = setTimeout(() => {
					timerRef.current = undefined;
					timestampRef.current = Date.now();
					startPromiseRef.current.resolve();

					setLoading(true);
				}, delayBusyMs);
			}

			return startPromiseRef.current;
		}
	});

	let stop = useImmutableCallback(async (immediate = false) => {
		if (loading == false) {
			if (busyRef.current === true) {
				busyRef.current = false;
				clearTimeout(timerRef.current);
			}
		} else {
			if (immediate) {
				timerRef.current = undefined;
				timestampRef.current = undefined;
				stopPromiseRef.current?.resolve();

				setLoading(false);
			} else {
				if (busyRef.current === true) {
					busyRef.current = false;

					let alreadyBusyForMs = Date.now() - timestampRef.current;
					if (alreadyBusyForMs < minBusyMs) {
						stopPromiseRef.current = createPromise();
						timerRef.current = setTimeout(() => {
							timerRef.current = undefined;
							timestampRef.current = undefined;
							stopPromiseRef.current.resolve();

							setLoading(false);
						}, minBusyMs - alreadyBusyForMs);
					} else {
						timerRef.current = undefined;
						timestampRef.current = undefined;

						setLoading(false);
					}
				}

				return stopPromiseRef.current;
			}
		}
	});

	return [start, stop, loading];
}

export function useLoadingState(busy, options) {
	let [start, stop, loading] = useLoader(options);

	useEffect(() => {
		if (busy) {
			start();
		} else {
			stop();
		}
	}, [busy, start, stop]);

	return loading;
}

export function useCallbackLoadingState(func, options) {
	let idRef = useRef(0);
	let [start, stop, loading] = useLoader(options);

	let callback = useImmutableCallback(async () => {
		let id = ++idRef.current;

		start();

		await func();

		if (id === idRef.current) {
			await stop();
		}
	});

	return [callback, loading];
}

export function useCallbackBusyState(func) {
	let [busy, setBusy] = useState(false);

	let callback = useImmutableCallback(async () => {
		setBusy(true);
		await func();
		setBusy(false);
	});

	return [callback, busy];
}

export function useCallbackLoadingStates(func, options) {
	let [callback1, busy] = useCallbackBusyState(func);
	let [callback2, loading] = useCallbackLoadingState(callback1);

	return [callback2, busy, loading];
}

export function createPromise(resolveResult, rejectResult) {
	let reject;
	let resolve;
	let promise = new Promise((resolveFn, rejectFn) => {
		reject = function (arg) {
			rejectFn(typeof arg === 'function' ? arg(resolveResult) : arg ?? rejectResult);
		};
		resolve = function (arg) {
			resolveFn(typeof arg === 'function' ? arg(resolveResult) : arg ?? resolveResult);
		};
	});

	promise.reject = reject;
	promise.resolve = resolve;

	return promise;
}
