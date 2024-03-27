import { motion, AnimatePresence } from 'framer-motion';
import { InputForm, InputRadio } from '../../Common';
import { memo, useState } from 'react';
import { Images } from 'Layouts/Assets/icons';

const UserPaymentInfo = ({ errors, register, handleRadioChange, watch }) => {
    const [showBankingNumber, setShowBankingNumber] = useState(false);

    return (
        <div className="laptop:float-left laptop:w-[60%] laptop:pr-4">
            <div className="border-2 p-2 shadow-default shadow-gray-300">
                <h4 className="px-2 my-4 uppercase">Người mua hàng:</h4>
                <div className="tablet:flex tablet:flex-wrap w-full">
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'name'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 px-2 tablet:w-1/2 mb-4"
                        placeholder={'Nhập họ tên...'}
                    />
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'emailAddress'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 px-2 tablet:w-1/2 mb-4"
                        placeholder={'Nhập địa chỉ email...'}
                    />
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'phone'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 px-2 tablet:w-1/2 mb-4"
                        placeholder={'Nhập số điện thoại...'}
                    />
                </div>
                <h4 className="px-2 my-4 uppercase">Người nhận hàng:</h4>
                <div className="tablet:flex tablet:flex-wrap">
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'subName'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 tablet:w-1/2 px-2 w-full mb-4"
                        placeholder={'Nhập họ tên...'}
                    />
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'subPhone'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 tablet:w-1/2  px-2 w-full mb-4"
                        placeholder={'Nhập số điện thoại...'}
                    />
                </div>
                <h4 className="px-2 my-4 uppercase">Địa chỉ nhận hàng:</h4>
                <div className="px-2 mb-4">
                    <InputForm
                        register={register}
                        errors={errors}
                        id={'address'}
                        validate={{ required: 'Không được để trống' }}
                        containerStyle="flex flex-col gap-2 w-full "
                        placeholder={'Nhập địa chỉ số nhà, tổ, khu...'}
                    />
                </div>
                <h4 className="px-2 my-4 uppercase">Phương thức thanh toán:</h4>
                <div className="flex flex-col items-center">
                    <div className="flex tablet:flex-row phone:flex-col gap-4 justify-around w-full mb-4">
                        <div>
                            <InputRadio
                                value="Thanh toán khi nhận hàng"
                                id="cashOnDelivery"
                                checked={watch('payments') === 'Thanh toán khi nhận hàng'}
                                handleOnclick={() => {
                                    handleRadioChange('Thanh toán khi nhận hàng');
                                    setShowBankingNumber(false);
                                }}
                                label="Thanh toán khi nhận hàng"
                                labelIcon={<img src={Images.CashOnDelivery} alt="" className="object-cover h-6 w-6" />}
                                {...register('payments')}
                            />
                        </div>
                        <div>
                            <InputRadio
                                value="Thanh toán chuyển khoản"
                                id="onlinePayment"
                                checked={watch('payments') === 'Thanh toán chuyển khoản'}
                                handleOnclick={() => {
                                    handleRadioChange('Thanh toán chuyển khoản');
                                    setShowBankingNumber(!showBankingNumber);
                                }}
                                label="Thanh toán chuyển khoản"
                                labelIcon={<img src={Images.OnlinePayment} alt="" className="object-cover h-6 w-6" />}
                                {...register('payments')}
                            />
                            <AnimatePresence>
                                {showBankingNumber && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: 'easeIn' }}
                                        className="text-sm mt-2 bg-gray-100 p-2"
                                    >
                                        <div className="flex items-center">
                                            <strong>Stk:</strong>
                                            <span>4451000043326</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong>Ngân hàng:</strong>
                                            <span>BIDV</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong>Chủ tk:</strong>
                                            <span>Trần Thị Kim Liên</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong>SĐT:</strong>
                                            <span>0969933816</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    {errors.payments && <p className="text-red-500 text-sm">{errors.payments.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default memo(UserPaymentInfo);
