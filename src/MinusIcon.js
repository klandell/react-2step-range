import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { shallowDiff } from './Utils';
import { MINUS_ICON_CLS } from './Constants';

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
              className={MINUS_ICON_CLS}
            >
                <img
                  height={height}
                  width={width}
                  src={src}
                  alt="minus"
                  className={`${MINUS_ICON_CLS}_img`}
                />
            </button>
        );
    }
}
