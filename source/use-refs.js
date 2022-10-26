import { useRef } from "react";

export default function useRefs() {
	return {
		[Symbol.iterator]: function () {
			return this;
		},
		next: function () {
			return { done: false, value: useRef() };
		},
	};
}
