import React from 'react';
import AddBookForm from '../../components/librarian/AddBookForm';
import AddUserForm from '../../components/librarian/AddUserForm';
import { useNotification } from '../../hooks/useNotification';

const Management: React.FC = () => {
    const { notification, showNotification } = useNotification();

    return (
        <div>
            {notification && (
                <div className="toast toast-top toast-end z-[9999]">
                    <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Management</h1>
            <div role="tablist" className="tabs tabs-lifted">
                <input type="radio" name="management_tabs" role="tab" className="tab" aria-label="Add Book" defaultChecked />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <AddBookForm
                        onSuccess={(message) => showNotification({ message, type: 'success' })}
                        onError={(message) => showNotification({ message, type: 'error' })}
                    />
                </div>

                <input type="radio" name="management_tabs" role="tab" className="tab" aria-label="Add User" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <AddUserForm
                        onSuccess={(message) => showNotification({ message, type: 'success' })}
                        onError={(message) => showNotification({ message, type: 'error' })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Management;