import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * MainLayout component
 *
 * This component defines the main structure of the authenticated application,
 * using a drawer layout from daisyUI. It includes a persistent sidebar for
 * navigation and a main content area where the current page's component
 * is rendered via the <Outlet />.
 */
const MainLayout: React.FC = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center">
                <Header />
                <main className="flex-1 p-6 w-full">
                    <Outlet />
                </main>
            </div>
            <Sidebar />
        </div>
    );
};

export default MainLayout;