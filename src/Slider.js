import React, { PureComponent } from 'react';
import { func, object, oneOfType, shape, number } from 'prop-types';
import { calculateInitialState, calculateNextState, renderChildOfType } from './Utils';
import { SLIDER_CLS } from './Constants';

export default class Slider extends PureComponent {
    static displayName = 'Slider';

    static propTypes = {
        height: number.isRequired,
        onChange: func,
        style: object,
        value: oneOfType([shape({
            coarse: number,
            fine: number,
        }), shape({
            fine: number,
        })]).isRequired,
        width: number.isRequired,
    }

    static defaultProps = {
        onChange: () => {},
        style: {},
    }

    constructor(props) {
        super(props);
        this.state = {
            style: {},
            value: null,
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

    // TODO: clean this up
    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;

        if (
            (value.coarse !== nextState.value.coarse && nextState.value.coarse !== nextProps.value.coarse) ||
            (value.fine !== nextState.value.fine && nextState.value.fine !== nextProps.value.fine)
        ) {
            nextProps.onChange(nextState.value);
        }
    }

    onCoarseIncrementChange = (coarse) => {
        this.setState(state => ({
            value: { ...state.value, coarse },
        }));
    }

    onFineIncrementChange = (fine) => {
        this.setState(state => ({
            value: { ...state.value, fine },
        }));
    }

    calculateStyle({ height, width, style }) {
        return {
            ...styles.slider,
            height,
            width,
            ...style,
        };
    }

    calculateValue({ value }) {
        return value;
    }

    renderCoarseIncrement() {
        const { value } = this.state;
        return renderChildOfType.call(this, 'CoarseIncrement', {
            _onChange: this.onCoarseIncrementChange,
            _value: value.coarse,
        });
    }

    renderFineIncrement() {
        const { value } = this.state;
        return renderChildOfType.call(this, 'FineIncrement', {
            _onChange: this.onFineIncrementChange,
            _value: value.fine,
        });
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
    style: ['height', 'width'],
    value: ['value'],
};

const styles = {
    slider: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
};
