import React, { Children, cloneElement, PureComponent } from 'react';
import { func, number, object } from 'prop-types';
import { findChildByType, calculateInitialState, calculateNextState } from './Utils';
import { COARSE_INCREMENT_CLS } from './Constants';

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
        this.setState(calculateInitialState.call(this, diffProps));
    }

    componentWillReceiveProps(nextProps) {
        const nextState = calculateNextState.call(this, nextProps, diffProps);
        if (Object.keys(nextState).length) {
            this.setState(nextState);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;

        if (value !== nextState.value && nextState.value !== nextProps._value) {
            nextProps._onChange(nextState.value);
        }
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
        const minusIcon = findChildByType(children, 'MinusIcon');

        let ret;
        if (minusIcon) {
            ret = cloneElement(minusIcon, {
                _onClick: this.onMinusIconClick,
            });
        }
        return ret;
    }

    renderPlusIcon() {
        const { children } = this.props;
        const plusIcon = findChildByType(children, 'PlusIcon');

        let ret;
        if (plusIcon) {
            ret = cloneElement(plusIcon, {
                _onClick: this.onPlusIconClick,
            });
        }
        return ret;
    }

    render() {
        const { valueStyle } = this.props;
        const { style, value } = this.state;
        return (
            <div className={COARSE_INCREMENT_CLS} style={style}>
                {this.renderMinusIcon()}
                <span
                  className={`${COARSE_INCREMENT_CLS}_value`}
                  style={valueStyle}
                >{value}</span>
                {this.renderPlusIcon()}
            </div>
        );
    }
}

const diffProps = {
    value: ['_value'],
    style: ['style'],
};
