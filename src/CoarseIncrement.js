import React, { PureComponent } from 'react';
import { func, number, object } from 'prop-types';
import {
  calculateInitialState,
  calculateNextState,
  calculateNumericValue,
  renderChildOfType,
} from './Utils';
import { COARSE_INCREMENT_CLS } from './Constants';

export default class CoarseIncrement extends PureComponent {
  static displayName = 'CoarseIncrement';

  static propTypes = {
      _onChange: func,
    _value: number,
    max: number,
    min: number,
    step: number,
    style: object,
    valueStyle: object,
  }

  static defaultProps = {
    _onChange: () => {},
    _value: 0,
    max: Number.MAX_SAFE_INTEGER,
    min: Number.MIN_SAFE_INTEGER,
    step: 1,
    style: {},
    valueStyle: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      style: {},
      value: null,
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

  componentWillUpdate(nextProps, nextState) {
    const { value } = this.state;
    if (value !== nextState.value && nextState.value !== nextProps._value) {
      nextProps._onChange(nextState.value);
    }
  }

  onMinusIconClick = () => {
    this.setState((state, props) => {
      const newValue = state.value - props.step;
      return {
        value: newValue >= props.min ? newValue : state.value,
      };
    });
  }

  onPlusIconClick = () => {
    this.setState((state, props) => {
      const newValue = state.value + props.step;
      return {
        value: newValue <= props.max ? newValue : state.value,
      };
    });
  }

  calculateStyle({ style }) {
    return { ...styles.coarse, ...style };
  }

  calculateValue({ _value, max, min }) {
    return calculateNumericValue(_value, max, min);
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

  render() {
    const { valueStyle } = this.props;
    const { style, value } = this.state;
    return (
      <div className={COARSE_INCREMENT_CLS} style={style}>
        {this.renderMinusIcon()}
        <span
          className={`${COARSE_INCREMENT_CLS}_value`}
          style={valueStyle}
        >{value}</span>
        {this.renderPlusIcon()}
      </div>
    );
  }
}

const diffProps = {
  value: ['_value'],
  style: ['style'],
};

const styles = {
  coarse: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'default',
  },
};
