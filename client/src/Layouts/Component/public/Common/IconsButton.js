import { memo } from 'react';
import clsx from 'clsx';

const IconsButton = ({ handleOnclick, styles, icon, fw, moreStyle, tooltip, refprop }) => {
    return (
        <div
            ref={refprop}
            title={tooltip}
            className={clsx(styles ? styles : 'hover:scale-110 cursor-pointer', fw && 'w-full', moreStyle && moreStyle)}
            onClick={() => handleOnclick && handleOnclick()}
        >
            <span className="flex items-center justify-center gap-2">{icon}</span>
        </div>
    );
};

export default memo(IconsButton);
