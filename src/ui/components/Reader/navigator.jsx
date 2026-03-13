import { modalmanager } from "../../../common/Status/Manager";
import { StateManager } from "../../../common/syscore/StatesManager";

export class BookNavigator {
    static nextSection() {
        const current_section = StateManager.get('active_section')
        if (!current_section) return modalmanager.showMessage('Activate/Open a section first.', 'info')
            const nextEntry = current_section.nextElementSibling || null;

        nextEntry ? nextEntry.click() : modalmanager.showMessage('End of Chapter!', 'warning')
    }
    static previousSection() {
        const current_section = StateManager.get('active_section')
        if (!current_section) return modalmanager.showMessage('Activate/Open a section first.', 'info')
            const previousEntry = current_section.previousElementSibling || null;

        previousEntry ? previousEntry.click() : modalmanager.showMessage('Reached Beginning of Chapter!', 'warning')
    }
}
