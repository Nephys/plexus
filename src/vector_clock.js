const time_map = new Map();

class VectorClock {
    constructor(options = {}) {
        this.start = options.start || 0;
    }

    get time() {
        let sum = this.start + Object.values(Object.fromEntries(time_map)).reduce((acc, val) => acc + val, 0);
        return sum;
    }

    update(id = null) {
        time_map.set(id, (time_map.get(id) || 0) + 1);
        return this.time;
    }
}

module.exports = VectorClock;