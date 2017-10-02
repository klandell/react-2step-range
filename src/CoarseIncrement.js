import React, { Children, cloneElement, PureComponent } from 'react';
import { func, number, object } from 'prop-types';

const valueProps = ['_value'];
const styleProps = ['style'];

export default class CoarseIncrement extends PureComponent {
    static displayName = 'CoarseIncrement';
    
    static propTypes = {
        _onChange: func, // @private use only
        _value: number, // TODO: allow categories?
        step: number,
        valueStyle: object,
        min: number,
        max: number,
        style: object,
    }

    static defaultProps = {
        _onChange: () => {},
        _value: 0,
        step: 1,
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        style: {},
        valueStyle: {},
    }

    constructor(props) {
        super(props);
        this.state = {
            value: null,
            style: {},
        };
    }

    componentWillMount() {
        const { props } = this;

        this.setState({
            value: this.calculateValue(props),
            style: this.calculateStyle(props),
        });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;
        const newState = {};

        if (this.diff(lastProps, nextProps, valueProps)) {
            Object.assign(newState, {
                value: this.calculateValue(nextProps),
            });
        }

        if (this.diff(lastProps, nextProps, styleProps)) {
            Object.assign(newState, {
                style: this.calculateStyle(nextProps),
            });
        }

        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;

        if (value !== nextState.value && nextState.value !== nextProps._value) {
            nextProps._onChange(nextState.value);
        }
    }

    // TODO: pull this to util function
    diff(lastProps, nextProps, keys = []) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (lastProps[key] !== nextProps[key]) {
                return true;
            }
        }
        return false;
    }

    // TODO: pull out into util function
    calculateValue({ _value, max, min }) {
        let val = _value;

        if (_value === null) {
            val = min + ((max - min) / 2);
        } else if (_value < min) {
            val = min;
        } else if (_value > max) {
            val = max;
        }
        return val;
    }

    calculateStyle({ style }) {
        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            ...style,
        };
    }

    findChildrenByType(children, type) {
        const ret = [];
        Children.forEach(children, (child) => {
            const childType = child && child.type && (child.type.displayName || child.type.name);
            if (childType === type) {
                ret.push(child);
            }
        });
        return ret;
    }

    onMinusIconClick = () => {
        this.setState((state, props) => {
            const value = Math.max(props.min, state.value - props.step);
            return { value };
        });
    }

    onPlusIconClick = () => {
        this.setState((state, props) => {
            const value = Math.min(props.max, state.value + props.step);
            return { value };
        });
    }

    renderMinusIcon() {
        const { children } = this.props;
        const minusIcon = this.findChildrenByType(children, 'MinusIcon');

        let ret;
        if (minusIcon.length) {
            ret = cloneElement(minusIcon.slice(-1)[0], {
                _onClick: this.onMinusIconClick,
            });
        }
        return ret;
    }

    renderPlusIcon() {
        const { children } = this.props;
        const plusIcon = this.findChildrenByType(children, 'PlusIcon');

        let ret;
        if (plusIcon.length) {
            ret = cloneElement(plusIcon.slice(-1)[0], {
                _onClick: this.onPlusIconClick,
            });
        }
        return ret;
    }

    render() {
        const { valueStyle } = this.props;
        const { style, value } = this.state;
        return (
            <div style={style}>
                {this.renderMinusIcon()}
                <span style={valueStyle}>{value}</span>
                {this.renderPlusIcon()}
            </div>
        );
    }
}
