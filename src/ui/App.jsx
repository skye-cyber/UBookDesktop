import React, { useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { Header } from '@components/Header/Header';
import { LeftPanel } from '@components/Panels/LeftPanel';
import { RightPanel } from './components/Panels/RightPanel';
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
import { StateManager } from '../renderer/js/syscore/StatesManager';
import { SearchResultPage } from './Pages/Search';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <ErrorBoundary>
            <MainLayout>
                <Header />
                <div className='w-full h-[100vh] flex'>
                    <ErrorBoundary>
                        <LeftPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                        <ReaderUI />
                        <RightPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                    </ErrorBoundary>
                </div>
            </MainLayout>
            {/* Portal containers for vanilla JS components */}
            <ErrorBoundary>
                <StaticPortalContainer />
            </ErrorBoundary>
            <ErrorBoundary>
                <StreamingPortalContainer />
            </ErrorBoundary>
            <StatusUI />
            <SearchResultPage />
        </ErrorBoundary >
    );
};

export default App;
