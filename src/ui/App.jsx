import React, { useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { Header } from '@components/Header/Header';
import { BookContentPanel } from '@components/Panels/BookContentPanel';
import { QuickReadPanel } from './components/Panels/QuickReadPanel';
import { ReaderUI } from './components/Reader/ui';
import ErrorBoundary from '@components/ErrorHandler/ErrorBoundary';
import '@css/styles.css';
import { StatusUI } from '@components/StatusUI/StatusUI.jsx';
//import '@js/StatusUIManager/SuccessModal.js'
//import { NotificationFlyer, Notifcation } from '@components/Notifications/Notification.jsx'
import '@js/shortcuts/keyshortcuts';
import { StaticPortalContainer } from './StaticPortalContainer';
import { StreamingPortalContainer } from './StreamingPortalContainer';
import '../renderer/js/react-portal-bridge';
import './PortalTargetRegister';
import '../renderer/js/syscore/StatesManager';
import '../renderer/js/Status/Manager';
import { NotesPage } from './Pages/Notes';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <ErrorBoundary>
            <MainLayout>
                <Header />
                <div className='w-full h-[100vh] flex'>
                    <ErrorBoundary>
                        <QuickReadPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                        <ReaderUI />
                        <BookContentPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                    </ErrorBoundary>
                </div>
                {/* status display modals */}
                <div data-portal-container='messageContainer'
                    id='message-container'
                    className='fixed top-5 right-5 z-[50] min-w-sm w-fit max-w-lg transform transition-all duration-700 ease-in-out'>
                </div>
                {/* confirm dialog */}
                <div data-portal-container='confirm-dialog-container' id='confirm-dialog-container'></div>
            </MainLayout>
            {/* Portal containers for vanilla JS components */}
            <ErrorBoundary>
                <StaticPortalContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <StreamingPortalContainer />
            </ErrorBoundary>
            <StatusUI />
            <NotesPage />
        </ErrorBoundary >
    );
};

export default App;
