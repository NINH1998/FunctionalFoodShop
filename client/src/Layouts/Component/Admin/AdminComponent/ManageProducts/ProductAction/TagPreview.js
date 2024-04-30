import { apiCreateNewTag, apiGetTagByProduct, apiGetTag } from 'Context/StoreApi/Tag';
import { memo, useEffect, useState } from 'react';
import { Button, IconsButton, InputField, Loading } from 'Layouts/Component/public/Common';
import { useDropzone } from 'react-dropzone';
import { Icons } from 'Layouts/Assets/icons';
import { BeatLoader } from 'react-spinners';

const { IoMdClose, FaCloudUploadAlt } = Icons;

const TagPreview = ({ tagsCreated, setTagsCreated, editProduct }) => {
    const [tagInput, setTagInput] = useState({ tag: '' });
    const [tags, setTags] = useState([]);
    const [preview, setPreview] = useState({ thumb: null });
    const [loadingProductTag, setLoadingProductTag] = useState(false);
    const [render, setRender] = useState(false);

    const getTag = async () => {
        const rs = await apiGetTag();
        if (rs.success) setTags(rs.tags);
    };

    const handleInputTagChange = (event) => {
        setTagInput(event);
    };

    const handleCreateTagAction = async () => {
        if (tagInput.tag && preview.thumb) {
            const formData = new FormData();
            if (preview.thumb) formData.append('iconTag', preview.thumb);
            if (tagInput.tag) formData.append('title', tagInput.tag);
            setTagInput({ tag: '' });
            setLoadingProductTag(true);
            const rs = await apiCreateNewTag(formData);
            setLoadingProductTag(false);
            if (rs.success) {
                setRender(!render);
                setPreview({ thumb: null });
            }
        }
    };

    const handleCreateTagByInput = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleCreateTagAction();
        }
    };

    const handleClickToTags = (tag) => {
        const existTag = tagsCreated.find((el) => el._id === tag._id);
        if (!existTag) {
            setTagsCreated((prev) => [...prev, { _id: tag._id, title: tag.title, colorTag: tag.colorTag }]);
        } else return;
    };

    const handleRemoveTag = (tagId) => {
        const existTag = tagsCreated.find((el) => el._id === tagId);
        if (existTag) {
            setTagsCreated((prev) => prev.filter((el) => el._id !== tagId));
        }
    };

    const getTagProduct = async () => {
        const rs = await apiGetTagByProduct(editProduct?._id);
        if (rs.success) setTagsCreated(rs.tag);
    };

    useEffect(() => {
        getTag();
        getTagProduct();
    }, [render]);

    const onDropSingleImage = async (acceptedFiles) => {
        setPreview((prev) => ({ ...prev, thumb: acceptedFiles[0] }));
    };

    const { getRootProps: getRootPropsSingle, getInputProps: getInputPropsSingle } = useDropzone({
        onDrop: onDropSingleImage,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: false,
    });

    return (
        <div className="font-semibold text-sm flex flex-col gap-2">
            <label>Tạo tag sản phẩm:</label>
            <div className="flex flex-col gap-4 border-[1px] border-gray-5  00 rounded p-2">
                <div>
                    <div>Tạo tag mới:</div>
                    <div className="flex gap-2 items-center mt-2">
                        <InputField
                            setValue={handleInputTagChange}
                            onKeyDown={handleCreateTagByInput}
                            placeholder="Nhập tag muốn tạo"
                            moreCss="!mt-0"
                            nameKey="tag"
                            value={tagInput.tag}
                        />
                        {preview?.thumb && (
                            <img
                                src={
                                    preview?.thumb instanceof File
                                        ? URL.createObjectURL(preview?.thumb)
                                        : preview?.thumb
                                }
                                alt=""
                                className="w-[40px] h-[40px] object-cover border-2 rounded-md"
                            />
                        )}
                        <div
                            {...getRootPropsSingle()}
                            className="w-[40px] h-[40px] p-1 flex justify-center items-center border-2 border-gray-300 
                        rounded-md bg-gray-100 border-dashed hover:bg-gray-200 animation-200 cursor-pointer"
                        >
                            <input {...getInputPropsSingle()} />
                            <FaCloudUploadAlt color="gray" size={32} />
                        </div>
                        <span onClick={handleCreateTagAction} className="btn-primary">
                            {loadingProductTag ? <Loading shape={<BeatLoader size={8} color="white" />} /> : 'Thêm tag'}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2 flex-col">
                    <div>Danh sách tag hiện có:</div>
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag) => (
                            <span
                                key={tag._id}
                                onClick={() => handleClickToTags(tag)}
                                className=" flex gap-1 items-center rounded-full px-2 py-1 text-white  cursor-pointer hover:opacity-90"
                                style={{ backgroundColor: tag.colorTag }}
                            >
                                {<img alt="" src={tag.iconTag} className="w-5 h-5 object-cover" />}
                                {tag.title}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mt-2 flex flex-col gap-4">
                    <div>Tag của sản phẩm:</div>
                    <div className="flex flex-wrap flex-row gap-2">
                        {tagsCreated?.map((el) => (
                            <span
                                style={{ backgroundColor: el?.colorTag }}
                                className="relative rounded-full px-2 py-1 text-white"
                                key={el?._id}
                            >
                                <IconsButton
                                    handleOnclick={() => handleRemoveTag(el?._id)}
                                    styles="absolute right-[-8px] top-[-8px] rounded-full p-1 bg-gray-200 cursor-pointer hover:bg-gray-300"
                                    icon={<IoMdClose color="black" />}
                                />
                                {el?.title}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(TagPreview);
