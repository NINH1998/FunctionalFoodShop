import { memo } from 'react';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/perspective.css';
import 'tippy.js/themes/light.css';

const TippyWrap = ({ children, content, fontSize, trigger, placement }) => {
    return (
        <Tippy
            placement={placement || 'bottom'}
            animation="scale"
            theme="light"
            trigger={trigger}
            content={<div className={clsx(`font-semibold`, fontSize)}>{content}</div>}
        >
            {children}
        </Tippy>
    );
};

export default memo(TippyWrap);
