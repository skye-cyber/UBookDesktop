import { reactPortalBridge } from "../../../../common/react-portal-bridge"

export class LoadingSpinner {
    constructor() {
        //
    }
    async open(text) {
        const portalId = reactPortalBridge.showComponentInTarget('LoadingSpinner', 'reader-content', { text: text }, 'loadingspinner')
        return portalId
    }
    close() {
        try {
            reactPortalBridge.closeComponent('loadingspinner', true)
        } catch (err) { }
    }
}

export const loadingspinner = new LoadingSpinner()
