import { Dialog, Transition } from '@headlessui/react';
import { Fragment, memo } from 'react';

const ModalUI = ({ children, isOpen, onClose, isPreviewImg }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-[999]" onClose={onClose}>
                <div className="min-h-screen flex items-center justify-center">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay
                            className={`fixed inset-0 ${isPreviewImg ? 'bg-overlay_preview' : 'bg-overlay'}`}
                        />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition duration-200 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-200 ease-in"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <div className="relative phone:w-full iPadmini:w-auto">{children}</div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default memo(ModalUI);
