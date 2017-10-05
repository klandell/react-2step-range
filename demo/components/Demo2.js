import React, { PureComponent } from 'react';
import {
  FineIncrement,
  TwoStepRange,
} from 'react-2step-range';

export default class Demo2 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: { fine: 0 },
    };
  }

  onTwoStepRangeChange = (value) => {
    this.setState(value);
  }

  render() {
    const { value } = this.state;

    return (
      <TwoStepRange height={50} value={value} onChange={this.onTwoStepRangeChange}>
        <FineIncrement
          min={0}
          max={100}
          trackLength={370}
          trackWidth={13}
          trackColor="#CECECE"
          activeTrackColor="green"
          thumbBorderWidth={2}
          thumbBorderColor="#686868"
          thumbColor="#9B9B9B"
          thumbDiameter={9}
          thumbOverhang={false}
        />
      </TwoStepRange>
    );
  }
}
