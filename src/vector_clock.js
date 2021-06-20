const time_map = new Map();

class VectorClock {
    constructor({
        start = 0
    } = {}) {
        this.start = start;
    }

    get time() {
        let sum = this.start + Object.values(Object.fromEntries(time_map)).reduce((acc, val) => acc + val, 0);
        return sum;
    }

    update(id = null) {
        time_map.set(id, (time_map.get(id) || 0) + 1);
        console.log(`updating clock for ${id}, total clock set to ${this.time}`);
        return this.time;
    }
}

module.exports = VectorClock;