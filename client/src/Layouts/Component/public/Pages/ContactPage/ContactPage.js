import { ownerInfomation } from 'Ultils/Contants';
import { Images } from 'Layouts/Assets/icons';
import { Link } from 'react-router-dom';
import BreadCrumb from '../BreadCrumb';

const ContactPage = () => {
    return (
        <div className="w-full">
            <div className="w-full px-6 py-3 text-end bg-gray-200">
                <BreadCrumb />
            </div>
            <div className="p-6 mb-12 flex w-full">
                <div className="flex laptop:w-main laptop:flex-row mx-auto phone:flex-col phone:w-full">
                    <div>
                        <ul className="mr-4">
                            {ownerInfomation.map((el, index) => (
                                <ul key={index}>
                                    <li className="py-2 border-b-[1px] border-gray-300">{el.content}</li>
                                </ul>
                            ))}
                        </ul>
                        <div className="py-2 flex gap-2">
                            <Link to="https://www.facebook.com/trankim.lien.1253">
                                <img
                                    alt="Facebook"
                                    src={Images.Facebook}
                                    className="object-cover h-8 w-8 hover:scale-110 animation-200"
                                ></img>
                            </Link>
                            <Link to="https://www.facebook.com/trankim.lien.1253">
                                <img
                                    alt="Zalo"
                                    src={Images.Zalo}
                                    className="object-cover h-8 w-8 hover:scale-110 animation-200"
                                ></img>
                            </Link>
                        </div>
                    </div>
                    <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d232.83825066434116!2d107.02307789861005!3d20.97611531593535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a58a466bbf703%3A0xcfb0bac078a88079!2sXi%20B%C3%A1t%20Cheo%2068!5e0!3m2!1svi!2s!4v1708851022594!5m2!1svi!2s"
                        height="450"
                        className="w-full"
                        loading="lazy"
                        allow="fullscreen"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
