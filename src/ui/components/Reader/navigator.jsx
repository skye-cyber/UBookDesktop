export class BookNavigator {
    static nextSection() {
        const current_section = window.StateManager.get('active_section')
        if (!current_section) return window.ModalManager.showMessage('Activate/Open a section first.', 'info')
            console.log(current_section.parentElement)
            const nextEntry = current_section.nextElementSibling || null;

        nextEntry ? nextEntry.click() : window.ModalManager.showMessage('End of Chapter!', 'warning')
    }
    static previousSection() {
        const current_section = window.StateManager.get('active_section')
        if (!current_section) return window.ModalManager.showMessage('Activate/Open a section first.', 'info')

            const previousEntry = current_section.nextElementSibling || null;

        previousEntry ? previousEntry.click() : window.ModalManager.showMessage('Reached Beginning of Chapter!', 'warning')
    }
}
