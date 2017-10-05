import React, { PureComponent } from 'react';
import {
  CoarseIncrement,
  FineIncrement,
  MinusIcon,
  PlusIcon,
  Ticks,
  TwoStepRange,
} from '@src';

export default class Demo1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: { coarse: 2017, fine: 9 },
    };
  }

  onTwoStepRangeChange = (value) => {
    this.setState(value);
  }

  render() {
    const { value } = this.state;

    return (
      <TwoStepRange
        value={value}
        onChange={this.onTwoStepRangeChange}
        height={76}
        width={451}
        style={styles.twoStepRange}
      >
        <CoarseIncrement
          min={1900}
          style={styles.coarseIncrement}
        >
          <MinusIcon
            height={6}
            width={6}
            src="/assets/demo1/coarse-left.svg"
            style={styles.coarseIcon}
          />
          <PlusIcon
            height={6}
            width={6}
            src="/assets/demo1/coarse-right.svg"
            style={styles.coarseIcon}
          />
        </CoarseIncrement>
        <FineIncrement
          min={0}
          max={11}
          trackLength={370}
          trackPadding={CONSTANTS.TRACK_PADDING}
          trackColor="#FFF"
          thumbBorderColor="#FFF"
          thumbBorderWidth={1}
        >
          <Ticks
            tickColor="#FFF"
            tickDiameter={5}
            labels={CONSTANTS.TICKS}
          />
          <MinusIcon
            height={40}
            width={40}
            src="/assets/demo1/fine-left.svg"
          />
          <PlusIcon
            height={40}
            width={40}
            src="/assets/demo1/fine-right.svg"
          />
        </FineIncrement>
      </TwoStepRange>
    );
  }
}

const styles = {
  twoStepRange: {
    backgroundColor: 'rgba(35, 42, 61, 0.3)',
    padding: '6px 18px',
  },
  coarseIncrement: {
    fontSize: 24,
    margin: '0 0 4px 38px',
    color: '#FFF',
    height: 20,
  },
  coarseIcon: {
    height: 24,
    width: 24,
  },
  tickLabel: {
    position: 'relative',
    color: '#FFF',
    fontSize: 11,
    top: 2,
  },
};

const CONSTANTS = {
  TICKS: [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ].map(m => <span key={m} style={styles.tickLabel}>{m}</span>),
  TRACK_PADDING: { left: 30, right: 30 },
};
