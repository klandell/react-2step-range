import React, { PureComponent } from 'react';
import { func, number, shape, string } from 'prop-types';
import {
    calculateInitialState,
    calculateNextState,
    calculateNumericValue,
    findClosestIdx,
    renderChildOfType,
} from './Utils';
import { FINE_INCREMENT_CLS } from './Constants';

export default class FineIncrement extends PureComponent {
    static displayName = 'FineIncrement';

    static propTypes = {
        _onChange: func,
        _value: number,
        activeTrackColor: string,
        max: number.isRequired,
        min: number.isRequired,
        onChange: func,
        step: number,
        thumbBorderColor: string,
        thumbBorderWidth: number,
        thumbColor: string,
        thumbDiameter: number,
        trackColor: string,
        trackLength: number.isRequired,
        trackPadding: shape({
            left: number,
            right: number,
        }),
        trackWidth: number,
    }

    static defaultProps = {
        _onChange: () => {},
        _value: null,
        activeTrackColor: null,
        onChange: () => {},
        step: 1,
        thumbBorderColor: '#000',
        thumbBorderWidth: 0,
        thumbColor: '#000',
        thumbDiameter: 11,
        trackColor: '#000',
        trackPadding: { left: 0, right: 0 },
        trackWidth: 1,
    }

    constructor(props) {
        super(props);
        this.state = {
            activeTrackStyle: {},
            stops: [],
            thumbContainerStyle: {},
            thumbStyle: {},
            trackContainerStyle: {},
            trackStyle: {},
            values: [],
            value: null,
        };
        this.isSlidable = false;
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

    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;
        if (value !== nextState.value && nextState.value !== nextProps._value) {
            nextProps._onChange(nextState.value);
        }
    }

    onThumbContainerClick = ({ clientX, currentTarget }) => {
        // TODO: break this into a function too!!
        const clickLocation = (clientX - currentTarget.getBoundingClientRect().left);
        this.setState(state => ({
            value: this.calculateValueFromPosition(state, clickLocation),
        }));
    }

    onThumbContainerMouseDown = ({ button }) => {
        if (button === 0) {
            this.isSlidable = true;
        }
    }

    onThumbContainerTouchStart = () => {
        this.isSlidable = true;
    }

    onThumbContainerMouseUpTouchEnd = () => {
        this.isSlidable = false;
    }

    onMouseMove = ({ clientX }) => {
        // TODO: combine with onThumbContainerClick fn and onTouchMove
        // TODO: move this event to the window instead?
        if (this.isSlidable) {
            const mouseLocation = clientX - this.thumbContainer.getBoundingClientRect().left;
            this.setState(state => ({
                value: this.calculateValueFromPosition(state, mouseLocation),
            }));
        }
    }

    onTouchMove = ({ touches }) => {
        // TODO: combine with onThumbContainerClick fn?
        // TODO: move this event to the window instead?
        if (this.isSlidable && (typeof touches !== 'undefined')) {
            const touchLocation = touches[0].clientX - this.thumbContainer.getBoundingClientRect().left;
            this.setState(state => ({
                value: this.calculateValueFromPosition(state, touchLocation),
            }));
        }
    }

    onTickClick = (idx) => {
        // TODO: this shouldn't actually use IDX, doesn't work if less ticks than values
        this.setState(state => ({
            value: state.values[idx],
        }));
    }

    onMinusIconClick = () => {
        this.setState((state, props) => ({
            value: Math.max(props.min, state.value - props.step),
        }));
    }

    onPlusIconClick = () => {
        this.setState((state, props) => ({
            value: Math.min(props.max, state.value + props.step),
        }));
    }

    calculateTrackContainerStyle({ trackWidth }) {
        return { ...styles.trackContainer, height: trackWidth };
    }

    calculateActiveTrackStyle(props) {
        const { activeTrackColor, trackColor, trackWidth, trackPadding } = props;
        const value = this.calculateValue(props);
        const stops = this.calculateStops(props);
        const position = this.calculatePositionFromValue(props, stops, value);

        return {
            ...styles.activeTrack,
            width: position - trackPadding.left,
            backgroundColor: activeTrackColor || trackColor,
            height: trackWidth,
            marginLeft: trackPadding.left,
        };
    }

    calculateTrackStyle({ trackLength, trackWidth, trackColor, trackPadding }) {
        return {
            ...styles.track,
            width: trackLength,
            height: trackWidth,
            backgroundColor: trackColor,
            paddingLeft: trackPadding.left,
            paddingRight: trackPadding.right,
        };
    }

    calculateThumbContainerStyle({ thumbDiameter, thumbBorderWidth }) {
        return {
            ...styles.thumbContainer,
            bottom: Math.ceil((thumbDiameter + (thumbBorderWidth * 2)) / 2),
        };
    }

    calculateThumbStyle({ thumbBorderWidth, thumbBorderColor, thumbColor, thumbDiameter }) {
        return {
            ...styles.thumb,
            height: thumbDiameter,
            width: thumbDiameter,
            backgroundColor: thumbColor,
            border: `${thumbBorderWidth}px solid ${thumbBorderColor}`,
            right: Math.ceil((thumbDiameter + (thumbBorderWidth * 2)) / 2),
        };
    }

    calculateStops({ max, min, step, trackLength, trackPadding }) {
        const { left, right } = trackPadding;

        const usableTrack = trackLength - left - right;
        const stepCount = (max - min) / step;
        const realStep = usableTrack / stepCount;

        let previousStop = left;
        const stops = [previousStop];

        for (let i = 1; i <= stepCount; i++) {
            previousStop += realStep;
            stops.push(previousStop);
        }
        return stops;
    }

    calculateValue({ _value, max, min }) {
        return calculateNumericValue(_value, max, min);
    }

    calculateValues({ max, min, step }) {
        return new Array(Math.floor(((max - min) + 1) / step))
          .fill()
          .map((d, i) => (i * step) + min);
    }

    calculatePositionFromValue(props, stops, value) {
        const values = this.calculateValues(props);
        const val = value === null ? this.state.value : value;
        return (stops || this.state.stops)[findClosestIdx(values, val)];
    }

    calculateValueFromPosition({ stops, values }, position) {
        return values[findClosestIdx(stops, position)];
    }

    renderMinusIcon() {
        return renderChildOfType.call(this, 'MinusIcon', {
            _onClick: this.onMinusIconClick,
        });
    }

    renderPlusIcon() {
        return renderChildOfType.call(this, 'PlusIcon', {
            _onClick: this.onPlusIconClick,
        });
    }

    renderTicks() {
        const { thumbBorderWidth, thumbDiameter, trackPadding, trackLength } = this.props;
        return renderChildOfType.call(this, 'Ticks', {
            _onTickClick: this.onTickClick,
            _thumbBorderWidth: thumbBorderWidth,
            _thumbDiameter: thumbDiameter,
            _trackPadding: trackPadding,
            _trackLength: trackLength,
        });
    }

    render() {
        const {
          trackContainerStyle,
          activeTrackStyle,
          trackStyle,
          thumbContainerStyle,
          thumbStyle,
        } = this.state;

        return (
            <div
              className={`${FINE_INCREMENT_CLS}`}
              style={styles.fineIncrement}
              onMouseMove={this.onMouseMove}
              onTouchMove={this.onTouchMove}
            >
                {this.renderMinusIcon()}
                <div style={trackContainerStyle}>
                    <div
                      className={`${FINE_INCREMENT_CLS}_track`}
                      style={trackStyle}
                    />
                    <div
                      className={`${FINE_INCREMENT_CLS}_thumb-container`}
                      style={thumbContainerStyle}
                      onClick={this.onThumbContainerClick}
                      onMouseDown={this.onThumbContainerMouseDown}
                      onTouchStart={this.onThumbContainerTouchStart}
                      onTouchEnd={this.onThumbContainerMouseUpTouchEnd}
                      onMouseUp={this.onThumbContainerMouseUpTouchEnd}
                      ref={(c) => { this.thumbContainer = c; }}
                    >
                        <div
                          className={`${FINE_INCREMENT_CLS}_active-track`}
                          style={activeTrackStyle}
                        />
                        <div
                          className={`${FINE_INCREMENT_CLS}_thumb`}
                          style={thumbStyle}
                        />
                    </div>
                    {this.renderTicks()}
                </div>
                {this.renderPlusIcon()}
            </div>
        );
    }
}

const diffProps = {
    activeTrackStyle: [
        'activeTrackColor',
        'trackColor',
        'trackWidth',
        'max',
        'min',
        'step',
        'trackLength',
        'trackPadding',
        '_value',
    ],
    stops: ['max', 'min', 'step', 'trackLength', 'trackPadding'],
    thumbContainerStyle: ['thumbDiameter', 'thumbBorderWidth'],
    thumbStyle: ['thumbBorderColor', 'thumbBorderWidth', 'thumbColor', 'thumbRadius'],
    trackContainerStyle: ['trackWidth'],
    trackStyle: ['trackWidth', 'height', 'lineColor', 'padding'],
    values: ['max', 'min', 'step'],
    value: ['_value'],
};

const styles = {
    activeTrack: {
        flexGrow: 0,
    },
    fineIncrement: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumb: {
        borderRadius: '50%',
        flexGrow: 0,
        position: 'relative',
    },
    thumbContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
    },
    track: {
        boxSizing: 'border-box',
        flexShrink: 0,
    },
    trackContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'pointer',
    },
};
