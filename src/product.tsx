/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { stopSelect } from "./Scroll/Unit/noSelected";
import { useMContext } from "./context";
import { getScrollValue } from "./getScrollValue";
import { OptionProps, PointProps } from "./unit";
import spider from "./Assets/svg/spider.svg";
import pumpkin from "./Assets/svg/pumpkin.svg";

/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface ProductProps {
    list: Array<OptionProps>;
    from: "warehouse" | "storageCabinet";
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Product: React.FC<ProductProps> = ({ list, from }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const { isMobile, valueChangeCallback, moveCallBack, upCallBack } = useMContext();

    const selectedFn = useRef<typeof document.onselectstart>(null);

    const point = useRef<PointProps>({
        pageX: 0,
        pageY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const selectRef = useRef<OptionProps>();

    const [selectItem, setSelectItem] = useState(
        selectRef.current ? { ...selectRef.current } : undefined,
    );

    const [position, setPosition] = useState<PointProps>();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    // 当移动时
    const handleMove = (e: MouseEvent | React.TouchEvent<HTMLDivElement>) => {
        if (!selectRef.current) {
            return;
        }
        let x = 0;
        let y = 0;

        if (e instanceof MouseEvent) {
            x = e.pageX;
            y = e.pageY;
            moveCallBack.current(e.clientX, e.clientY);
        } else {
            const position = e.changedTouches[0];
            x = position.pageX;
            y = position.pageY;
            moveCallBack.current(position.clientX, position.clientY);
        }
        const moveX = x - point.current.pageX;
        const moveY = y - point.current.pageY;

        point.current.x = moveX + point.current.x;
        point.current.y = moveY + point.current.y;
        point.current.pageX = x;
        point.current.pageY = y;

        setPosition({
            ...point.current,
        });
    };

    // 当鼠标 或者手 弹起时的通用事件
    const handleUp = (x: number, y: number) => {
        if (!selectRef.current) {
            return;
        }
        upCallBack.current();
        document.onselectstart = selectedFn.current;
        point.current = {
            x: 0,
            y: 0,
            pageX: 0,
            pageY: 0,
            width: 0,
            height: 0,
        };
        valueChangeCallback({
            x,
            y,
            data: {
                code: selectRef.current.code,
                content: selectRef.current.content,
            },
            from,
        });
        setPosition(undefined);
        selectRef.current = undefined;
        setSelectItem(undefined);
    };

    // 当鼠标弹起时
    const handleMouseUp = (e: MouseEvent) => {
        handleUp(e.clientX, e.clientY);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    // 当手离开屏幕时
    const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
        const data = e.changedTouches[0];
        handleUp(data.clientX, data.clientY);
    };

    // 手或者鼠标 按下的通用事件
    const handleDown = (
        item: OptionProps,
        e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>,
        position: {
            x: number;
            y: number;
        },
    ) => {
        selectRef.current = {
            code: item.code,
            content: item.content,
        };
        setSelectItem({
            ...selectRef.current,
        });

        stopSelect(e, selectedFn, true);

        const scrollData = getScrollValue();
        const rect = e.currentTarget.getBoundingClientRect();
        const rectX = rect.left + scrollData.x;
        const rectY = rect.top + scrollData.y;

        point.current = {
            pageX: position.x,
            pageY: position.y,
            x: rectX,
            y: rectY,
            width: rect.width,
            height: rect.height,
        };
        setPosition({
            ...point.current,
        });
    };

    // 当鼠标按下时
    const handleMouseDown = (
        item: OptionProps,
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        handleDown(item, e, {
            x: e.pageX,
            y: e.pageY,
        });
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    //当手触摸时
    const handleTouchStart = (item: OptionProps, e: React.TouchEvent<HTMLDivElement>) => {
        const position = e.changedTouches[0];
        e.stopPropagation();
        handleDown(item, e, {
            x: position.pageX,
            y: position.pageY,
        });
    };

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <>
            {list.map((item) => {
                return (
                    <div
                        className={`item${selectItem?.code === item.code ? " gray" : ""}`}
                        key={item.code}
                        {...(isMobile
                            ? {
                                  onTouchStart: (e) => {
                                      handleTouchStart(item, e);
                                  },
                                  onTouchMove: handleMove,
                                  onTouchEnd: handleTouchEnd,
                              }
                            : {
                                  onMouseDown: (e) => {
                                      handleMouseDown(item, e);
                                  },
                              })}
                    >
                        <div className="itemBg1" />
                        <div className="itemBg2" />
                        <div className="itemBg3" />
                        <div
                            className="itemBg4"
                            dangerouslySetInnerHTML={{
                                __html: pumpkin,
                            }}
                        />
                        <div
                            className="itemBg5"
                            dangerouslySetInnerHTML={{
                                __html: spider,
                            }}
                        />

                        <span
                            className="itemContent"
                            dangerouslySetInnerHTML={{
                                __html: item.content,
                            }}
                        />
                    </div>
                );
            })}

            {!!position &&
                createPortal(
                    <div
                        className="floating"
                        style={{
                            left: `${position.x}px`,
                            top: `${position.y}px`,
                            width: `${position.width}px`,
                            height: `${position.height}px`,
                        }}
                    >
                        <div className="itemBg1" />
                        <div className="itemBg2" />
                        <div className="itemBg3" />
                        <div
                            className="itemBg4"
                            dangerouslySetInnerHTML={{
                                __html: pumpkin,
                            }}
                        />
                        <div
                            className="itemBg5"
                            dangerouslySetInnerHTML={{
                                __html: spider,
                            }}
                        />

                        <span
                            className="itemContent"
                            dangerouslySetInnerHTML={{
                                __html: selectItem?.content ?? "",
                            }}
                        />
                    </div>,
                    document.querySelector("body>div") ?? document.body,
                )}
        </>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
