import { useState } from 'react';
import useEventListener from './use-event-listener.js';

export default function useWindowSize() {
	let [windowSize, setWindowSize] = useState({ width: window?.innerWidth, height: window?.innerHeight });

	useEventListener(window, 'resize', { passive: true }, function () {
		setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });
	});

	return windowSize;
}
