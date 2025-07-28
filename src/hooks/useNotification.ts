import { useState, useEffect } from 'react';

export interface Notification {
    message: string;
    type: 'success' | 'error';
}

/**
 * A custom hook to manage toast notifications.
 * @param {number} duration - The duration in milliseconds for the toast to be visible.
 * @returns An object containing the current notification and a function to show a new one.
 */
export const useNotification = (duration: number = 5000) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), duration);
            return () => clearTimeout(timer);
        }
    }, [notification, duration]);

    return { notification, showNotification: setNotification };
};