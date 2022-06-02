/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */

import React, { useState } from "react";
import { Product } from "./product";
import { hasStorageEl } from "./unit";
import { comms } from ".";
import { HandleUpFnProps, useMContext } from "./context";
import { ScrollComponent } from "./Scroll";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */

/** This section will include all the interface for this tsx file */

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC = () => {
    const { isMobile, callback, valueRef } = useMContext();

    const [list, setList] = useState(
        (comms?.config.options ?? []).map((item) => ({
            code: item.code,
            content: item.content,
        })),
    );

    callback.current.up[1] = (res: HandleUpFnProps) => {
        const arr = (comms?.config.options ?? []).map((item) => ({
            code: item.code,
            content: item.content,
        }));

        const _arr: {
            code: string;
            content: string;
        }[] = [];

        const status = hasStorageEl(res.x, res.y);
        let n: null | number = null;
        for (let i = 0; i < arr.length; ) {
            const item = arr[i];
            if (item.code === res.code && status) {
                n = i;
                i = arr.length;
            } else {
                ++i;
            }
        }

        for (let i = 0; i < arr.length; ) {
            const item = arr[i];
            if (
                (!valueRef.current || item.code !== valueRef.current.code) &&
                (typeof n !== "number" || i !== n)
            ) {
                _arr.push({
                    ...item,
                });
            }
            ++i;
        }

        setList([..._arr]);
    };
    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span className={`warehouse_totalVal${list.length ? "" : " red"}`}>
                    {list.length}
                </span>
                项
            </div>

            {isMobile ? (
                <div className="warehouse_items">
                    <div className="warehouse_body">
                        <div
                            className="placeholder"
                            style={list?.length ? { display: "none" } : {}}
                        >
                            暂无可拖拽的选项
                        </div>
                        <Product list={list} />
                    </div>
                </div>
            ) : (
                <ScrollComponent
                    className="warehouse_scrollWrap"
                    bodyClassName="warehouse_scrollBody"
                    hidden={{
                        x: true,
                    }}
                >
                    <div className="warehouse_body">
                        <div
                            className="placeholder"
                            style={list?.length ? { display: "none" } : {}}
                        >
                            暂无可拖拽的选项
                        </div>
                        <Product list={list} />
                    </div>
                </ScrollComponent>
            )}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
