import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, memo } from 'react';
import { Icons } from 'Layouts/Assets/icons';

const { IoIosSend } = Icons;

const CommentBox = forwardRef(({ handleOnclick, el, setCommentText, setIsEdit, editBox }, ref) => {
    return (
        <AnimatePresence>
            <div>
                <div className="w-[500px] mt-2 relative">
                    <motion.div
                        initial={{ minHeight: 0, paddingTop: 0, paddingBottom: 0 }}
                        animate={{ minHeight: '50px', paddingTop: '12px', paddingBottom: '12px' }}
                        exit={{ minHeight: 0, overflow: 'hidden', paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center outline-none text-sm rounded-[16px] border border-gray-300 p-3 w-full overflow-hidden bg-gray-50"
                        ref={ref}
                        contentEditable
                        onInput={(e) => setCommentText(e.target.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: editBox && el.text }}
                    />
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => handleOnclick(el._id)}
                        className="absolute bottom-2 right-2 cursor-pointer hover:scale-110 animation-200"
                    >
                        <IoIosSend size="24px" color="#db2777" />
                    </motion.button>
                </div>
                <div className="flex gap-2 items-center">
                    {editBox && (
                        <span
                            className="underline cursor-pointer text-[12px] hover:text-main ml-2"
                            onClick={() => setIsEdit(false)}
                        >
                            Hủy
                        </span>
                    )}
                </div>
            </div>
        </AnimatePresence>
    );
});

export default memo(CommentBox);
