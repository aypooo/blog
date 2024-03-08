import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../recoil";

type OpenModalType = {
    title?: string;
    content: JSX.Element | string;
    hasCancelButton?: boolean;
    // hasConfirmButton?: boolean;
    callback?: () => any;
};

export const useModal = () => {
    const [modalDataState, setModalDataState] = useRecoilState(modalState);

    const closeModal = useCallback(
        () => setModalDataState(prev => ({ ...prev, isOpen: false })),
        [setModalDataState]
    );

    const openModal = useCallback(
        ({ title, content, hasCancelButton, callback }: OpenModalType) => {
            setModalDataState({
                isOpen: true,
                title: title || "",
                content: content,
                hasCancelButton: hasCancelButton,
                callBack: callback
            });
        },
        [setModalDataState]
    );

    return { modalDataState, closeModal, openModal };
};
