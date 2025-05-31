// === components/Utils/modals.js === //
class modalHandler {
    constructor(message = null, timeout = null) {
        this.message = message
        this.modals = {
            'load':
            `
            <!-- Loading Modal -->
            <div id="loadingModal-G" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-41">
            <div id="modalMainBox-G" class="bg-white p-6 rounded-lg shadow-lg flex flex-row items-center animate-exit transition-all duration-1000 gap-4">
            <p id="loadingMSG-G" class="mt-3 text-gray-700">Processing, please wait...</p>
            <!-- Spinner Animation -->
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-150"></div>
            </div>
            </div>
            `,
            'success':
            `
            <!-- General Success Modal -->
            <div id="success-modal-GN" class="fixed top-4 right-[40vw] max-w-xs px-6 py-4 rounded shadow-lg dark:bg-gray-800 dark:text-yellow-100 rounded-lg shadow-lg transform translate-x-[100vw] transition-transform duration-500 ease-out z-[30]">
            <div id="successBoxBody-GN" class="bg-white dark:bg-gray-800 max-w-sm text-center duration-700">
            <!-- Animated Checkmark -->
            <div class="flex items-center justify-center">
            <div class="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center animate-scale delay-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 animate-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 13l4 4L19 7"></path>
            </svg>
            </div>
            </div>

            <!-- Success Message -->
            <p id="SuccessMsg-GN" class="text-sm text-gray-600 dark:text-gray-300 mt-2">Your action was completed successfully.</p>

            <!-- Close Button -->
            <button id="CloseSucsessModal-GN" onclick="_modalHandler.hide('success')" class="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
            OK
            </button>
            </div>
            </div>
            `,
            'error':
            `
            <!-- Error Modal -->
            <div id="errorModal-GN" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-41">
            <div id="errorBox-GN" class="bg-white p-6 rounded-lg shadow-lg min-w-80 max-w-[90vw] md:max-w-[70vw] animate-exit transition-all duration-700 backdrop-brightness-30">
            <h2 class="text-lg font-semibold text-red-600">Error!</h2>
            <p id="error-message-GN" class="mt-2 text-gray-600" id="errorMessage">Something went wrong.</p></p>
            <section class="flex justify-center">
            <button onclick="_modalHandler.hide('error')" class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Close
            </button>
            </section>
            </div>
            </div>
            `,
            'warning':
            `
            <!-- Warning Modal Container -->
            <div id="warningModal" class="fixed top-4 right-4 max-w-xs p-4 rounded shadow-lg
            bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100
            transform translate-x-[100vw] opacity-0 transition-transform duration-1000 ease-out pointer-events-none z-50">
            <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12" y2="17" />
            </svg>
            <span id="warningText" class="font-medium"></span>
            </div>
            </div>
            `,
        }
        this.Timeout = timeout;
    }

    init1() {
        setTimeout(() => {
            this.loadText = document.getElementById('loadingMSG-G');
            this.loadModal = document.getElementById('loadingModal-G');
            this.loadBox = document.getElementById('modalMainBox-G');
            this.warnModal = document.getElementById('warningModal');
            this.warnText = document.getElementById('warningText');
            this.successModal = document.getElementById('success-modal-GN');
            this.successBox = document.getElementById('successBoxBody-GN')
            this.successText = document.getElementById('SuccessMsg-GN')
            this.errorModal = document.getElementById('errorModal-GN');
            this.errorBox = document.getElementById('errorBox-GN');
            this.errorText = document.getElementById('error-message-GN');
        }, 50)
    }
    add(content, _id, _className) {
        const modalSection = document.createElement('section');
        if (_className) modalSection.className = _className;
        if (_id) modalSection.id = _id;
        modalSection.innerHTML = content;
        document.querySelector('main').appendChild(modalSection);
    }
    addAll() {
        ['load', 'success', 'error', 'warning'].forEach(md => {
            this.add(this.modals[md], null, null)
        })
        this.init1();
    }
    remove(selector) {
        const element = document.getElementById(selector) || document.querySelector(`.${selector}`);
        if (element) {
            return document.remove(element)
        }
        return false;
    }
    show(modalType, text = this.message, html=false) {
        if (modalType === 'load') {
            console.log("Loading")
            // Clear any hide timers
            if (this.Timeout) clearTimeout(this.Timeout);

            if (text !== null) this.loadText.textContent = text;

            // Reset to hidden state first
            this.loadModal.classList.remove('hidden');
            this.loadBox.classList.remove('animate-exit');
            this.loadBox.classList.add('animate-enter')
            return true
        } else if (modalType === 'success') {
            if (text){
                html ? (this.successText.innerHTML = text) : this.successText.textContent = text;
            }
            this.successModal.classList.remove('translate-x-[100vw]', 'hidden');
            this.successModal.classList.add('translate-x-0');

            return true
        } else if (modalType === 'error') {
            if (text) this.successText.textContent = text;
            this.errorModal.classList.remove('hidden');
            this.errorBox.classList.remove('animate-exit');
            this.errorBox.classList.add('animate-enter')
            return true
        } else if (modalType === 'warn') {
            if (text) html ? (this.warnText.innerHTML = text) : this.warnText.textContent = text;

            if (this.Timeout) clearTimeout(this.Timeout);
            // Use setTimeout 0 to force a tick, then add classes to trigger animation
            setTimeout(() => {
                this.warnModal.classList.remove('translate-x-[100vw]', 'opacity-0', 'pointer-events-none');
                this.warnModal.classList.add('translate-x-0', 'opacity-100', 'pointer-events-auto');
            }, 30);
            return true
        }
    }
    hide(modalType) {
        if (modalType === 'load') {
            this.loadBox.classList.remove('animate-enter')
            this.loadBox.classList.add('animate-exit');
            setTimeout(() => {
                this.loadModal.classList.add('hidden');
            }, 310)
            return true
        } else if (modalType === 'success') {
            this.successModal.classList.remove('translate-x-0')
            this.successModal.classList.add('translate-x-[100vw]');
            setTimeout(() => {
                this.successModal.classList.add('hidden');
            }, 310)
            return true
        } else if (modalType === 'error') {
            this.errorBox.classList.remove('animate-enter')
            this.errorBox.classList.add('animate-exit');
            setTimeout(() => {
                this.errorModal.classList.add('hidden');
            }, 310)
            return true
        } else if (modalType === 'warn') {
            this.warnModal.classList.remove('translate-x-0', 'opacity-100', 'pointer-events-auto');
            this.warnModal.classList.add('translate-x-[100vw]')
            this.Timeout = setTimeout(() => {
                this.warnModal.classList.add('opacity-0', 'pointer-events-none');
            }, this.Timeout || 100);
            return true
        }
    }
    _isSet(elementId) {
        return (document.querySelector(`#${elementId}`)) ? true : false;
    }
}

const _modalHandler = new modalHandler()
_modalHandler.addAll()
