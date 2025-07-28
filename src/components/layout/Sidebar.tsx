import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BookOpenIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/solid';

/**
 * Sidebar component
 *
 * Renders the navigation sidebar for the application. It displays different
 * menu options based on the authenticated user's role. Uses NavLink for
 * active route styling.
 */
const Sidebar: React.FC = () => {
    const { user } = useAuth();

    const librarianMenu = (
        <>
            <li><NavLink to="/dashboard/checkouts"><ClipboardDocumentListIcon className="h-5 w-5" /> Active Checkouts</NavLink></li>
            <li><NavLink to="/dashboard/inventory"><BookOpenIcon className="h-5 w-5" /> Book Inventory</NavLink></li>
            <li><NavLink to="/dashboard/management"><Cog6ToothIcon className="h-5 w-5" /> Management</NavLink></li>
        </>
    );

    const studentMenu = (
        <>
            <li><NavLink to="/dashboard/books"><BookOpenIcon className="h-5 w-5" /> Available Books</NavLink></li>
            <li><NavLink to="/dashboard/my-checkouts"><ClipboardDocumentListIcon className="h-5 w-5" /> My Checkouts</NavLink></li>
        </>
    );

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                {user?.role === 'librarian' ? librarianMenu : studentMenu}
            </ul>
        </div>
    );
};

export default Sidebar;