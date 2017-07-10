import { assert } from "../../utils/Assert";

const max_heap = 0;
const min_heap = 1;

/**
 * This is an implementation of a Heap.
 * TODO: finish commenting this class.
 */
class Heap {

    /**
     * This is the Max HEAP_TYPE.
     * @returns {number}
     */
    static get HEAP_TYPE_MAX() { return max_heap; }

    /**
     * This is the Min HEAP_TYPE.
     * @returns {number}
     */
    static get HEAP_TYPE_MIN() { return min_heap; }

    /**
     * The constructor for the Heap.
     * @param type {Number} Use the static HEAP_TYPE members of this class.  Designates this as a min
     * or a max heap.
     * @param theArray {Array} The array you wish to heapify.  If you leave as null, one will be created.
     * @param keyFieldName {String} This will be used to extract the value of each object that is inserted. If
     * this is left as null, it will be assumed that you are inserting / extracting primitive numbers.
     * @param maxSize {Number} This specifies the maximum size of the heap.
     * @constructor
     */
    constructor(type=Heap.HEAP_TYPE_MAX, theArray=null, keyFieldName=null, maxSize=Number.POSITIVE_INFINITY) {
        if (theArray === null) {
            theArray = [];
        }

        this._type = type;
        // First element is always ignored
        this._array = [null].concat(theArray);
        this._heapSize = 0;
        this._isHeapified = false;
        this._keyFieldName = keyFieldName;
        this._maxSize = maxSize;
    }

    /**
     * This returns the parent element index of element i in the storing array
     * @param i {Number} The element you wish to find the parent of.
     * @returns {number} The parent element index in the storing array.
     */
    static parent(i) {
        return Math.floor(i/2);
    }

    /**
     * This returns the left child of element i in the storing array.
     * @param i {Number} The element you wish to find the left child of.
     * @returns {number} The index of the left child of i.
     */
    static left(i) {
        return 2 * i;
    }

    static right(i) {
        return (2 * i) + 1;
    }

    leftChild(i) {
        return this.getArrayItem(Heap.left(i));
    }

    rightChild(i) {
        return this.getArrayItem(Heap.right(i));
    }

    parent(i) {
        return this.getArrayItem(Heap.parent(i));
    }

    getArrayValue(i) {
        let item = this.getArrayItem(i);

        if (item instanceof Object) {
            assert (this._keyFieldName !== null, "_keyFieldName must be set");
            return item[this._keyFieldName];
        }

        return item;
    }

    getArrayItem(i) {
        return this._array[i];
    }

    setArrayItem(i, item) {
        this._array[i] = item;

        if (item instanceof Object) {
            assert (this._keyFieldName !== null, "_keyFieldName must be set");
            item.__heap_index = i; // Hmmmm, is this bootleg?
        }
    }

    get type() {
        return this._type;
    }

    _maxHeapProperty(i) {
        return this.getArrayValue(Heap.parent(i)) >= this.getArrayValue(i);
    }

    _minHeapProperty(i) {
        return this.getArrayValue(Heap.parent(i)) <= this.getArrayValue(i);
    }

    heapProperty(i) {
        if (this.type === Heap.HEAP_TYPE_MAX) {
            return this._maxHeapProperty(i);
        }

        return this._minHeapProperty(i);
    }

    _maxHeapify(i) {
        // Left and right child indices
        let l = Heap.left(i);
        let r = Heap.right(i);
        let largest = i;

        if (l <= this._heapSize && this.getArrayValue(l) > this.getArrayValue(i)) {
            largest = l;
        }

        if (r <= this._heapSize && this.getArrayValue(r) > this.getArrayValue(largest)) {
            largest = r;
        }

        if (largest !== i) {
            let temp = this.getArrayItem(i);
            this.setArrayItem(i, this.getArrayItem(largest));
            this.setArrayItem(largest, temp);

            this._maxHeapify(largest);
        }
    }

    _minHeapify(i) {
        // Left and right child indices
        let l = Heap.left(i);
        let r = Heap.right(i);
        let smallest = null;

        if (l <= this._heapSize && this.getArrayValue(l) < this.getArrayValue(i)) {
            smallest = l;
        }  else {
            smallest = i;
        }

        if (r <= this._heapSize && this.getArrayValue(r) < this.getArrayValue(smallest)) {
            smallest = r;
        }

        if (smallest !== i) {
            let temp = this.getArrayItem(i);
            this.setArrayItem(i, this.getArrayItem(smallest));
            this.setArrayItem(smallest, temp);

            this._minHeapify(smallest);
        }
    }

    _heapify(i) {
        if (this._type === Heap.HEAP_TYPE_MAX) {
            this._maxHeapify(i);
        } else if (this._type === Heap.HEAP_TYPE_MIN) {
            this._minHeapify(i);
        } else {
            throw new Error("Invalid Heap Type");
        }


    }

    _buildHeap() {
        this._heapSize = this._array.length - 1; // DO I NEED TO INCREMENT THIS?
        for (let i = Math.floor(this._array.length / 2); i > 0; i--) {
            this._heapify(i);
        }

        this._isHeapified = true;
    }

    _buildHeapIfNotHeapified() {
        if (!this._isHeapified) {
            this._buildHeap();
        }
    }

    // _heapSort() {
    //     this._buildHeap();
    //
    //     for (let i = (this._array.length - 1); i > 1; i--) {
    //         let temp = this._array[1];
    //         this._array[1] = this._array[i];
    //         this._array[i] = temp;
    //         this._heapSize--;
    //
    //         this._heapify(1);
    //     }
    // }

    getMax() {
        assert (this._type === Heap.HEAP_TYPE_MAX, "You shouldn't grab the max unless this is a max-heap");

        this._buildHeapIfNotHeapified();

        return this.getArrayItem(1);
    }

    getMin() {
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't grab the min unless this is a min-heap");

        this._buildHeapIfNotHeapified();

        return this.getArrayItem(1);
    }

    extractMax() {
        this._buildHeapIfNotHeapified();

        assert (this._heapSize >= 1, "Heap underflow");
        assert (this._type === Heap.HEAP_TYPE_MAX, "You shouldn't grab the max unless this is a max-heap");

        let max = this.getArrayItem(1);
        this.setArrayItem(1, this.getArrayItem(this._heapSize)); // Should this be -1
        this._heapSize--;
        this._maxHeapify(1);

        return max;
    }

    extractMin() {
        this._buildHeapIfNotHeapified();

        assert (this._heapSize >= 1, "Heap underflow");
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't grab the min unless this is a min-heap");

        let min = this.getArrayItem(1);
        this.setArrayItem(1, this.getArrayItem(this._heapSize)); // Should this be -1
        this._heapSize--;
        this._minHeapify(1);

        return min;
    }

    increaseKey(i, key) {
        assert (this._type === Heap.HEAP_TYPE_MAX, "You shouldn't increase key unless this is a max-heap");
        assert (key >= this._array[i], "new key is smaller than current key");

        this._buildHeapIfNotHeapified();

        this.setArrayItem(i, key);
        while (i > 1 && this.getArrayValue(Heap.parent(i)) < this.getArrayValue(i)) {
            let temp = this.getArrayItem(i);
            this.setArrayItem(i, this.getArrayItem(Heap.parent(i)));
            this.setArrayItem(Heap.parent(i), temp);
            i = Heap.parent(i);
        }
    }

    decreaseKey(i, key) {
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't decrease key unless this is a min-heap");
        assert (key <= this._array[i], "new key is larger than current key");

        this._buildHeapIfNotHeapified();

        this._array[i] = key;

        while (i > 1 && this.getArrayValue(Heap.parent(i)) > this.getArrayValue(i)) {
            let temp = this.getArrayItem(i);
            this.setArrayItem(i, this.getArrayItem(Heap.parent(i)));
            this.setArrayItem(Heap.parent(i), temp);
            i = Heap.parent(i);
        }
    }

    /**
     * Use this method to update obj's position in the heap if it's key has changed.
     * @param obj {Object} The object whose key has changed.
     */
    update(obj) {
        assert (this._keyFieldName !== null, "You must specify extractKey in the constructor to use this method.");
        assert (typeof(obj.__heap_index) !== "undefined", "__heap_index must be defined on obj to use update method.");

        this._buildHeapIfNotHeapified();

        this.remove(obj.__heap_index);
        this.insert(obj);

    }

    /**
     * Use this to insert a new number or object into the Heap.  You can only insert an
     * object if you specified extractKey in the constructor.
     * @param key {Number|Object} The Number of Object you wish to insert into the Heap.
     * @returns {Number|Object} Returns a removed item if there is a max capacity set and the capacity
     * was reached (forcing an item to be removed from the bottom of the heap).  If nothing is removed,
     * null is returned.
     */
    insert(key) {
        this._buildHeapIfNotHeapified();

        let itemValue;
        if (this._keyFieldName === null) {
            itemValue = key;
        } else {
            itemValue = key[this._keyFieldName];
        }

        assert (Number.isFinite(itemValue),
            "Item Values in the Heap must be finite.  I use Inf and -Inf to add" +
            " and remove from the heap");

        this._heapSize++;
        if (this._type === Heap.HEAP_TYPE_MAX) {
            if (this._keyFieldName === null) {
                this.setArrayItem(this._heapSize, Number.NEGATIVE_INFINITY); // Is this correct heapSize - 1?
            } else {
                this.setArrayItem(this._heapSize, key); // Is this correct heapSize - 1?
            }

            this.increaseKey(this._heapSize, key);
        } else if (this._type === Heap.HEAP_TYPE_MIN) {
            if (this._keyFieldName === null) {
                this.setArrayItem(this._heapSize, Number.POSITIVE_INFINITY); // Is this correct heapSize - 1?
            } else {
                this.setArrayItem(this._heapSize, key); // Is this correct heapSize - 1?
            }

            this.decreaseKey(this._heapSize, key);
        } else {
            throw new Error("Unknown heap type");
        }

        let toRet = null;

        if (this._heapSize > (this._maxSize)) {
            let lastValue = this.getArrayValue(this._heapSize);
            let prevLastValue = this.getArrayValue(this._heapSize - 1);

            if (lastValue < prevLastValue) {
                toRet = this.remove(this._heapSize);
            } else {
                toRet = this.remove(this._heapSize - 1);
            }
            // this._heapSize--;
        }

        return toRet;
    }

    /**
     * This method will remove the item found at index i
     * @param i {Number} The index you wish to remove from the heap.
     * @returns {*} Returns the removed item.
     */
    remove(i) {
        this._buildHeapIfNotHeapified();

        let origItemValue = this.getArrayValue(i);
        let item = this.getArrayItem(i);

        if (this._type === Heap.HEAP_TYPE_MAX) {
            if (this._keyFieldName === null) {
                this.setArrayItem(i, Number.POSITIVE_INFINITY); // Is this correct heapSize - 1?
                item = Number.POSITIVE_INFINITY;
            } else {
                item[this._keyFieldName] = Number.POSITIVE_INFINITY;
                this.setArrayItem(i, item); // Is this correct heapSize - 1?
            }

            this.increaseKey(i, item);
            let tempObj = this.extractMax();

            assert (tempObj === item, "tempObj should be obj");
        } else if (this._type === Heap.HEAP_TYPE_MIN) {
            if (this._keyFieldName === null) {
                this.setArrayItem(i, Number.NEGATIVE_INFINITY); // Is this correct heapSize - 1?
                item = Number.NEGATIVE_INFINITY;
            } else {
                item[this._keyFieldName] = Number.NEGATIVE_INFINITY;
                this.setArrayItem(i, item); // Is this correct heapSize - 1?
            }

            this.decreaseKey(i, item);
            let tempObj = this.extractMin();

            assert (tempObj === item, "tempObj should be obj");
        } else {
            throw new Error("Unknown heap type");
        }

        if (this._keyFieldName !== null) {
            item[this._keyFieldName] = origItemValue;
        }

        return item;
    }

    getArray() {
        return this._array.slice(0);
    }

    /**
     * This is the underlying array of the heap.  DO NOT MODIFY.
     * @returns {Array}
     */
    get array() {
        return this._array;
    }

    /**
     * This returns the length of the underlying array storing the heap.
     *
     * It will always be 1 + size()
     *
     * @returns {Number}
     */
    get length() {
        return this._array.length;
    }

    /**
     * This will return the size of the actual heap (not the underlying array).
     *
     * It will always be length() - 1
     *
     * @returns {Number}
     */
    get size() {
        return this._heapSize;
    }

    /**
     * This method will clone this Heap and return a new rebuilt Heap.
     *
     * Note that this method will mutate and essentially destroy the existing heap.
     *
     * Maybe I should name this something else?
     *
     * @returns {Heap} A new freshly rebuilt heap.
     */
    clone() {
        let toRet = new Heap(this._type, null, this._keyFieldName, this._maxSize);

        while (this.size > 0) {
            if (this.type === Heap.HEAP_TYPE_MAX) {
                toRet.insert(this.extractMax());
            } else {
                toRet.insert(this.extractMin());
            }
        }

        return toRet;
    }

}

export default Heap;