import React, { Children, cloneElement } from 'react';

export const findChildrenByType = (children, type) => {
    const ret = [];
    Children.forEach(children, (child) => {
        const childType = child && child.type && (child.type.displayName || child.type.name);
        if (childType === type) {
            ret.push(child);
        }
    });
    return ret;
};

export const findChildByType = (children, type) => {
    const childrenByType = findChildrenByType(children, type);
    return childrenByType.slice(-1)[0] || false;
};

export function renderChildOfType(type, extraProps) {
    const child = findChildByType(this.props.children, type);
    return child && cloneElement(child, extraProps);
}

export const shallowDiff = (last, next, keys = []) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (last[key] !== next[key]) {
            return true;
        }
    }
    return false;
};

export const capitalize = (str) => {
    const words = str.split(' ');
    return words.map(w => `${w.substr(0, 1).toUpperCase()}${w.slice(1)}`).join(' ');
};

export function calculateInitialState(diffProps, fnPrefix = 'calculate') {
    const initialState = {};

    Object.keys(diffProps).forEach((k) => {
        Object.assign(initialState, {
            [k]: this[`${fnPrefix}${capitalize(k)}`](this.props),
        });
    });
    return initialState;
}

export function calculateNextState(nextProps, diffProps, fnPrefix = 'calculate') {
    const nextState = {};

    Object.keys(diffProps).forEach((k) => {
        if (shallowDiff(this.props, nextProps, diffProps[k])) {
            Object.assign(nextState, {
                [k]: this[`${fnPrefix}${capitalize(k)}`](nextProps),
            });
        }
    });
    return nextState;
}

export const calculateNumericValue = (value, max, min) => {
    let ret = value;

    if (value === null) {
        ret = min + ((max - min) / 2);
    } else if (value < min) {
        ret = min;
    } else if (value > max) {
        ret = max;
    }
    return ret;
};
