const toMs = (s: string) => (s ? Number(s.slice(0, -1)) * 1000 : 0);

export interface OptionProps {
    code: string;
    content: string;
}

export const getTimeout = (delays: string[], durations: string[]): number =>
    delays.length > durations.length
        ? Math.max(...delays.map((item, n) => toMs(item) + toMs(durations[n])))
        : Math.max(...durations.map((item, n) => toMs(item) + toMs(delays[n])));
/**
 *
 * @param {HTMLElement} el
 * @returns {timeout: number;propCount: number;}
 */
export const getTransitionAttr = (
    el: HTMLElement,
): {
    timeout: number;
    propCount: number;
} => {
    const styles = window.getComputedStyle(el);

    const transitionDelays = styles.transitionDelay.split(", ");
    const transitionDurations = styles.transitionDuration.split(", ");

    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);

    let timeout = 0;
    let propCount = 0;
    if (transitionTimeout > 0) {
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
    }

    return {
        timeout,
        propCount,
    };
};

/**
 * 新增class
 */
export const addClass = (el: HTMLElement, c: string): void => {
    const classNameList = el.getAttribute("class")?.split(" ");
    if (classNameList) {
        if (!classNameList.includes(c)) {
            classNameList.push(c);
        }
        el.setAttribute("class", classNameList.join(" "));
    } else {
        el.setAttribute("class", c);
    }
};

/**
 * 移出class
 */

export const removeClass = (el: HTMLElement, c: string): void => {
    const classNameList = el.getAttribute("class")?.split(" ");
    const n = classNameList?.findIndex((item) => item === c);
    if (typeof n === "number" && n >= 0) {
        classNameList?.splice(n);
    }
    if (classNameList?.length) {
        el.setAttribute("class", classNameList.join(" "));
    } else {
        el.removeAttribute("class");
    }
};

export const getMatrixAttr = (
    el: HTMLElement,
): {
    scaleX: string;
    skewY: string;
    skewX: string;
    scaleY: string;
    translateX: string;
    translateY: string;
} | null => {
    const attr = window.getComputedStyle(el, null).transform;

    if (attr.includes("matrix")) {
        const attrArr = attr.replace(/(matrix|[()])/g, "").split(",");
        return {
            scaleX: attrArr[0],
            skewY: attrArr[1],
            skewX: attrArr[2],
            scaleY: attrArr[3],
            translateX: attrArr[4],
            translateY: attrArr[5],
        };
    } else {
        return null;
    }
};

export const deepCloneData = <T>(data: T): T => {
    const d = data ? JSON.parse(JSON.stringify(data)) : undefined;
    return d as T;
};

export interface PointProps {
    pageX: number;
    pageY: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ConfigProps {
    config: {
        question?: string;
        instruction?: string;
        options: Array<{
            code: string;
            content: string;
        }>;
    };
}

/**
 * 当前点位是否包含了 storageCabinet这个组件里的element
 * @param {number} x pageX
 * @param {number} y pageY
 * @returns {boolean}
 */
export const hasStorageEl = (x: number, y: number): boolean => {
    const els = document.elementsFromPoint(x, y);

    let status = false;
    for (let i = 0; i < els.length; ) {
        const el = els[i];
        const classAttr = el.getAttribute("class")?.split(" ") ?? [];

        const overOnStorage = classAttr.includes("storageCabinet_container");
        if (overOnStorage) {
            status = true;
            i = els.length;
        } else {
            ++i;
        }
    }
    return status;
};
