import { assert } from "../../utils/Assert";

const max_heap = 0;
const min_heap = 1;

class Heap {

    static get HEAP_TYPE_MAX() { return max_heap; }
    static get HEAP_TYPE_MIN() { return min_heap; }

    constructor(type=Heap.HEAP_TYPE_MAX, theArray=null) {
        if (theArray === null) {
            theArray = [];
        }

        this._type = type;
        // First element is always ignored
        this._array = [null].concat(theArray);
        this._heapSize = 0;
        this._isHeapified = false;
    }

    static parent(i) {
        return Math.floor(i/2);
    }

    static left(i) {
        return 2 * i;
    }

    static right(i) {
        return (2 * i) + 1;
    }

    leftChild(i) {
        return this._array[Heap.left(i)];
    }

    rightChild(i) {
        return this._array[Heap.right(i)];
    }

    parent(i) {
        return this._array[Heap.parent(i)];
    }

    get type() {
        return this._type;
    }

    _maxHeapProperty(i) {
        return this._array[Heap.parent(i)] >= this._array[i];
    }

    _minHeapProperty(i) {
        return this._array[Heap.parent(i)] <= this._array[i];
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

        if (l <= this._heapSize && this._array[l] > this._array[i]) {
            largest = l;
        }

        if (r <= this._heapSize && this._array[r] > this._array[largest]) {
            largest = r;
        }

        if (largest !== i) {
            let temp = this._array[i];
            this._array[i] = this._array[largest];
            this._array[largest] = temp;

            this._maxHeapify(largest);
        }
    }

    _minHeapify(i) {
        // Left and right child indices
        let l = Heap.left(i);
        let r = Heap.right(i);
        let smallest = null;

        if (l <= this._heapSize && this._array[l] < this._array[i]) {
            smallest = l;
        }  else {
            smallest = i;
        }

        if (r <= this._heapSize && this._array[r] < this._array[smallest]) {
            smallest = r;
        }

        if (smallest !== i) {
            let temp = this._array[i];
            this._array[i] = this._array[smallest];
            this._array[smallest] = temp;

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

        return this._array[1];
    }

    getMin() {
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't grab the min unless this is a min-heap");

        this._buildHeapIfNotHeapified();

        return this._array[1];
    }

    extractMax() {
        this._buildHeapIfNotHeapified();

        assert (this._heapSize >= 1, "Heap underflow");
        assert (this._type === Heap.HEAP_TYPE_MAX, "You shouldn't grab the max unless this is a max-heap");

        let max = this._array[1];
        this._array[1] = this._array[this._heapSize]; // Should this be -1
        this._heapSize--;
        this._maxHeapify(1);

        return max;
    }

    extractMin() {
        this._buildHeapIfNotHeapified();

        assert (this._heapSize >= 1, "Heap underflow");
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't grab the min unless this is a min-heap");

        let min = this._array[1];
        this._array[1] = this._array[this._heapSize]; // Should this be -1
        this._heapSize--;
        this._minHeapify(1);

        return min;
    }

    increaseKey(i, key) {
        assert (this._type === Heap.HEAP_TYPE_MAX, "You shouldn't increase key unless this is a max-heap");
        assert (key >= this._array[i], "new key is smaller than current key");

        this._buildHeapIfNotHeapified();

        this._array[i] = key;
        while (i > 1 && this._array[Heap.parent(i)] < this._array[i]) {
            let temp = this._array[i];
            this._array[i] = this._array[Heap.parent(i)];
            this._array[Heap.parent(i)] = temp;
            i = Heap.parent(i);
        }
    }

    decreaseKey(i, key) {
        assert (this._type === Heap.HEAP_TYPE_MIN, "You shouldn't decrease key unless this is a min-heap");
        assert (key <= this._array[i], "new key is larger than current key");

        this._buildHeapIfNotHeapified();

        this._array[i] = key;
        while (i > 1 && this._array[Heap.parent(i)] > this._array[i]) {
            let temp = this._array[i];
            this._array[i] = this._array[Heap.parent(i)];
            this._array[Heap.parent(i)] = temp;
            i = Heap.parent(i);
        }
    }

    insert(key) {
        this._buildHeapIfNotHeapified();

        this._heapSize++;
        if (this._type === Heap.HEAP_TYPE_MAX) {
            this._array[this._heapSize] = Number.NEGATIVE_INFINITY; // Is this correct heapSize - 1?
            this.increaseKey(this._heapSize, key);
        } else if (this._type === Heap.HEAP_TYPE_MIN) {
            this._array[this._heapSize] = Number.POSITIVE_INFINITY; // Is this correct heapSize - 1?
            this.decreaseKey(this._heapSize, key);
        } else {
            throw new Error("Unknown heap type");
        }
    }

    getArray() {
        return this._array.slice(0);
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

}

export default Heap;