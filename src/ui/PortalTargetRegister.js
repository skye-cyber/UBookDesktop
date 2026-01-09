import { waitForElement } from "../renderer/js/syscore/dom_utils";

waitForElement('#paper-container', (el) => {
    window.reactPortalBridge.registerContainer("paper-container", el);
    //window.streamingPortalBridge.registerStreamingComponent('mainContainer', el);
})
waitForElement('#reader-content', (el) => {
    window.reactPortalBridge.registerContainer('reader-content', el);
})

waitForElement('#main-layout', (el) => {
    window.reactPortalBridge.registerContainer("main-layout", el);
})

waitForElement('#message-container', (el) => {
    window.reactPortalBridge.registerContainer('messageContainer', el);
})


waitForElement('#confirm-dialog-container', (el) => {
    window.reactPortalBridge.registerContainer('ConfirmdialogContainer', el);
})

waitForElement('#quick-read-container', (el) => {
    window.reactPortalBridge.registerContainer('quick-read-container', el);
})
