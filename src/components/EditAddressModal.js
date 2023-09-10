import React from 'react';

const EditAddressModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                {/* Add your modal content here */}
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                <h2>Edit Address</h2>
                {/* Replace with your address editing form */}
                {/* ... */}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EditAddressModal;