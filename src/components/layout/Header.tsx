import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon } from '@heroicons/react/24/solid';
import ThemeController from './ThemeController';

/**
 * Header component
 *
 * Renders the top navigation bar of the application. It includes:
 * - A hamburger menu icon to toggle the sidebar on mobile.
 * - The application title.
 * - A theme switcher to toggle between light and dark modes.
 * - A user profile dropdown with user information and a logout button.
 */
const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-30 w-full">
            {/* Mobile Sidebar Toggle */}
            <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                    <Bars3Icon className="h-6 w-6" />
                </label>
            </div>

            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">ULibrary</a>
            </div>

            <div className="flex-none gap-2">
                {/* Theme Switcher */}
                <ThemeController />

                {/* User Dropdown */}
                {user && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                <span>{user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}</span>
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 z-10">
                            <li className="menu-title">
                                <span>{user.first_name} {user.last_name}</span>
                            </li>
                            <li><a onClick={logout}>Logout</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;