/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */

import React from "react";
import { Product } from "./product";
import { OptionProps } from "./unit";
import { useMContext } from "./context";
import { ScrollComponent } from "./Scroll";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */

/** This section will include all the interface for this tsx file */
export interface WarehouseProps {
    list?: Array<OptionProps>;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<WarehouseProps> = ({ list }) => {
    const { isMobile } = useMContext();

    const arr = list ?? [];

    const content = (
        <div className="warehouse_body">
            <div className="placeholder" style={arr.length ? { display: "none" } : {}}>
                暂无可拖拽的选项
            </div>
            <Product list={arr} from="warehouse" />
        </div>
    );
    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span className={`warehouse_totalVal${arr.length ? "" : " red"}`}>
                    {arr.length}
                </span>
                项
            </div>

            {isMobile ? (
                <div className="warehouse_items">{content}</div>
            ) : (
                <ScrollComponent
                    className="warehouse_scrollWrap"
                    bodyClassName="warehouse_scrollBody"
                    hidden={{
                        x: true,
                    }}
                >
                    {content}
                </ScrollComponent>
            )}
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
