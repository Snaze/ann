
const none = 0;
const little = 1;
const big = 2;
const all = [none, little, big];

class Dot {
    static get NONE() { return none; }
    static get LITTLE() { return little; }
    static get BIG() { return big; }

    static isValid(value) {
        return all.indexOf(value) > -1;
    }

    static get ALL() { return all; }
}

export default Dot;