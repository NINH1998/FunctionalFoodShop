import { Fragment, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { memberSidebar } from 'Ultils/Contants';
import { Icons, Images } from 'Layouts/Assets/icons';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { motion } from 'framer-motion';
import path from 'Router/path';

const { IoHomeSharp } = Icons;

const MemberSiderbar = () => {
    const { current, isLoading } = useSelector((state) => state.userReducer);
    const [isActived, setIsActived] = useState([]);

    const hanldeNavActived = (id) => {
        if (isActived.some((el) => el === id)) setIsActived((prev) => prev.filter((el) => el !== id));
        else {
            setIsActived((prev) => [...prev, id]);
        }
    };

    const show = {
        y: '0%',
        opacity: 1,
        display: 'block',
    };

    const hide = {
        y: '-50%',
        opacity: 0,
        transitionEnd: {
            display: 'none',
        },
    };

    return (
        <div className="w-full text-white p-4 bg-primary h-full font-semibold">
            <div className="flex items-center justify-start">
                <Link className="hover:bg-gray-300 animation-200 p-1 bg-white rounded-md" to={`/${path.HOMEPAGE}`}>
                    <IoHomeSharp size={24} color="gray" />
                </Link>
            </div>
            <div className="w-full flex justify-center p-2 mb-2 border-b-[1px] border-white">
                {isLoading ? (
                    <Skeleton.Avatar active shape="circle" size={80} style={{ backgroundColor: '#f3f4f6' }} />
                ) : (
                    <img
                        alt=""
                        className="w-[80px] h-[80px] object-cover rounded-full mb-4"
                        src={current?.avatar || Images.AvatarDefault}
                    />
                )}
            </div>
            <div>
                {memberSidebar.map((el) => (
                    <Fragment key={el.id}>
                        {el.type === 'single' && (
                            <NavLink
                                to={el.path}
                                className={({ isActive }) =>
                                    `${
                                        isActive ? 'text-primary bg-gray-100' : ''
                                    } hover:text-primary hover:bg-gray-100 animation-100 rounded-md flex gap-2 items-center mb-2 p-3`
                                }
                            >
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </NavLink>
                        )}
                        {el.type === 'parent' && (
                            <div className="">
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
                                                    `${isActive && 'text-primary bg-orange-100'} 
                                                    hover:text-primary hover:bg-orange-100 animation-100 rounded-md flex gap-2 items-center mb-2 p-3`
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
            </div>
        </div>
    );
};

export default MemberSiderbar;
