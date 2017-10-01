import React, { Children, PureComponent } from 'react';
import { func, number, oneOf, shape, string } from 'prop-types';

const baseCls = 'fine-increment_ticks';

// TODO: allow dot to be colored based on current value
const ticksStyleProps = ['_thumbDiameter', '_thumbBorderWidth', '_trackLength', '_trackPadding', 'tickDiameter'];
const tickStyleProps = ['tickDiameter'];
const dotStyleProps = ['tickDiameter', 'tickColor'];
const labelStyleProps = ['labelFontSize'];

export default class Ticks extends PureComponent {
    static propsTypes = {
        _onTickClick: func.isRequired, // @private use only
        _thumbBorderWidth: number.isRequired, // @private use only
        _thumbDiameter: number.isRequired, // @private use only
        _trackPadding: shape({
            left: number,
            right: number,
        }).isRequired, // @private use only
        _trackLength: number.isRequired, // @private use only
        labelFontSize: oneOf(number, string),
        onTickClick: func,
        tickColor: string,
        tickDiameter: number,
    }

    static defaultProps = {
        labelFontSize: 12,
        onTickClick: () => {},
        tickColor: '#000',
        tickDiameter: 7,
    }

    constructor(props) {
        super(props);
        this.state = {
            ticksStyle: {},
            tickStyle: {},
            dotStyle: {},
            labelStyle: {},
        };
    }

    componentWillMount() {
        const { props } = this;

        this.setState({
            ticksStyle: this.calculateTicksStyle(props),
            tickStyle: this.calculateTickStyle(props),
            dotStyle: this.calculateDotStyle(props),
            labelStyle: this.calculateLabelStyle(props),
        });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;
        const newState = {};

        if (this.diff(lastProps, nextProps, ticksStyleProps)) {
            Object.assign(newState, {
                ticksStyle: this.calculateTicksStyle(nextProps),
            });
        }

        if (this.diff(lastProps, nextProps, tickStyleProps)) {
            Object.assign(newState, {
                tickStyle: this.calculateTicksStyle(nextProps),
            });
        }

        if (this.diff(lastProps, nextProps, dotStyleProps)) {
            Object.assign(newState, {
                dotStyle: this.calculateDotStyle(nextProps),
            });
        }

        if (this.diff(lastProps, nextProps, labelStyleProps)) {
            Object.assign(newState, {
                labelStyle: this.calculateLabelStyle(nextProps),
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

    calculateTicksStyle({ _thumbDiameter, _thumbBorderWidth, _trackLength, _trackPadding, tickDiameter }) {
        return {
            listStyle: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            width: (_trackLength - _trackPadding.left - _trackPadding.right) + tickDiameter,
            margin: 0,
            marginLeft: _trackPadding.left - (tickDiameter / 2),
            padding: 0,
            marginTop: 0 - (_thumbDiameter + (_thumbBorderWidth * 1)) - Math.ceil(tickDiameter / 2),
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
        };
    }

    calculateTickStyle({ tickDiameter }) {
        return {
            width: tickDiameter,
        };
    }

    calculateDotStyle({ tickDiameter, tickColor }) {
        return {
            height: tickDiameter,
            width: tickDiameter,
            backgroundColor: tickColor,
            borderRadius: '50%',
        };
    }

    calculateLabelStyle({ labelFontSize }) {
        return {
            marginLeft: '-125%', // TODO: good enough for now but not right
            fontSize: labelFontSize,
        };
    }

    onTickClick = ({ currentTarget }) => {
        const { _onTickClick, onTickClick } = this.props;
        const idx = parseInt(currentTarget.getAttribute('data-idx'), 10);

        _onTickClick(idx);
        onTickClick(idx);
    }

    renderChildren() {
        const { children } = this.props;
        const { tickStyle, dotStyle, labelStyle } = this.state;

        return Children.map(children, (child, i) => (
            <li
              className={`${baseCls}_tick`}
              style={tickStyle}
            >
                <div
                  style={dotStyle}
                  data-idx={i}
                  onClick={this.onTickClick}
                />
                <span
                  onClick={this.onTickClick}
                  data-idx={i}
                  style={labelStyle}
                >{child}</span>
            </li>
        ));
    }

    render() {
        const { ticksStyle } = this.state;
        return (
            <ul className={baseCls} style={ticksStyle}>
                {this.renderChildren()}
            </ul>
        );
    }
}
