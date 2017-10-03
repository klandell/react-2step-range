import React, { Children } from 'react';

export const findChildrenByType = (children, type) => {
    const ret = [];
    Children.forEach(children, (child) => {
        const childType = child && child.type && (child.type.displayName || child.type.name);
        if (childType === type) {
            ret.push(child);
        }
    });
    return ret;
}

export const findChildByType = (children, type) => {
    const childrenByType = findChildrenByType(children, type);
    return childrenByType.slice(-1)[0] || false;
}

export const shallowDiff(last, next, keys = []) => {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (last[key] !== next[key]) {
            return true;
        }
    }
    return false;
}

export const calculateNextState = function(lastProps, nextProps, diffProps, fnPrefix = 'calculate') {
    const nextState = {};

    Object.keys(diffProps).forEach((k) => {
        if (shallowDiff(lastProps, nextProps, diffProps[k])) {
            Object.assign(newState, {
                [k]: this[`${fnPrefix}${k.toUpperCase()}`](nextProps),
            });
        }
    });
    return nextState;
}
