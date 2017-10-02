import React, { Children, cloneElement, PureComponent } from 'react';
import { func, object, oneOfType, shape, number } from 'prop-types';

const baseCls = 'react-2step-range';
const valueProps = ['value'];
const styleProps = ['height', 'width'];

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
        const lastProps = this.props;
        const newState = {};

        if (this.diff(lastProps, nextProps, valueProps)) {
            Object.assign(newState, {
                value: nextProps.value,
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

    renderCoarseIncrement() {
        const { children } = this.props;
        const { value } = this.state;
        const coarseIncrement = this.findChildrenByType(children, 'CoarseIncrement');

        let ret;
        if (coarseIncrement.length) {
            ret = cloneElement(coarseIncrement.slice(-1)[0], {
                _onChange: this.onCoarseIncrementChange,
                _value: value.coarse,
            });
        }
        return ret;
    }

    renderFineIncrement() {
        const { children } = this.props;
        const { value } = this.state;
        const fineIncrement = this.findChildrenByType(children, 'FineIncrement');

        let ret;
        if (fineIncrement.length) {
            ret = cloneElement(fineIncrement.slice(-1)[0], {
                _onChange: this.onFineIncrementChange,
                _value: value.fine,
            });
        }
        return ret;
    }

    render() {
        const { style } = this.state;
        return (
            <div className={baseCls} style={style}>
                {this.renderCoarseIncrement()}
                {this.renderFineIncrement()}
            </div>
        );
    }
}
