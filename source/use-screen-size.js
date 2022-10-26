import { useState, useMemo, useEffect, useContext, createContext, createElement } from "react";

let screenSizeContext = createContext();

export const defaultScreenSizes = [640, 768, 1024, 1280];
export const defaultScreenNames = ["sm", "md", "lg", "xl"];

export function ScreenSize(props) {
	let { sizes = defaultScreenSizes, names = defaultScreenNames, children } = props;

	let mediaQueries = useMemo(
		function () {
			return sizes.map((size) => window.matchMedia(`(min-width: ${size}px)`));
		},
		[...sizes] // eslint-disable-line react-hooks/exhaustive-deps
	);

	let [screen, setScreen] = useState(function () {
		for (let index = sizes.length - 1; index >= 0; --index) {
			if (mediaQueries[index].matches) return { size: names[index], index: index };
		}
		return { size: undefined, index: -1 };
	});

	useEffect(() => {
		function mediaQueryChanged() {
			for (let index = sizes.length - 1; index >= 0; --index) {
				if (mediaQueries[index].matches) {
					setScreen({
						size: names[index],
						index: index,
					});
					return;
				}
			}
			setScreen({ size: undefined, index: -1 });
		}

		for (let mediaQuery of mediaQueries) {
			mediaQuery.addListener(mediaQueryChanged);
		}

		return function () {
			for (let mediaQuery of mediaQueries) {
				mediaQuery.removeListener(mediaQueryChanged);
			}
		};
	}, [mediaQueries, ...names]); // eslint-disable-line react-hooks/exhaustive-deps

	return createElement(screenSizeContext.Provider, { value: screen }, children);
}

export function useScreenSize() {
	let screen = useContext(screenSizeContext);
	if (screen == undefined) {
		throw new Error("useScreenSize can only be used inside a <ScreenSize> component");
	}

	return screen.size;
}

export function useScreenSizeIndex() {
	let screen = useContext(screenSizeContext);
	if (screen == undefined) {
		throw new Error("useScreenSizeIndex can only be used inside a <ScreenSize> component");
	}

	return screen.index;
}
