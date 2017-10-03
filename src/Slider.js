import React, { cloneElement, PureComponent } from 'react';
import { func, object, oneOfType, shape, number } from 'prop-types';
import { findChildByType, calculateNextState } from './Utils';
import { SLIDER_CLS } from './Constants';

export default class Slider extends PureComponent {
    static displayName = 'Slider';

    static propTypes = {
        value: oneOfType([shape({
            coarse: number,
            fine: number,
        }), shape({
            fine: number,
        })]).isRequired,
        height: number.isRequired,
        width: number.isRequired,
        style: object,
        onChange: func,
    }

    static defaultProps = {
        onChange: () => {},
        style: {},
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
            value: props.value,
            style: this.calculateStyle(props),
        });
    }

    componentWillReceiveProps(nextProps) {
        const nextState = calculateNextState.call(this, nextProps, diffProps);
        if (Object.keys(nextState).length) {
            this.setState(nextState);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;

        if (
            (value.coarse !== nextState.value.coarse && nextState.value.coarse !== nextProps.value.coarse) ||
            (value.fine !== nextState.value.fine && nextState.value.fine !== nextProps.value.fine)
        ) {
            nextProps.onChange(nextState.value);
        }
    }

    calculateStyle({ height, width, style }) {
        return {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height,
            width,
            ...style,
        };
    }

    onCoarseIncrementChange = (coarse) => {
        this.setState(state => ({
            value: {
                ...state.value,
                coarse,
            },
        }));
    }

    onFineIncrementChange = (fine) => {
        this.setState(state => ({
            value: {
                ...state.value,
                fine,
            },
        }));
    }

    renderCoarseIncrement() {
        const { children } = this.props;
        const { value } = this.state;
        const coarseIncrement = findChildByType(children, 'CoarseIncrement');

        let ret;
        if (coarseIncrement) {
            ret = cloneElement(coarseIncrement, {
                _onChange: this.onCoarseIncrementChange,
                _value: value.coarse,
            });
        }
        return ret;
    }

    renderFineIncrement() {
        const { children } = this.props;
        const { value } = this.state;
        const fineIncrement = findChildByType(children, 'FineIncrement');

        let ret;
        if (fineIncrement) {
            ret = cloneElement(fineIncrement, {
                _onChange: this.onFineIncrementChange,
                _value: value.fine,
            });
        }
        return ret;
    }

    render() {
        const { style } = this.state;
        return (
            <div className={SLIDER_CLS} style={style}>
                {this.renderCoarseIncrement()}
                {this.renderFineIncrement()}
            </div>
        );
    }
}

const diffProps = {
    value: ['value'],
    style: ['height', 'width'],
};
