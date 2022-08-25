import { createContext, useContext } from "react";
import { OptionProps } from "./unit";

export interface ValueChangeFnProps {
    x: number;
    y: number;
    data: OptionProps;
    from: "warehouse" | "storageCabinet";
}

interface ContextDataProps {
    moveCallBack: React.MutableRefObject<(x: number, y: number) => void>;
    upCallBack: React.MutableRefObject<() => void>;
    valueChangeCallback: (res: ValueChangeFnProps) => void;
}
const contextData = (): ContextDataProps => ({
    moveCallBack: { current: () => undefined },
    upCallBack: { current: () => undefined },
    valueChangeCallback: () => undefined,
});

export const Context = createContext(contextData());

export const useMContext = (): ContextDataProps => useContext(Context);
