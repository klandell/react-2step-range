import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';

const styleProps = ['style'];

export default class MinusIcon extends PureComponent {
    static displayName = 'MinusIcon';

    static propTypes = {
        _onClick: func, // @private use only
        height: number.isRequired, // TODO: rename these to reference icon height
        width: number.isRequired,
        src: string.isRequired,
        style: object,
    }

    static defaultProps = {
        _onClick: () => {},
        style: {},
    }

    constructor(props) {
        super(props);
        this.state = {
            style: {},
        };
    }

    componentWillMount() {
        const { props } = this;
        this.setState({
            style: this.calculateStyle(props),
        });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;
        const newState = {};

        if (this.diff(lastProps, nextProps, styleProps)) {
            Object.assign(newState, {
                style: this.calculateStyle(nextProps),
            });
        }

        if (Object.keys(newState).length) {
            this.setState(newState);
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

    calculateStyle({ style }) {
        return {
            border: 'none',
            outline: 'none',
            background: 'transparent',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            ...style,
        };
    }

    render() {
        const { _onClick, height, width, src } = this.props;
        const { style } = this.state;
        return (
            <button
              style={style}
              onClick={_onClick}
            >
                <img
                  height={height}
                  width={width}
                  src={src}
                  alt="minus"
                />
            </button>
        );
    }
}
