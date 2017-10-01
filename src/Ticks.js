import React, { Children, cloneElement, PureComponent } from 'react';
import { func } from 'prop-types';

const baseCls = 'fine-increment_ticks';

// TODO: dynamically build all of this stuff
// TODO: allow dot to be colored based on current value
// TODO: add click listeners to the children
const ticksStyle = {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    width: (500 - 20 - 40) + 7, // TODO: track width - margins + dot width
    margin: 0,
    marginLeft: -3.5 + 20, // TODO: shift left half of the dot width and add left margin
    padding: 0,
    marginTop: -15, // TODO: width of dot - ceil width of dot
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none',
};

const tickStyle = {
    width: 7, // TODO: dot width
};

const labelStyle = {
    marginLeft: '-125%', // TODO: good enough for not but not right
    fontSize: 12,
};

const dotStyle = {
    height: 7,
    width: 7,
    backgroundColor: '#000',
    borderRadius: '50%',
};

export default class Ticks extends PureComponent {
    static propsTypes = {
        _onTickClick: func.isRequired, // @private use only
        onTickClick: func,
    }

    static defaultProps = {
        onTickClick: () => {},
    }

    onTickClick = ({ currentTarget }) => {
        const { _onTickClick, onTickClick } = this.props;
        const idx = parseInt(currentTarget.getAttribute('data-idx'), 10);

        _onTickClick(idx);
        onTickClick(idx);
    }

    renderChildren() {
        const { children } = this.props;
        return Children.map(children, (child, i) => (
            <li
              className={`${baseCls}_tick`}
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
        return (
            <ul className={baseCls} style={ticksStyle}>
                {this.renderChildren()}
            </ul>
        );
    }
}
