/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useRef, useState } from "react";
import { HandleUpFnProps, useMContext } from "./context";
import { comms } from ".";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */

import { hasStorageEl, OptionProps } from "./unit";
import { Product } from "./product";
import { ScrollComponent } from "./Scroll";

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const StorageCabinet: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const { isMobile, callback } = useMContext();

    const [value, setValue] = useState<OptionProps>();

    const [active, setActive] = useState(false);

    const timerOut = useRef<number>();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    useEffect(() => {
        comms.state = value?.code;
    }, [value]);

    useEffect(() => {
        return () => {
            timerOut.current && window.clearTimeout(timerOut.current);
        };
    }, []);

    callback.current.move = (x: number, y: number) => {
        timerOut.current && window.clearTimeout(timerOut.current);

        timerOut.current = window.setTimeout(() => {
            setActive(hasStorageEl(x, y));
        }, 1);
    };

    callback.current.up[0] = (res: HandleUpFnProps) => {
        timerOut.current && window.clearTimeout(timerOut.current);

        const status = hasStorageEl(res.x, res.y);
        if (status && (!value || res.code !== value.code)) {
            setValue({
                code: res.code,
                content: res.content,
            });
        } else if (!status && res.code === value?.code) {
            setValue(undefined);
        }

        setActive(false);
    };

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    const content = (
        <div className="storageCabinet_main">
            <div className="placeholder" style={value ? { display: "none" } : {}}>
                请将答案选项放置在这里
            </div>
            <Product list={value ? [value] : []} />
        </div>
    );

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="storageCabinet_wrap">
            <div
                className={`storageCabinet_container${isMobile ? " scrollBody" : ""}${
                    active ? " active" : ""
                }`}
            >
                {isMobile ? (
                    content
                ) : (
                    <ScrollComponent bodyClassName="scrollBody" hidden={{ x: true }}>
                        {content}
                    </ScrollComponent>
                )}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
