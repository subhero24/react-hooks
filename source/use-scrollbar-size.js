import { useState, useCallback } from 'react';

import useLayoutEffect from './use-layout-effect.js';

let outerElement = document.createElement('div');
let innerElement = document.createElement('div');
outerElement.style.overflow = 'scroll';
outerElement.style.visibility = 'hidden';
outerElement.appendChild(innerElement);

document.body.appendChild(outerElement);

let width = outerElement.offsetWidth - innerElement.offsetWidth;
let height = outerElement.offsetHeight - innerElement.offsetHeight;

document.body.removeChild(outerElement);

export default function useScrollbarSize(ref) {
	let [scrollbars, setScrollbars] = useState([0, 0]);

	let updateScrollbarDimensions = useCallback(
		function () {
			let element = ref.current;
			let hasVerticalScrollbar = element.clientHeight < element.scrollHeight;
			let hasHorizontalScrollbar = element.clientWidth < element.scrollWidth;

			let scrollWidth = hasVerticalScrollbar ? width : 0;
			let scrollHeight = hasHorizontalScrollbar ? height : 0;

			setScrollbars([scrollWidth, scrollHeight]);
		},
		[ref],
	);

	useLayoutEffect(() => {
		let element = ref.current;
		let observer = new ResizeObserver(updateScrollbarDimensions);
		observer.observe(element);

		updateScrollbarDimensions();

		return function () {
			observer.unobserve(element);
		};
	}, [ref, updateScrollbarDimensions]);

	return [...scrollbars, updateScrollbarDimensions];
}
