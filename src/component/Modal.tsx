import { useModal } from "../hook/useModal";
import Button from "./Button";

const Modal = () => {
    const { modalDataState, closeModal } = useModal();

    return (
        <>
            {modalDataState.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{modalDataState.title}</p>
                        <p>{modalDataState.content}</p>
                        <div className="modal-content__buttons">
                            {modalDataState.hasCancelButton && (
                                <Button label='취소' size="s" onClick={closeModal}/>
                            )}
                            <Button label='확인' size="s" onClick={modalDataState.callBack}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;