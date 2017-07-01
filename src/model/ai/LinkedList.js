import {assert} from "../../utils/Assert";


class LinkedList {

    static createNode(prev, next, value) {
        return {
            prev: prev,
            next: next,
            value: value
        };
    }

    constructor() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    prepend(item) {
        if (this._head === null) {
            assert (this._tail === null, "tail must be null too");

            this._head = LinkedList.createNode(null, null, item);
            this._tail = this._head;
        } else {
            let previousHead = this._head;
            this._head = LinkedList.createNode(null, previousHead, item);
            previousHead.prev = this._head;
        }

        this._length++;
    }

    append(item) {
        if (this._head === null) {
            assert (this._tail === null, "tail must be null too");

            this._head = LinkedList.createNode(null, null, item);
            this._tail = this._head;
        } else {
            let previousTail = this._tail;
            this._tail = LinkedList.createNode(previousTail, null, item);
            previousTail.next = this._tail;
        }

        this._length++;
    }

    popFront() {
        if (this._head === null) {
            return null;
        }

        let previousHead = this._head;
        if (this._head === this._tail) {
            this._head = null;
            this._tail = null;
        } else {
            this._head = previousHead.next;
            this._head.prev = null;
        }

        previousHead.next = null;
        assert (previousHead.prev === null, "prev should always be null on head");

        this._length--;

        return previousHead.value;
    }

    popRear() {
        if (this._tail === null) {
            return null;
        }

        let previousTail = this._tail;
        if (this._head === this._tail) {
            this._head = null;
            this._tail = null;
        } else {
            this._tail = previousTail.prev;
            this._tail.next = null;
        }

        previousTail.prev = null;
        assert (previousTail.next === null, "next should always be null on tail");

        this._length--;

        return previousTail.value;
    }

    contains(item, fetchIdFunction=null) {

        for (let curr = this._head; curr !== null; curr = curr.next) {
            if (!!fetchIdFunction) {
                if (fetchIdFunction(item) === fetchIdFunction(curr.value)) {
                    return true;
                }
            } else {
                if (item === curr.value) {
                    return true;
                }
            }
        }

        return false;
    }

    iterateOver(theCallback) {
        if (this._head === null) {
            return; // Nothing to do
        }
        let index = 0;

        for (let current = this._head; current !== null; current = current.next) {
            theCallback(current.value, index);
            index++;
        }
    }

    get head() {
        return this._head;
    }

    get tail() {
        return this._tail;
    }

    get length() {
        return this._length;
    }
}

export default LinkedList;