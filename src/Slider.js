import React, { Children, cloneElement, PureComponent } from 'react';
import { func, oneOfType, shape, number } from 'prop-types';

export default class Slider extends PureComponent {
    static propTypes = {
        value: oneOfType([shape({
            coarse: number,
            fine: number,
        }), shape({
            fine: number,
        })]).isRequired,
        onChange: func,
    }

    static defaultProps = {
        onChange: () => {},
    }

    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    componentWillMount() {
        const { value } = this.props;
        this.setState({ value });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;

        if (lastProps.value !== nextProps.value) {
            this.setState({ value: nextProps.value });
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
        return (
            <div>
                {this.renderCoarseIncrement()}
                {this.renderFineIncrement()}
            </div>
        );
    }
}
