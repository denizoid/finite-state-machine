class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        this.state = config.initial;
        this.history = [];
        this.undo_history = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        for (let key in this.config.states) {
            if (key == state) {
                this.undo_history = [];
                this.history.push(this.state);
                this.state = state;
                return;
            } 
        }
        throw new Error();
      }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for (let key in this.config.states[this.state].transitions) {
            if (key == event) {
                this.history.push(this.state);
                this.undo_history = [];
                this.state = this.config.states[this.state].transitions[key];
                return;
           }
        }
        throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.history.push(this.state);
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        let all = [];
        for (let state in this.config.states) {
            all.push(state);
            for (let key in this.config.states[state].transitions) {
                if (key == event) result.push(state); 
            }
        }
        if (event == undefined) return all;
        if (result.length == 0) return [];
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length == 0) {
            return false;
        }
        this.undo_history.push(this.state);
        this.state = this.history.pop();
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.undo_history.length == 0) return false;
        // this.history.push(this.undo_history(this.undo_history.length-1));
        this.history.push(this.state);
        this.state = this.undo_history.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undo_history = [];
        this.history = [];
    }
}



module.exports = FSM;

/** @Created by Uladzimir Halushka **/
