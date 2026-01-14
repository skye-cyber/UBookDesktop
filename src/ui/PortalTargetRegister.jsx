import { waitForElement } from "../renderer/js/syscore/dom_utils";
import { reactPortalBridge } from "../renderer/js/react-portal-bridge";

waitForElement('#paper-container', (el) => {
    reactPortalBridge.registerContainer("paper-container", el);
    //streamingPortalBridge.registerStreamingComponent('mainContainer', el);
})
waitForElement('#reader-content', (el) => {
    reactPortalBridge.registerContainer('reader-content', el);
})

waitForElement('#main-layout', (el) => {
    reactPortalBridge.registerContainer("main-layout", el);
})

waitForElement('#message-container', (el) => {
    reactPortalBridge.registerContainer('messageContainer', el);
})


waitForElement('#confirm-dialog-container', (el) => {
    reactPortalBridge.registerContainer('confirm-dialog-container', el);
})

waitForElement('#quick-read-container', (el) => {
    reactPortalBridge.registerContainer('quick-read-container', el);
})

waitForElement('#notebody', (el) => {
    reactPortalBridge.registerContainer('notebody', el);
})
