import { useEffect, useRef, useState } from 'react';

import useImmutableCallback from './use-immutable-callback.js';

export function useLoader(options = {}) {
	let { delayBusyMs = 200, minBusyMs = 500 } = options;

	let busyRef = useRef(false);
	let timerRef = useRef();
	let timeoutRef = useRef();
	let timestampRef = useRef();

	let stopPromiseRef = useRef();
	let startPromiseRef = useRef();

	let [loading, setLoading] = useState(false);

	let start = useImmutableCallback(async () => {
		clearTimeout(timeoutRef.current);

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
				timeoutRef.current = setTimeout(() => {
					timerRef.current = undefined;
					timestampRef.current = undefined;
					stopPromiseRef.current?.resolve();

					setLoading(false);
				}, 0);
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
						timeoutRef.current = setTimeout(() => {
							timerRef.current = undefined;
							timestampRef.current = undefined;

							setLoading(false);
						}, 0);
					}
				}

				return stopPromiseRef.current;
			}
		}
	});

	return [loading, start, stop];
}

export function useLoadingState(busy, options) {
	let [loading, start, stop] = useLoader(options);

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
	let [loading, start, stop] = useLoader(options);

	let callback = useImmutableCallback(async (...args) => {
		let id = ++idRef.current;

		start();

		try {
			return await func(...args);
		} finally {
			if (id === idRef.current) {
				await stop();
			}
		}
	});

	return [callback, loading];
}

export function useCallbackBusyState(func) {
	let [busy, setBusy] = useState(false);

	let callback = useImmutableCallback(async (...args) => {
		setBusy(true);
		try {
			return await func(...args);
		} finally {
			setBusy(false);
		}
	});

	return [callback, busy];
}

export function useCallbackLoadingStates(func, options) {
	let [callback1, busy] = useCallbackBusyState(func);
	let [callback2, loading] = useCallbackLoadingState(callback1, options);

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
