export function useLayoutEffect(handler: Function, dependencies: any): void;
export function useInsertionEffect(handler: Function, dependencies: any): void;

export function useMediaQuery(query: string): boolean;
export function useImmutableCallback(callback: Function, dependencies?: any[]): Function;

export function useEventListener(element: any, event: string, func: Function): void;
export function useEventListener(
	element: any,
	event: string,
	options: { once?: boolean; capture?: boolean; passive?: boolean },
	func: Function,
): void;

export function useRefs(): any;
export function useValue(props: { value?: any; defaultValue?: any; onChange?: Function }): [any, Function];
export function useTimeout(func: Function, delay: number): void;
export function usePrevious(value: any): any;
export function useOuterRef(outerRef: any, value: any): any;
export function useRendered(): boolean;
export function useTransition(): Function;
export function useMountedRef(): { current: any };
export function useForceUpdate(): Function;
export function useLatestValueRef(value: any): { current: any };

export function useWindowSize(): { width: number; height: number };
export function useScrollbarSize(ref: any): any[];

export function useDerivedState(callback: any, deps: any): [any, Function];
export function useLocalStorageState(key: string, initialState: any): [any, Function];
export function useSessionStorageState(key: string, initialState: any): [any, Function];

export function useLoader(options?: { delayBusyMs: number; minBusyMs: number }): [Function, Function, boolean];
export function useLoadingState(busy: boolean, options?: { delayBusyMs: number; minBusyMs: number }): boolean;
export function useCallbackBusyState(func: Function): [Function, boolean];
export function useCallbackLoadingState(
	func: Function,
	options?: { delayBusyMs: number; minBusyMs: number },
): [Function, boolean];
export function useCallbackLoadingStates(
	func: Function,
	options?: { delayBusyMs: number; minBusyMs: number },
): [Function, boolean, boolean];

export function useImmer(state: [any, Function]): [any, Function];
export function useImmerState(initialvalue: any): [any, Function];
export function useImmerReducer(reducer: Function, initialState: any): [any, Function];

export function ScreenSize(props: any): any;
export function useScreenSize(): any;
export function useScreenSizeIndex(): number;
export const defaultScreenSizes: number[];
export const defaultScreenNames: string[];
