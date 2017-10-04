import React, { PureComponent } from 'react';
import { func, object, oneOfType, shape, number } from 'prop-types';
import { calculateInitialState, calculateNextState, renderChildOfType } from './Utils';
import { TWO_STEP_RANGE_CLS } from './Constants';

export default class TwoStepRange extends PureComponent {
  static displayName = 'TwoStepRange';

  static propTypes = {
    height: number.isRequired,
    onChange: func,
    style: object,
    value: oneOfType([shape({
      coarse: number,
      fine: number,
    }), shape({
      fine: number,
    })]).isRequired,
    width: number.isRequired,
  }

  static defaultProps = {
    onChange: () => {},
    style: {},
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
    const nextStateVal = nextState.value;
    const nextPropsVal = nextProps.value;

    if (
      (value.coarse !== nextStateVal.coarse && nextStateVal.coarse !== nextPropsVal.coarse) ||
      (value.fine !== nextStateVal.fine && nextStateVal.fine !== nextPropsVal.fine)
    ) {
      nextProps.onChange(nextStateVal);
    }
  }

  onCoarseIncrementChange = (coarse) => {
    this.setState(state => ({
      value: { ...state.value, coarse },
    }));
  }

  onFineIncrementChange = (fine) => {
    this.setState(state => ({
      value: { ...state.value, fine },
    }));
  }

  calculateStyle({ height, width, style }) {
    return {
      ...styles.twoStepRange,
      height,
      width,
      ...style,
    };
  }

  calculateValue({ value }) {
    return value;
  }

  renderCoarseIncrement() {
    const { value } = this.state;
    return renderChildOfType.call(this, 'CoarseIncrement', {
      _onChange: this.onCoarseIncrementChange,
      _value: value.coarse,
    });
  }

  renderFineIncrement() {
    const { value } = this.state;
    return renderChildOfType.call(this, 'FineIncrement', {
      _onChange: this.onFineIncrementChange,
      _value: value.fine,
    });
  }

  render() {
    const { style } = this.state;
    return (
      <div className={TWO_STEP_RANGE_CLS} style={style}>
        {this.renderCoarseIncrement()}
        {this.renderFineIncrement()}
      </div>
    );
  }
}

const diffProps = {
  style: ['height', 'width'],
  value: ['value'],
};

const styles = {
  twoStepRange: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
  },
};
