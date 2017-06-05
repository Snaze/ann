/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
class EasingFunctions {
    // no easing, no acceleration
    static linear(t) { return t }

    // accelerating from zero velocity
    static easeInQuad(t) { return t*t }

    // decelerating to zero velocity
    static easeOutQuad(t) { return t*(2-t) }

    // acceleration until halfway, then deceleration
    static easeInOutQuad(t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t }

    // accelerating from zero velocity
    static easeInCubic(t) { return t*t*t }

    // decelerating to zero velocity
    static easeOutCubic(t) { return (--t)*t*t+1 }

    // acceleration until halfway, then deceleration
    static easeInOutCubic(t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 }

    // accelerating from zero velocity
    static easeInQuart(t) { return t*t*t*t }

    // decelerating to zero velocity
    static easeOutQuart(t) { return 1-(--t)*t*t*t }

    // acceleration until halfway, then deceleration
    static easeInOutQuart(t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }

    // accelerating from zero velocity
    static easeInQuint(t) { return t*t*t*t*t }

    // decelerating to zero velocity
    static easeOutQuint(t) { return 1+(--t)*t*t*t*t }

    // acceleration until halfway, then deceleration
    static easeInOutQuint(t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }

    /**
     * At t = 1, maxValue is returned
     * At t = 0, minValue is returned
     * At t in [0 .. 1], a value between minValue and maxValue is returned
     * @param easingFunction
     * @param t
     * @param minValue
     * @param maxValue
     * @returns {*}
     */
    static doCalculation(easingFunction, t, minValue, maxValue) {
        if (minValue > maxValue) {
            throw new Error("MinValue should be less than max value");
        }

        let newMax = maxValue - minValue;
        // let newMin = 0; // minValue - minValue;

        let newT = easingFunction(t);
        return (newT * newMax) + minValue;
    }

    static getTime(minTime, maxTime, currentTime, invert=false) {
        if (minTime >= maxTime) {
            throw new Error("minTime should be less than maxTime");
        }

        if (currentTime < minTime) {
            throw new Error("currentTime should be >= minTime");
        }

        if (currentTime > maxTime) {
            throw new Error("currentTime should be <= maxTime");
        }

        let newMax = maxTime - minTime;
        let newCurrentTime = currentTime - minTime;
        // let newMin = 0; // minTime - minTime

        let toRet = newCurrentTime / newMax;
        if (!invert) {
            return toRet;
        }

        return (1.0 - toRet);
    }
}

export default EasingFunctions;