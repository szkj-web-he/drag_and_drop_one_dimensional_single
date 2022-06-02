import "./font.scss";
import "./style.scss";
import "./elementsFromPointPolyfill.ts";
import { Warehouse } from "./warehouse";
import React, { useEffect, useRef, useState } from "react";
import { StorageCabinet } from "./storageCabinet";
import { CallbackProps, Context } from "./context";
import { isMobile } from "./isMobile";

import { PluginComms, ConfigYML } from "@possie-engine/dr-plugin-sdk";

export const comms = new PluginComms({
    defaultConfig: new ConfigYML(),
}) as {
    config: {
        question?: string;
        instruction?: string;
        options?: Array<{ code: string; content: string }>;
    };
    state: unknown;
    renderOnReady: (res: React.ReactNode) => void;
};

const Main: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [mobileStatus, setMobileStatus] = useState(isMobile);

    const callback = useRef<CallbackProps>({
        up: [],
    });

    const valueRef = useRef<{ code: string; content: string }>();
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            setMobileStatus(isMobile);
        };
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
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
                    callback,
                    isMobile: mobileStatus,
                    valueRef,
                }}
            >
                <Warehouse />
                <div className="hr" />
                <StorageCabinet />
            </Context.Provider>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */

void comms.renderOnReady(<Main />);
