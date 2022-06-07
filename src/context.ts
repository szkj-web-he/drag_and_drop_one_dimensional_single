import { createContext, useContext } from "react";
import { OptionProps } from "./unit";

export interface HandleUpFnProps {
    x: number;
    y: number;
    code: string;
    content: string;
}
export type HandleUpFn = (res: HandleUpFnProps) => void;

export type HandleMoveFn = (x: number, y: number) => void;

export interface CallbackProps {
    up: Array<HandleUpFn>;
    move?: HandleMoveFn;
}

export interface ValueChangeFnProps {
    x: number;
    y: number;
    data: OptionProps;
}

interface ContextDataProps {
    isMobile: boolean;
    moveCallBack: React.MutableRefObject<(x: number, y: number) => void>;
    valueChangeCallback: (res: ValueChangeFnProps) => void;
}
const contextData = (): ContextDataProps => ({
    isMobile: false,
    moveCallBack: { current: () => undefined },
    valueChangeCallback: () => undefined,
});

export const Context = createContext(contextData());

export const useMContext = (): ContextDataProps => useContext(Context);
