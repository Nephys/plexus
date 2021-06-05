class VectorClock {
    constructor(options = {}) {
        this.id = options.id;

        this.time = options.start || 0;
    }

    update() {
        this.time++;
        return this.time;
    }
}

module.exports = VectorClock;