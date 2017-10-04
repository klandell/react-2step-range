import React, { PureComponent } from 'react';
import { array, func, number, oneOfType, shape, string } from 'prop-types';
import { calculateInitialState, calculateNextState } from './Utils';
import { TICKS_CLS } from './Constants';

export default class Ticks extends PureComponent {
    static displayName = 'Ticks';

    static propsTypes = {
        _onTickClick: func.isRequired,
        _activeTrackColor: string.isRequired,
        _pctFill: number.isRequired,
        _thumbBorderWidth: number.isRequired,
        _thumbDiameter: number.isRequired,
        _trackColor: string.isRequired,
        _trackLength: number.isRequired,
        _trackPadding: shape({
            left: number,
            right: number,
        }).isRequired,
        labelFontSize: oneOfType([number, string]),
        labels: array.isRequired,
        tickColor: string,
        tickDiameter: number,
    }

    static defaultProps = {
        labelFontSize: 12,
        tickColor: null,
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

    calculateDotStyle({ tickDiameter, tickColor, _trackColor }) {
        return {
            ...styles.dot,
            height: tickDiameter,
            width: tickDiameter,
            backgroundColor: tickColor || _trackColor,
        };
    }

    calculateLabelStyle({ labelFontSize, tickDiameter }) {
        return {
            ...styles.label,
            fontSize: labelFontSize,
            transform: `translateX(calc(${Math.ceil(tickDiameter / 2)}px - 50%))`,
        };
    }

    onTickClick = ({ currentTarget }) => {
        const { labels, _onTickClick } = this.props;
        const idx = parseInt(currentTarget.getAttribute('data-idx'), 10);
        _onTickClick(idx, labels.length);
    }

    renderLabels() {
        const { labels, _activeTrackColor, _pctFill } = this.props;
        const { tickStyle, dotStyle, labelStyle } = this.state;
        const labelCount = labels.length;

        return labels.map((label, i) => {
            const isActive = _pctFill >= (i / (labelCount - 1));

            let currentDotStyle;
            if (isActive) {
                currentDotStyle = { ...dotStyle, backgroundColor: _activeTrackColor };
            } else {
                currentDotStyle = dotStyle;
            }

            return (
                <li
                  className={`${TICKS_CLS}_tick`}
                  style={tickStyle}
                  key={label.key || i}
                >
                    <div
                      style={currentDotStyle}
                      data-idx={i}
                    />
                    <span
                      onClick={this.onTickClick}
                      data-idx={i}
                      style={labelStyle}
                      role="button"
                      tabIndex="0"
                    >{label}</span>
                </li>
            );
        });
    }

    render() {
        const { ticksStyle } = this.state;
        return (
            <ul className={TICKS_CLS} style={ticksStyle}>
                {this.renderLabels()}
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
        position: 'absolute',
        outline: 'none',
        marginTop: 2,
    },
    ticks: {
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
    },
};
