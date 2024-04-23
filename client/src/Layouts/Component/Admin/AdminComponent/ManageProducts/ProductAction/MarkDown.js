import { memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkDown = ({ label, value, changeValue, name }) => {
    return (
        <div className="flex flex-col mt-4">
            <label className="text-sm font-semibold">{label}</label>
            <Editor
                apiKey={process.env.REACT_APP_TINYMCE}
                initialValue={value}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'preview',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onChange={(e) => changeValue((prev) => ({ ...prev, [name]: e.target.getContent() }))}
            />
        </div>
    );
};

export default memo(MarkDown);
