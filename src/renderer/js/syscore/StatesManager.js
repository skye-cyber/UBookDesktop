export const StateManager = (() => {
    const state = {};
    const listeners = {};

    return {
        set(key, value) {
            state[key] = value;
            (listeners[key] || []).forEach(fn => fn(value));
        },
        get(key) {
            return state[key];
        },
        all(){
            return state
        },
        subscribe(key, callback) {
            if (!listeners[key]) listeners[key] = [];
            listeners[key].push(callback);
        }
    };
})();
