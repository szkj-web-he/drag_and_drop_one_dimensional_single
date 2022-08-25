import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Context, ValueChangeFnProps } from "./context";
import "./elementsFromPointPolyfill.ts";
import "./font.scss";
import { StorageCabinet } from "./storageCabinet";
import "./style.scss";
import { Warehouse } from "./warehouse";

import { ConfigYML, PluginComms } from "@possie-engine/dr-plugin-sdk";
import Hr from "./hr";
import { hasStorageEl, OptionProps } from "./unit";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        optionsInstruction?: string;
        options?: Array<{ code: string; content: string }>;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};

const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const moveCallBack = useRef<(x: number, y: number) => void>(() => undefined);
    const upCallBack = useRef<() => void>(() => undefined);

    const selectedValueRef = useRef<OptionProps>();
    const [selectedValue, setSelectedValue] = useState(
        selectedValueRef.current ? { ...selectedValueRef.current } : undefined,
    );

    const noSelectedValues = useMemo(() => {
        const arr = comms.config.options ?? [];
        return arr.filter((item) => item.code !== selectedValue?.code);
    }, [selectedValue]);

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        comms.state = selectedValue?.code ?? null;
    }, [selectedValue]);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const valueChangeCallback = useCallback((res: ValueChangeFnProps) => {
        const status = hasStorageEl(res.x, res.y);
        if (status) {
            selectedValueRef.current = {
                code: res.data.code,
                content: res.data.content,
            };
        } else if (res.from === "storageCabinet") {
            selectedValueRef.current = undefined;
        }

        setSelectedValue(selectedValueRef.current ? { ...selectedValueRef.current } : undefined);
    }, []);

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="wrapper">
            <div className="question">
                <div
                    className="questionContent"
                    dangerouslySetInnerHTML={{
                        __html: comms.config.question ?? "",
                    }}
                />
                <div
                    className="questionDes"
                    dangerouslySetInnerHTML={{
                        __html: `(${comms.config.instruction ?? ""})`,
                    }}
                />
            </div>
            <Context.Provider
                value={{
                    valueChangeCallback,
                    upCallBack,
                    moveCallBack,
                }}
            >
                <Warehouse list={noSelectedValues} />
                <Hr />
                <StorageCabinet list={selectedValue ? [selectedValue] : []} />
            </Context.Provider>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
