import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { MINUS_ICON_CLS } from './Constants';
import Icon from './Icon';

export default class MinusIcon extends PureComponent {
    static displayName = 'MinusIcon';

    static propTypes = {
        _onClick: func,
        height: number.isRequired,
        src: string.isRequired,
        style: object,
        width: number.isRequired,
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
