import { reactPortalBridge } from "../../../../renderer/js/react-portal-bridge"

export class LoadingSpinner {
    constructor() {
        //
    }
    open(text) {
        reactPortalBridge.showComponentInTarget('LoadingSpinner', 'reader-content', { text: text }, 'loadingspinner')
    }
    close() {
        reactPortalBridge.closeComponent('loadingspinner', true)
    }
}

export const loadingspinner = new LoadingSpinner()
