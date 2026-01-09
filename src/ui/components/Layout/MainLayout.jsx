import React from 'react';

export const MainLayout = ({ children }) => {
    return (
        <div
            data-portal-container='main-layout'
            id="main-layout"
            className="h-screen w-screen overflow-hidden">
            {children}
        </div>
    );
};
