import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { calculateInitialState, calculateNextState } from './Utils';

export default class Icon extends PureComponent {
  static displayName = 'Icon';

  static propTypes = {
    _onClick: func,
    alt: string,
    className: string,
    height: number.isRequired,
    src: string.isRequired,
    style: object,
    width: number.isRequired,
  }

  static defaultProps = {
    _onClick: () => {},
    alt: '',
    className: '',
    style: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      style: {},
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

  calculateStyle({ style }) {
    return { ...styles.button, ...style };
  }

  render() {
    const { _onClick, alt, className, height, src, width } = this.props;
    const { style } = this.state;

    return (
      <button
        className={className}
        style={style}
        onClick={_onClick}
      >
        <img
          className={`${className}_img`}
          height={height}
          width={width}
          src={src}
          alt={alt}
        />
      </button>
    );
  }
}

const styles = {
  button: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  },
};

const diffProps = {
  style: ['style'],
};
