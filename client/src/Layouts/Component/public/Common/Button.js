import { memo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Button = ({ children, handleOnclick, styles, iconBefore, iconAfter, fw, to, moreStyle, ...passprops }) => {
    let Component = 'button';

    const props = {
        to,
        ...passprops,
    };

    if (to) {
        props.to = to;
        Component = Link;
    }

    return (
        <Component
            {...props}
            type="submit"
            className={clsx(
                styles
                    ? styles
                    : 'shadow-sm mt-4 outline-none shadow-gray-500 bg-primary hover:bg-secondary text-white font-semibold py-1 px-2 rounded animation-200',
                fw && 'w-full',
                moreStyle && moreStyle,
            )}
            onClick={() => handleOnclick && handleOnclick()}
        >
            <span className="flex items-center justify-center gap-1">
                {iconBefore}
                {children}
                {iconAfter}
            </span>
        </Component>
    );
};

export default memo(Button);
