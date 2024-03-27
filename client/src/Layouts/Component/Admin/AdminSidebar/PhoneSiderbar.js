import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './Siderbar';
import clsx from 'clsx';

const PhoneAdminSiderbar = forwardRef(({ showNavBarMenu }, ref) => {
    return (
        <motion.div
            animate={
                showNavBarMenu
                    ? { x: 0, display: 'block' }
                    : {
                          x: -250,
                          transitionEnd: {
                              display: 'none',
                          },
                      }
            }
            transition={{ duration: 0.1, ease: 'linear' }}
            ref={ref}
            className={clsx('fixed z-[999] phone:w-[250px] h-full', showNavBarMenu ? 'phone:block' : 'phone:hidden')}
        >
            <AdminSidebar />
        </motion.div>
    );
});

export default memo(PhoneAdminSiderbar);
