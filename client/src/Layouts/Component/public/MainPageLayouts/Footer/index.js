import { Navigation, ownerInfomation, storePolicy } from 'Ultils/Contants';
import { useSelector } from 'react-redux';
import { Images } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';

const Footer = () => {
    const { categories } = useSelector((state) => state.categoriesReducer);

    return (
        <footer>
            <div className="mt-20 phone:mt-[120px]"></div>
            <div className="relative w-full bg-gray-100 flex flex-col items-center border-y-2 border-gray-300">
                <div
                    className="absolute top-0 left-1/2 translate-x-[-50%] translate-y-[-50%] px-8 py-4 w-[70%] grid gap-2 border-[2px] border-primary bg-white
                laptop:grid-cols-3 laptop:rounded-full laptop:px-6 laptop:py-4 phone:grid-cols-1 phone:rounded-md phone:p-2"
                >
                    {storePolicy.map((el, index) => (
                        <div className="flex items-center" key={index}>
                            <div className="p-2">
                                <img src={el.image} alt="" className="h-14 w-14 object-cover"></img>
                            </div>
                            <div className="ml-4 w-[calc(100%-100px)]">
                                <h4 className="font-semibold">{el.title}</h4>
                                <p className="text-sm break-words">{el.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="laptop:w-main laptop:mt-[80px] phone:mt-[150px]">
                    <div className="p-4 grid tablet:grid-cols-3 phone:grid-cols-1 gap-12">
                        <div>
                            <h4 className="uppercase font-bold pb-4">Liên hệ chúng tôi</h4>
                            {ownerInfomation.map((el, index) => (
                                <ul key={index}>
                                    <li className="py-2 border-b-[1px] border-gray-300">{el.content}</li>
                                </ul>
                            ))}
                            <div className="py-2 flex gap-2 items-center">
                                <strong>Theo dõi:</strong>
                                <div className="py-2 flex gap-2">
                                    <Link to="https://www.facebook.com/trankim.lien.1253">
                                        <img
                                            src={Images.Facebook}
                                            alt=""
                                            className="object-cover h-8 w-8 hover:scale-110 animation-200"
                                        ></img>
                                    </Link>
                                    <Link to="https://www.facebook.com/trankim.lien.1253">
                                        <img
                                            src={Images.Zalo}
                                            alt=""
                                            className="object-cover h-8 w-8 hover:scale-110 animation-200"
                                        ></img>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="laptop:text-center">
                            <h4 className="uppercase font-bold pb-4">Hỗ trợ khách hàng</h4>
                            <ul>
                                {Navigation.map((el) => (
                                    <li className="py-2 hover:text-secondary animation-200 text-gray-600" key={el.id}>
                                        <Link to={el.path}>{el.value}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="laptop:text-center">
                            <h4 className="uppercase font-bold pb-4 ">Doanh mục sản phẩm</h4>
                            <ul>
                                {categories?.map((el) => (
                                    <li key={el._id} className="py-2 hover:text-secondary animation-200 text-gray-600">
                                        <Link to="/">{el.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-3 text-center w-full">
                <div className="mx-auto">
                    Copyright 2023 ©<strong>www.kimlienshop.com</strong>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
