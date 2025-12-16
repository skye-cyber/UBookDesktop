import React, { useState } from 'react';
import { MainLayout } from '@components/Layout/MainLayout';
import { Header } from '@components/Header/Header';
import { Sidebar } from '@components/Panels/LeftPanel';
import ErrorBoundary from '@components/ErrorHandler/ErrorBoundary';
import '@css/styles.css';
//import { StatusUI } from '@components/StatusUI/StatusUI.jsx';
//import '@js/StatusUIManager/SuccessModal.js'
//import { NotificationFlyer, Notifcation } from '@components/Notifications/Notification.jsx'
import '@js/shortcuts/keyshortcuts';
import { StaticPortalContainer } from './StaticPortalContainer';
import { StreamingPortalContainer } from './StreamingPortalContainer';
import '../renderer/js/react-portal-bridge';
import './PortalTargetRegister';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <ErrorBoundary>
            <MainLayout>
                <Header />
                <div data-portal-container="main-container" id="main-container" className='flex flex-1 overflow-hidden max-w-full'>
                    <div className='flex flex-shrink'>
                        <ErrorBoundary>
                            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                        </ErrorBoundary>
                    </div>
                    <ErrorBoundary>
                        <Canvas isOpen={isCanvasOpen} onToggle={toggleCanvas} />
                    </ErrorBoundary>
                </div>
                <ErrorBoundary>
                    <NotificationFlyer isOpen={true} onToggle={null} />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Notifcation isOpen={true} onToggle={null} />
                </ErrorBoundary>
            </MainLayout>
            {/* Portal containers for vanilla JS components */}
            <ErrorBoundary>
                <StaticPortalContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <StreamingPortalContainer />
            </ErrorBoundary>
        </ErrorBoundary >
    );
};

export default App;
