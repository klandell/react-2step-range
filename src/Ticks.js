import React, { Children, PureComponent } from 'react';
import { func, number, oneOfType, shape, string } from 'prop-types';
import { calculateInitialState, calculateNextState } from './Utils';
import { TICKS_CLS } from './Constants';

// TODO: allow dot to be colored based on current value
export default class Ticks extends PureComponent {
    static displayName = 'Ticks';

    static propsTypes = {
        _onTickClick: func.isRequired,
        _thumbBorderWidth: number.isRequired,
        _thumbDiameter: number.isRequired,
        _trackLength: number.isRequired,
        _trackPadding: shape({
            left: number,
            right: number,
        }).isRequired,
        labelFontSize: oneOfType([number, string]),
        tickColor: string,
        tickDiameter: number,
    }

    static defaultProps = {
        labelFontSize: 12,
        tickColor: '#000',
        tickDiameter: 7,
    }

    constructor(props) {
        super(props);
        this.state = {
            dotStyle: {},
            labelStyle: {},
            tickStyle: {},
            ticksStyle: {},
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

    calculateTicksStyle({ _thumbBorderWidth, _thumbDiameter, tickDiameter, _trackLength, _trackPadding }) {
        return {
            ...styles.ticks,
            width: (_trackLength - _trackPadding.left - _trackPadding.right) + tickDiameter,
            margin: 0,
            marginLeft: _trackPadding.left - Math.ceil(tickDiameter / 2),
            padding: 0,
            marginTop: 0 - (_thumbDiameter + (_thumbBorderWidth * 2)) - Math.ceil(tickDiameter / 2),
        };
    }

    calculateTickStyle({ tickDiameter }) {
        return { width: tickDiameter };
    }

    calculateDotStyle({ tickDiameter, tickColor }) {
        return {
            ...styles.dot,
            height: tickDiameter,
            width: tickDiameter,
            backgroundColor: tickColor,
        };
    }

    calculateLabelStyle({ labelFontSize }) {
        return {
            ...styles.label,
            fontSize: labelFontSize,
        };
    }

    onTickClick = ({ currentTarget }) => {
        const { _onTickClick } = this.props;
        const idx = parseInt(currentTarget.getAttribute('data-idx'), 10);
        _onTickClick(idx);
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
    ticksStyle: [
        '_thumbDiameter',
        '_thumbBorderWidth',
        '_trackLength',
        '_trackPadding',
        'tickDiameter',
    ],
    tickStyle: ['tickDiameter'],
    dotStyle: ['tickDiameter', 'tickColor'],
    labelStyle: ['labelFontSize'],
};

const styles = {
    dot: {
        borderRadius: '50%',
    },
    label: {
        marginLeft: '-125%', // TODO: good enough for now but not right
    },
    ticks: {
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
};
