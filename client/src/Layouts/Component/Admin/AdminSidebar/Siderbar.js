import { Fragment, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Link, NavLink } from 'react-router-dom';
import { adminSidebar } from 'Ultils/Contants';
import { Images } from 'Layouts/Assets/icons';
import { motion } from 'framer-motion';
import path from 'Router/path';

const AdminSidebar = () => {
    const [isActived, setIsActived] = useState([]);

    const hanldeNavActived = (id) => {
        if (isActived.some((el) => el === id)) {
            setIsActived((prev) => prev.filter((el) => el !== id));
        } else setIsActived((prev) => [...prev, id]);
    };

    const show = {
        y: 0,
        opacity: 1,
        display: 'block',
    };

    const hide = {
        y: -10,
        opacity: 0,
        transitionEnd: {
            display: 'none',
        },
    };

    return (
        <section className="text-white p-4 bg-primary h-full font-semibold">
            <div className="flex items-center justify-center p-2 mb-2 border-b-2 border-white">
                <img alt="" className="w-6 h-6" src={Images.ShopLogo}></img>
                <Link className="ml-1 text-2xl leading-6 font-bold font-heading" to={`/${path.HOMEPAGE}`}>
                    KimLienShop
                </Link>
            </div>
            {adminSidebar.map((el) => (
                <Fragment key={el.id}>
                    {el.type === 'single' && (
                        <NavLink
                            to={el.path}
                            className={({ isActive }) =>
                                `${
                                    isActive ? 'text-primary bg-orange-100' : ''
                                } hover:text-primary hover:bg-orange-100 animation-100 rounded-md flex gap-2 items-center mb-2 p-3`
                            }
                        >
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>
                    )}
                    {el.type === 'parent' && (
                        <div>
                            <div
                                onClick={() => hanldeNavActived(el.id)}
                                className="flex select-none gap-2 items-center cursor-pointer p-3 hover:text-primary hover:bg-orange-100 animation-100 rounded-md "
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                                <motion.span
                                    animate={isActived.some((a) => a === el.id) ? { rotate: 180 } : { rotate: 0 }}
                                >
                                    <IoIosArrowDown />
                                </motion.span>
                            </div>
                            <div className="flex flex-col mt-2 pl-6 overflow-hidden">
                                <motion.div
                                    animate={isActived.some((a) => a === el.id) ? show : hide}
                                    className="hidden"
                                >
                                    {el.sub?.map((item, index) => (
                                        <NavLink
                                            key={index}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `${
                                                    isActive ? 'text-primary bg-orange-100' : ''
                                                } hover:text-primary hover:bg-orange-100 animation-100 rounded-md flex gap-2 items-center mb-2 p-3`
                                            }
                                        >
                                            <span>{item.text}</span>
                                        </NavLink>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    )}
                </Fragment>
            ))}
        </section>
    );
};

export default AdminSidebar;
