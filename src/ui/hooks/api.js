let globalIsDev = false;

export const appIsDev = async () => {
    try {
        globalIsDev = await window.ubook.system.isDev();
        return globalIsDev || false;
    } catch (error) {
        console.error('Error checking dev mode:', error);
        return false;
    }
};
