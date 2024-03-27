import { Button, InputForm, Loading, ModalUI } from 'Layouts/Component/public/Common';
import { useCallback, useEffect, useState } from 'react';
import { setSelectedListCategory } from 'Context/Reducer/Category/CategoryAction';
import { apiUpdateProduct } from 'Context/StoreApi';
import { MarkDown } from 'Layouts/Component/Admin/AdminComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Icons } from 'Layouts/Assets/icons';
import { memo } from 'react';
import withComponent from 'Hocs/withComponent';
import UploadImages from './UploadImages';
import CustomSelect from 'Layouts/Component/public/Common/CustomSelect';

const { IoChevronBackOutline } = Icons;

const UpdateProduct = ({ editProduct, render, setEditProduct, dispatch, useSelector }) => {
    const {
        formState: { errors },
        handleSubmit,
        register,
        reset,
        setValue,
    } = useForm({});
    const { categories, categoryItem } = useSelector((state) => state.categoriesReducer);
    const [payload, setPayload] = useState({ description: '' });
    const [preview, setPreview] = useState({ thumb: null, images: [] });
    const [subCategory, setSubCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const changeValue = useCallback((e) => setPayload(e), []);

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            brand: editProduct?.brand || '',
            origin: editProduct?.origin || '',
            unitCalculation: editProduct?.unitCalculation || '',
            uses: editProduct?.uses || '',
            percentage: editProduct?.discount?.percentage || '',
            expiry:
                Math.ceil((new Date(editProduct?.discount?.expiryDiscount) - new Date()) / (1000 * 60 * 60 * 24)) || '',
        });
        setPayload({ description: editProduct?.description });
        setPreview({ thumb: editProduct?.thumb, images: editProduct?.images });
        window.scrollTo(0, 0);
        // eslint-disable-next-line
    }, [editProduct]);

    const handleUpdateProduct = async (data) => {
        const totalPayload = { ...data, ...payload };
        const formData = new FormData();
        for (let i of Object.entries(totalPayload)) formData.append(i[0], i[1]);
        if (preview.thumb) formData.append('thumb', preview?.thumb);
        if (preview.images) {
            for (let image of preview?.images) formData.append('images', image);
        }

        setIsLoading(true);
        const response = await apiUpdateProduct(formData, editProduct?._id);
        setIsLoading(false);
        if (response.success) {
            toast.success(response.message);
            render();
            setPayload({ thumb: '', images: [] });
            setEditProduct(null);
        } else toast.error(response.message);
    };

    const handleSelectChange = (selectedOption, id) => {
        console.log(selectedOption);
        setValue(id, selectedOption.value);
        if (id === 'mainCategory') {
            setSubCategory('');
            const valueSelect = selectedOption.value;
            const mainCategorySelected = categories.find((el) => el.title === valueSelect);
            dispatch(setSelectedListCategory(mainCategorySelected ? mainCategorySelected.listCategory : []));
        } else setSubCategory(selectedOption.value);
    };

    useEffect(() => {
        setSubCategory(categoryItem[0]?.itemTitle);
    }, [categoryItem]);

    return (
        <div className="w-full min-h-screen">
            <div className="h-[65.6px] w-full"></div>
            <div className="flex gap-2 items-center px-4 py-2 uppercase text-primary z-10 shadow-md bg-gray-100 fixed w-full top-0">
                <h3>Chỉnh sửa sản phẩm</h3>
                <Button
                    styles="bg-primary hover:bg-secondary text-white font-semibold py-1 px-2 rounded-md"
                    handleOnclick={() => setEditProduct(null)}
                    iconBefore={<IoChevronBackOutline size={16} />}
                >
                    <span className="text-sm">Back</span>
                </Button>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
                    <InputForm
                        label={'Tên sản phẩm:'}
                        register={register}
                        errors={errors}
                        id={'title'}
                        validate={{ required: 'Không được để trống' }}
                        fullwidth
                        placeholder={'Nhập tên sản phẩm cần tạo...'}
                    />
                    <div className="flex gap-4">
                        <InputForm
                            label={'Giá sản phẩm:'}
                            register={register}
                            errors={errors}
                            type="number"
                            id={'price'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập giá...'}
                        />
                        <InputForm
                            label={'Giảm giá (%) (Nếu có):'}
                            register={register}
                            errors={errors}
                            type="number"
                            id={'percentage'}
                            validate={{
                                validate: (value) => parseInt(value, 10) < 100 || 'Giảm giấ không lớn hơn 100%',
                            }}
                            fullwidth
                            placeholder={'Nhập %...'}
                        />
                        <InputForm
                            label={'Thời hạn giảm giá (Ngày) (Còn lại):'}
                            register={register}
                            errors={errors}
                            type="number"
                            id={'expiry'}
                            fullwidth
                            placeholder={'Nhập số ngày...'}
                        />
                        <InputForm
                            label={'Đơn vị:'}
                            register={register}
                            errors={errors}
                            id={'unitCalculation'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập đơn vị bán (Lọ, viên, cái..vv)...'}
                        />
                        <InputForm
                            label={'Số lượng:'}
                            register={register}
                            errors={errors}
                            type="number"
                            id={'quantity'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập số lượng...'}
                        />
                    </div>
                    <div className="flex gap-4">
                        <InputForm
                            label={'Nhãn hàng:'}
                            register={register}
                            errors={errors}
                            id={'brand'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập tên nhãn hàng...'}
                        />
                        <InputForm
                            label={'Xuất xứ:'}
                            register={register}
                            errors={errors}
                            id={'origin'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập xuất xứ...'}
                        />
                        <CustomSelect
                            label={'Nhóm sản phẩm:'}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'mainCategory')}
                            options={categories?.map((el) => ({ value: el.title, label: el.title }))}
                            defaultValue={{ value: editProduct?.mainCategory, label: editProduct?.mainCategory }}
                        />
                        <CustomSelect
                            label={'Loại:'}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'category')}
                            options={categoryItem?.map((el) => ({ value: el.itemTitle, label: el.itemTitle }))}
                            value={{
                                value: subCategory,
                                label: subCategory,
                            }}
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label={'Mô tả phụ:'}
                            register={register}
                            errors={errors}
                            id={'uses'}
                            validate={{ required: 'Không được để trống' }}
                            fullwidth
                            placeholder={'Nhập mô tả phụ...'}
                        />
                        <MarkDown
                            name="description"
                            changeValue={changeValue}
                            label="Mô tả:"
                            value={payload?.description}
                        />
                    </div>
                    <UploadImages setPreview={setPreview} preview={preview} />
                    <div className="w-full text-end">
                        <Button type={'submit'}>Tạo sản phẩm</Button>
                    </div>
                    <ModalUI isOpen={isLoading} onClose={() => setIsLoading(false)}>
                        <Loading />
                    </ModalUI>
                </form>
            </div>
        </div>
    );
};

export default withComponent(memo(UpdateProduct));
