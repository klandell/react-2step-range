import React, { Children, PureComponent } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import { calculateInitialState, calculateNextState } from './Utils';
import { TICKS_CLS } from './Constants';

// TODO: allow dot to be colored based on current value
export default class Ticks extends PureComponent {
    static displayName = 'Ticks';

    static propsTypes = {
        _onTickClick: func.isRequired, // @private use only
        _thumbBorderWidth: number.isRequired, // @private use only
        _thumbDiameter: number.isRequired, // @private use only
        _trackPadding: shape({
            left: number,
            right: number,
        }).isRequired, // @private use only
        _trackLength: number.isRequired, // @private use only
        labelFontSize: oneOfType([number, string]),
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
        this.setState(calculateInitialState(this.props));
    }

    componentWillReceiveProps(nextProps) {
        const nextState = calculateNextState(this.props, nextProps, diffProps);
        if (Object.keys(nextState).length) {
            this.setState(nextState);
        }
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
            marginTop: 0 - (_thumbDiameter + (_thumbBorderWidth * 2)) - Math.ceil(tickDiameter / 2),
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
              className={`${TICKS_CLS}_tick`}
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
            <ul className={TICKS_CLS} style={ticksStyle}>
                {this.renderChildren()}
            </ul>
        );
    }
}

const diffProps = {
    ticksStyle: ['_thumbDiameter', '_thumbBorderWidth', '_trackLength', '_trackPadding', 'tickDiameter'],
    tickStyle: ['tickDiameter'],
    dotStyle: ['tickDiameter', 'tickColor'],
    labelStyle: ['labelFontSize'],
}
