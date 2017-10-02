import React, { PureComponent } from 'react';
import { func, number, string } from 'prop-types';

const styles = {
    button: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
};

export default class MinusIcon extends PureComponent {
    static propTypes = {
        _onClick: func, // @private use only
        height: number.isRequired,
        width: number.isRequired,
        src: string.isRequired,
    }

    static defaultProps = {
        _onClick: () => {},
    }

    render() {
        const { _onClick, height, width, src } = this.props;
        return (
            <button
              style={styles.button}
              onClick={_onClick}
            >
                <img
                  height={height}
                  width={width}
                  src={src}
                  alt="minus"
                />
            </button>
        );
    }
}
