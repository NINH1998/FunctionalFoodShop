import { Button, InputForm, Loading, ModalUI } from 'Layouts/Component/public/Common';
import { setSelectedListCategory } from 'Context/Reducer/Category/CategoryAction';
import { useCallback, useState } from 'react';
import { apiCreateProduct } from 'Context/StoreApi';
import { useSelector } from 'react-redux';
import { MarkDown } from 'Layouts/Component/Admin/AdminComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import withComponent from 'Hocs/withComponent';
import UploadImages from '../ManageProducts/UploadImages';
import CustomSelect from 'Layouts/Component/public/Common/CustomSelect';

const CreateProduct = ({ dispatch }) => {
    const { categories, categoryItem } = useSelector((state) => state.categoriesReducer);
    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
        reset,
    } = useForm({});

    const [payload, setPayload] = useState({ description: '' });
    const [subCategory, setSubCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState({
        thumb: null,
        images: [],
    });

    const changeValue = useCallback((e) => setPayload(e), []);

    const handleCreateProduct = async (data) => {
        const totalPayload = { ...data, ...payload };
        const formData = new FormData();
        for (let i of Object.entries(totalPayload)) formData.append(i[0], i[1]);
        if (preview.thumb) formData.append('thumb', preview.thumb);
        if (preview.images) {
            for (let image of preview.images) formData.append('images', image);
        }

        setIsLoading(true);
        const response = await apiCreateProduct(formData);
        setIsLoading(false);
        if (response.success) {
            toast.success(response.message);
            reset();
            setPreview({ thumb: null, images: [] });
            setPayload({ description: '' });
        } else toast.error(response.message);
    };

    const handleSelectChange = (selectedOption, id) => {
        setValue(id, selectedOption.value);
        if (id === 'mainCategory') {
            setSubCategory(null);
            const valueSelect = selectedOption.value;
            const mainCategorySelected = categories.find((el) => el.title === valueSelect);
            dispatch(setSelectedListCategory(mainCategorySelected ? mainCategorySelected.listCategory : []));
        } else setSubCategory(selectedOption.value);
    };

    return (
        <div className="w-full">
            <div className="h-[65.6px] w-full"></div>
            <div className="fixed max-tablet:top-[35px] top-0 flex gap-2 items-center px-4 py-2 uppercase text-primary z-[998] shadow-md bg-gray-100 w-full">
                <h3>Tạo sản phẩm</h3>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputForm
                        label={'Tên sản phẩm:'}
                        register={register}
                        errors={errors}
                        id={'title'}
                        validate={{ required: 'Không được để trống' }}
                        fullwidth
                        placeholder={'Nhập tên sản phẩm cần tạo...'}
                    />
                    <div className="flex phone:flex-col laptop:flex-row laptop:gap-4 mt-2">
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
                            label={'Thời hạn giảm giá (Ngày) (Nếu có):'}
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
                    <div className="flex phone:flex-col laptop:flex-row gap-4 mt-2">
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
                            defaultValue={categories && { value: categories[0].title, label: categories[0].title }}
                        />
                        <CustomSelect
                            label={'Loại:'}
                            onChange={(selectedOption) => handleSelectChange(selectedOption, 'category')}
                            options={categoryItem?.map((el) => ({ value: el.itemTitle, label: el.itemTitle }))}
                            value={subCategory ? { value: subCategory, label: subCategory } : null}
                        />
                    </div>
                    <div className="mt-4">
                        <InputForm
                            label={'Mô tả phụ:'}
                            register={register}
                            errors={errors}
                            id={'uses'}
                            validate={{ required: 'Không được để trống', validate: (val) => val !== '--Chọn loại--' }}
                            fullwidth
                            placeholder={'Nhập mô tả phụ...'}
                        />
                        <MarkDown name="description" changeValue={changeValue} label="Mô tả:" />
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

export default withComponent(CreateProduct);
