import React, { PureComponent } from 'react';
import { func, number, object, string } from 'prop-types';
import { PLUS_ICON_CLS } from './Constants';
import Icon from './Icon';

export default class PlusIcon extends PureComponent {
    static displayName = 'PlusIcon';

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
              className={PLUS_ICON_CLS}
              alt="plus"
              {...this.props}
            />
        );
    }
}
