import { CloseModalButton } from 'Layouts/Component/public/Common';
import { useDropzone } from 'react-dropzone';
import { Icons } from 'Layouts/Assets/icons';
import { memo } from 'react';

const { FaCloudUploadAlt } = Icons;

const UploadImages = ({ setPreview, preview }) => {
    const handleDeleteThumb = () => {
        setPreview((prev) => ({ ...prev, thumb: null }));
    };

    const handleDeleteImages = (image) => {
        const images = preview.images.filter((el) => el !== image);
        setPreview((prev) => ({ ...prev, images: images }));
    };

    const onDropSingleImage = async (acceptedFiles) => {
        setPreview((prev) => ({ ...prev, thumb: acceptedFiles[0] }));
    };

    const onDropMultipleImages = async (acceptedFiles) => {
        setPreview((prev) => ({ ...prev, images: [...prev.images, ...acceptedFiles] }));
    };

    const { getRootProps: getRootPropsSingle, getInputProps: getInputPropsSingle } = useDropzone({
        onDrop: onDropSingleImage,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: false,
    });

    const { getRootProps: getRootPropsMultiple, getInputProps: getInputPropsMultiple } = useDropzone({
        onDrop: onDropMultipleImages,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
        },
        multiple: true,
    });

    return (
        <>
            <div className="mt-4">
                <div className="font-semibold">Tải ảnh đại diện:</div>
                <div className="flex gap-2">
                    <div
                        {...getRootPropsSingle()}
                        className="w-[100px] h-[100px] flex justify-center items-center border-2 border-gray-300 
                        rounded-md bg-gray-100 border-dashed hover:bg-gray-200 animation-200 cursor-pointer"
                    >
                        <input {...getInputPropsSingle()} />
                        <FaCloudUploadAlt color="gray" size={32} />
                    </div>
                    {preview?.thumb && (
                        <div className="relative">
                            <img
                                src={
                                    preview?.thumb instanceof File
                                        ? URL.createObjectURL(preview?.thumb)
                                        : preview?.thumb
                                }
                                alt=""
                                className="w-[100px] h-[100px] object-cover border-2 rounded-md"
                            />
                            <CloseModalButton
                                onClose={handleDeleteThumb}
                                styles="absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] p-1 rounded-full bg-gray-300 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <div className="font-semibold">Tải nhiều hình ảnh:</div>
                <div className="flex gap-2">
                    <div
                        {...getRootPropsMultiple()}
                        className="w-[100px] h-[100px] flex justify-center items-center border-2 border-gray-300 
                        rounded-md bg-gray-100 border-dashed hover:bg-gray-200 animation-200 cursor-pointer"
                    >
                        <input {...getInputPropsMultiple()} />
                        <FaCloudUploadAlt color="gray" size={32} />
                    </div>
                    <div className="flex gap-2">
                        {preview?.images?.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                    alt={`Uploaded ${index}`}
                                    className="w-[100px] h-[100px] object-cover border-2 rounded-md"
                                />
                                <CloseModalButton
                                    onClose={() => handleDeleteImages(image)}
                                    styles="absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] p-1 rounded-full bg-gray-300 cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(UploadImages);
