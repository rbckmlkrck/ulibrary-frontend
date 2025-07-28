import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaPalette } from 'react-icons/fa';

const ThemeController: React.FC = () => {
    const { theme, setTheme, themes } = useTheme();

    return (
        <div title="Change Theme" className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
                <FaPalette className="h-5 w-5" />
                <span className="hidden md:inline">Theme</span>
                <svg width="12px" height="12px" className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <div tabIndex={0} className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[70vh] max-h-96 w-56 overflow-y-auto shadow-2xl mt-16 z-50">
                <div className="grid grid-cols-1 gap-3 p-3">
                    {themes.map((item) => (
                        <button key={item} className={`btn btn-sm btn-block btn-ghost justify-start ${theme === item ? 'btn-active' : ''}`} onClick={() => setTheme(item)} >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeController;