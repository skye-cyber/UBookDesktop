import { reactPortalBridge } from "../../../../renderer/js/react-portal-bridge"

export class LoadingSpinner {
    constructor() {
        //
    }
    open(text) {
        reactPortalBridge.showComponentInTarget('LoadingSpinner', 'reader-content', { text: text }, 'loadingspinner')
    }
    close() {
        try {
            reactPortalBridge.closeComponent('loadingspinner', true)
        } catch (err) { }
    }
}

export const loadingspinner = new LoadingSpinner()
