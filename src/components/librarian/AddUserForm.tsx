import React, { useState } from 'react';
import api from '../../services/api';

interface AddUserFormProps {
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess, onError }) => {
    const [newUser, setNewUser] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', role: 'student' });

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users/', newUser);
            onSuccess('User created successfully!');
            setNewUser({ first_name: '', last_name: '', username: '', email: '', password: '', role: 'student' });
        } catch (err) {
            onError('Failed to create user. Check console for details.');
            console.error(err);
        }
    };

    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Add New User</h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="form-control">
                        <input type="text" placeholder="Username" className="input input-bordered" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="text" placeholder="First Name" className="input input-bordered" value={newUser.first_name} onChange={e => setNewUser({ ...newUser, first_name: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="text" placeholder="Last Name" className="input input-bordered" value={newUser.last_name} onChange={e => setNewUser({ ...newUser, last_name: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="email" placeholder="Email" className="input input-bordered" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <input type="password" placeholder="Password" className="input input-bordered" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select className="select select-bordered" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                            <option value="student">Student</option>
                            <option value="librarian">Librarian</option>
                        </select>
                    </div>
                    <div className="card-actions justify-end">
                        <button type="submit" className="btn btn-primary">Create User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;