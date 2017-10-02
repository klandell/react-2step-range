import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { MINUS_ICON_CLS } from './Constants';

export default class MinusIcon extends PureComponent {
    static displayName = 'MinusIcon';

    static propTypes = {
        _onClick: func, // @private use only
        height: number.isRequired,
        width: number.isRequired,
        src: string.isRequired,
        style: object,
    }

    static defaultProps = {
        _onClick: () => {},
        style: {},
    }

    render() {
        return (
            <Icon
              className={MINUS_ICON_CLS}
              alt="minus"
              {...this.props}
            />
        );
    }
}
