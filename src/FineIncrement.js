import React, { PureComponent } from 'react';
import { func, number, shape, string } from 'prop-types';
import { calculateNumericValue, renderChildOfType, shallowDiff } from './Utils';
import { FINE_INCREMENT_CLS } from './Constants';

const activeTrackStyleProps = ['activeTrackColor', 'trackColor', 'trackWidth'];
const fineIncrementStyleProps = ['thumbDiameter'];
const trackStyleProps = ['trackWidth', 'height', 'lineColor', 'padding'];
const thumbStyleProps = ['thumbBorderColor', 'thumbBorderWidth', 'thumbColor', 'thumbRadius'];
const stopPositionProps = ['max', 'min', 'step', 'trackLength', 'trackPadding'];
const valueProps = ['_value'];

const styles = {
    fineIncrementStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};

export default class FineIncrement extends PureComponent {
    static displayName = 'FineIncrement';

    static propTypes = {
        _onChange: func, // @private use only
        _value: number, // @private use only
        activeTrackColor: string,
        cls: string,
        min: number.isRequired,
        max: number.isRequired,
        onChange: func,
        step: number,
        thumbBorderColor: string,
        thumbBorderWidth: number,
        thumbColor: string,
        thumbDiameter: number,
        trackLength: number.isRequired,
        trackWidth: number,
        trackColor: string,
        trackPadding: shape({
            left: number,
            right: number,
        }),
    }

    static defaultProps = {
        _onChange: () => {},
        _value: null,
        cls: '',
        onChange: () => {},
        step: 1,
        thumbBorderWidth: 0,
        thumbBorderColor: '#000',
        thumbColor: '#000',
        thumbDiameter: 11,
        trackWidth: 1,
        activeTrackColor: null,
        trackColor: '#000',
        trackPadding: { left: 0, right: 0 },
    }

    constructor(props) {
        super(props);
        this.state = {
            activeTrackStyle: {},
            fineIncrementStyle: {}, // TODO: rename these
            trackStyle: {},
            thumbContainerStyle: {},
            thumbStyle: {},
            values: [],
            stops: [],
            value: null,
        };
        this.isSlidable = false;
    }

    componentWillMount() {
        const { props } = this;
        const { min, max, step } = props;

        const value = this.calculateValue(props);
        const stops = this.calculateStopPositions(props);
        const position = this.calculatePositionFromValue(props, stops, value);

        this.setState({
            activeTrackStyle: this.calculateActiveTrackStyle(props, position),
            fineIncrementStyle: this.calculateFineIncrementStyle(props),
            trackStyle: this.calculateTrackStyle(props),
            thumbContainerStyle: this.calculateThumbContainerStyle(props), // TODO: allow this to be updated
            thumbStyle: this.calculateThumbStyle(props),
            // TODO: allow this to be updated
            values: new Array(Math.floor(((max - min) + 1) / step)).fill().map((d, i) => (i * step) + min), // TODO: use step in calc
            stops,
            value,
        });
    }

    componentWillReceiveProps(nextProps) {
        const lastProps = this.props;
        const newState = {};

        if (shallowDiff(lastProps, nextProps, fineIncrementStyleProps)) {
            Object.assign(newState, {
                fineIncrementStyle: this.calculateFineIncrementStyle(nextProps),
            });
        }

        if (shallowDiff(lastProps, nextProps, trackStyleProps)) {
            Object.assign(newState, {
                trackStyle: this.calculateTrackStyle(nextProps),
            });
        }

        if (shallowDiff(lastProps, nextProps, thumbStyleProps)) {
            Object.assign(newState, {
                thumbStyle: this.calculateThumbStyle(nextProps),
            });
        }

        let stops = null;
        if (shallowDiff(lastProps, nextProps, stopPositionProps)) {
            stops = this.calculateStopPositions(nextProps);
            Object.assign(newState, { stops });
        }

        let value = null;
        if (shallowDiff(lastProps, nextProps, valueProps)) {
            value = this.calculateValue(nextProps);
            Object.assign(newState, { value });
        }

        if (shallowDiff(lastProps, nextProps, [...activeTrackStyleProps, ...stopPositionProps, ...valueProps])) {
            Object.assign(newState, {
                activeTrackStyle: this.calculateActiveTrackStyle(nextProps, this.calculatePositionFromValue(nextProps, stops, value)),
            });
        }

        if (Object.keys(newState).length) {
            this.setState(newState);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { value } = this.state;

        if (value !== nextState.value && nextState.value !== nextProps._value) {
            nextProps._onChange(nextState.value);
        }
    }

    calculateFineIncrementStyle({ trackWidth }) {
        return {
            height: trackWidth,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer',
        };
    }

    calculateActiveTrackStyle({ activeTrackColor, trackColor, trackWidth, trackPadding }, position) {
        return {
            width: position - trackPadding.left,
            flexGrow: 0,
            backgroundColor: activeTrackColor || trackColor,
            height: trackWidth,
            marginLeft: trackPadding.left,
        };
    }

    calculateTrackStyle({ trackLength, trackWidth, trackColor, trackPadding }) {
        return {
            width: trackLength,
            height: trackWidth,
            backgroundColor: trackColor,
            paddingLeft: trackPadding.left,
            paddingRight: trackPadding.right,
            boxSizing: 'border-box',
            flexShrink: 0,
        };
    }

    calculateThumbContainerStyle({ thumbDiameter, thumbBorderWidth }) {
        return {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            bottom: Math.ceil((thumbDiameter + (thumbBorderWidth * 2)) / 2),
            flexShrink: 0,
        };
    }

    calculateThumbStyle({ thumbBorderWidth, thumbBorderColor, thumbColor, thumbDiameter }) {
        return {
            height: thumbDiameter,
            width: thumbDiameter,
            backgroundColor: thumbColor,
            border: `${thumbBorderWidth}px solid ${thumbBorderColor}`,
            borderRadius: '50%',
            flexGrow: 0,
            position: 'relative',
            right: Math.ceil((thumbDiameter + (thumbBorderWidth * 2)) / 2),
        };
    }

    calculateStopPositions({ max, min, step, trackLength, trackPadding }) {
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

    calculatePositionFromValue({ min, max, step }, stops, value) {
        const values = new Array(Math.floor(((max - min) + 1) / step)).fill().map((d, i) => (i * step) + min); // TODO: use state
        const val = value === null ? this.state.value : value;

        let valueIdx;
        let minDiff = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < values.length; i++) {
            const diff = Math.abs(val - values[i]);
            if (diff < minDiff) {
                minDiff = diff;
                valueIdx = i;
            }
        }
        return (stops || this.state.stops)[valueIdx];
    }

    calculateValueFromPosition({ stops, values }, position) {
        // TODO: make this a function
        let stopIdx;
        let minDiff = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < values.length; i++) {
            const diff = Math.abs(position - stops[i]);
            if (diff < minDiff) {
                minDiff = diff;
                stopIdx = i;
            }
        }
        return values[stopIdx];
    }

    onThumbContainerClick = ({ clientX, currentTarget }) => {
        // TODO: break this into a function too!!
        const clickLocation = (clientX - currentTarget.getBoundingClientRect().left);
        this.setState((state, props) => {
            const value = this.calculateValueFromPosition(state, clickLocation);

            if (value !== state.value) {
                const position = this.calculatePositionFromValue(props, state.stops, value);
                return {
                    activeTrackStyle: this.calculateActiveTrackStyle(props, position),
                    value,
                };
            }
            return {};
        });
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
            this.setState((state, props) => {
                const value = this.calculateValueFromPosition(state, mouseLocation);

                if (value !== state.value) {
                    const position = this.calculatePositionFromValue(props, state.stops, value);
                    return {
                        activeTrackStyle: this.calculateActiveTrackStyle(props, position),
                        value,
                    };
                }
                return {};
            });
        }
    }

    onTouchMove = ({ touches }) => {
        // TODO: combine with onThumbContainerClick fn?
        // TODO: move this event to the window instead?
        if (this.isSlidable && (typeof touches !== 'undefined')) {
            const touchLocation = touches[0].clientX - this.thumbContainer.getBoundingClientRect().left;
            this.setState((state, props) => {
                const value = this.calculateValueFromPosition(state, touchLocation);

                if (value !== state.value) {
                    const position = this.calculatePositionFromValue(props, state.stops, value);
                    return {
                        activeTrackStyle: this.calculateActiveTrackStyle(props, position),
                        value,
                    };
                }
                return {};
            });
        }
    }

    onTickClick = (idx) => {
        this.setState((state, props) => ({
            value: state.values[idx],
            activeTrackStyle: this.calculateActiveTrackStyle(props, state.stops[idx]),
        }));
    }

    onMinusIconClick = () => {
        this.setState((state, props) => {
            const value = Math.max(props.min, state.value - props.step);
            const position = this.calculatePositionFromValue(props, state.stops, value);
            return {
                value,
                activeTrackStyle: this.calculateActiveTrackStyle(props, position),
            };
        });
    }

    onPlusIconClick = () => {
        this.setState((state, props) => {
            const value = Math.min(props.max, state.value + props.step);
            const position = this.calculatePositionFromValue(props, state.stops, value);
            return {
                value,
                activeTrackStyle: this.calculateActiveTrackStyle(props, position), // TODO: I think I can get rid of all of these
            };
        });
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
        const { cls } = this.props;
        const {
          fineIncrementStyle,
          activeTrackStyle,
          trackStyle,
          thumbContainerStyle,
          thumbStyle,
        } = this.state;

        return (
            <div
              className={`${FINE_INCREMENT_CLS} ${cls}`}
              style={styles.fineIncrementStyle}
              onMouseMove={this.onMouseMove}
              onTouchMove={this.onTouchMove}
            >
                {this.renderMinusIcon()}
                <div style={fineIncrementStyle}>
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

/*
const diffProps = {
    activeTrackStyle: ['activeTrackColor', 'trackColor', 'trackWidth'],
    fineIncrementStyle: ['thumbDiameter'],
    trackStyle: ['trackWidth', 'height', 'lineColor', 'padding'],
    thumbStyle: ['thumbBorderColor', 'thumbBorderWidth', 'thumbColor', 'thumbRadius'],
    stopPosition: ['max', 'min', 'step', 'trackLength', 'trackPadding'],
    value: ['_value'],
}
 */
