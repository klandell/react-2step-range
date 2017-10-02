import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { shallowDiff } from './Utils';
import { MINUS_ICON_CLS } from './Constants';

const styleProps = ['style'];

export default class Icon extends PureComponent {
    static displayName = 'Icon';

    static propTypes = {
        _onClick: func, // @private use only
        height: number.isRequired,
        width: number.isRequired,
        src: string.isRequired,
        alt: string,
        className: string,
        style: object,
    }

    static defaultProps = {
        _onClick: () => {},
        alt: '',
        className: '',
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
        this.setState({ style: this.calculateStyle(props) });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;
        const newState = {};

        if (shallowDiff(lastProps, nextProps, styleProps)) {
            Object.assign(newState, {
                style: this.calculateStyle(nextProps),
            });
        }

        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    calculateStyle({ style }) {
        return { ...styles.button, ...style };
    }

    render() {
        const { _onClick, alt, height, width, className, src } = this.props;
        const { style } = this.state;

        return (
            <button
              className={className}
              style={style}
              onClick={_onClick}
            >
                <img
                  className={`${className}_img`}
                  height={height}
                  width={width}
                  src={src}
                  alt={alt}
                />
            </button>
        );
    }
}

const styles = {
    button: {
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
    }
}
