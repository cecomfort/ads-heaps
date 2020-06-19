class MaxHeap {
  static DEFAULT_SIZE = 1023

  /**
   * Create a new empty max heap of a given size, optionally from an existing array
   *
   * @param {number} [size=1023] Maximum capacity of the queue
   * @param {{priority: number, element: *}[]} [fromArray] Build the heap from this array instead. The given array must be 1-indexed, and records must have the given form.
   */
  constructor({ size = this.constructor.DEFAULT_SIZE, fromArray } = {}) {
    if (fromArray) {
      this._storage = fromArray;
      this.size = fromArray.length - 1;  // assume max capacity is size of passed in array
      this._count = this.size;
      this._buildheap(); // dict of {priority, element}

    } else {
      this.size = size;  // max capacity

      // Create storage array with sentinel
      this._storage = [null];

      // Add record slots to storage array
      for (let i = 1; i <= size; i += 1) {
        this._storage.push({ priority: undefined, element: undefined });
      }

      // Last index will always be at count
      this._count = 0;
    }
  }

  /**
   * Use a heap to sort an array in-place in n*log(n) time
   *
   * @param {{priority: number, element: *}[]} [array] Data to sort. The given array must be 1-indexed, and records must have the given form.
   */
  static heapsort(array) {
    const heap = new MaxHeap({ fromArray: array });
    heap.sort();
  }

  _left(i) {
    return 2 * i;
  }

  _right(i) {
    return 2 * i + 1;
  }

  _parent(i) {
    return Math.floor(i / 2);
  }

  _swap(i, j) {
    // Note: in a language like C, Java or Rust, where the array is full of records
    // instead of references to records, we would need to swap the priority and
    // the reference to the element instead of the records themselves.
    const temp = this._storage[i];
    this._storage[i] = this._storage[j];
    this._storage[j] = temp;
  }

  _float(i) {
    let p = this._parent(i);

    while (this._inSizeBounds(p) && this._storage[i].priority > this._storage[p].priority) {
      this._swap(i, p);
      i = p;
      p = this._parent(i);
    }
  }

  _sink(i) {
    let isValidMaxHeap = false; // done when heap satisfies max-heap property

    while (!isValidMaxHeap) {
      const l = this._left(i);
      const r = this._right(i);

      let max = i; // assume current index is max
      if (this._inCountBounds(l) && this._storage[max].priority < this._storage[l].priority) {
        max = l;
      }
      if (this._inCountBounds(r) && this._storage[max].priority < this._storage[r].priority) {
        max = r;
      }

      if (max === i) { // i > left or right child
         isValidMaxHeap = true;
      } else {
        this._swap(i, max);
        i = max;
      }
    }
  }

  _buildheap() {
    const midpoint = Math.floor(this._count / 2);

    for (let i = midpoint; i >= 1; i--) {
      this._sink(i);
    }
  }

  _inSizeBounds(i) {
    return i > 0 && i <= this.size;
  }

  _inCountBounds(i) {
    return i > 0 && i <= this._count;
  }

  _isHeapFull() {
    return this._count === this.size;
  }

  /**
   * Add a record to the queue with a given priority
   *
   * @param {number} priority Priority of the record
   * @param {*} element Data to store in this record
   * @throws If the heap is full
   */
  insert(priority, element) {
    const i = this._count + 1;
    if (!this._inSizeBounds(i)) {
      throw new Error('Heap is full!');
    }
    this._storage[i].priority = priority;
    this._storage[i].element = element;
    this._float(i);
    this._count += 1;
  }

  /**
   * Remove and return the record with the highest priority
   *
   * @returns {*} The data stored in the highest-priority record, or undefined if the queue is empty
   */
  removeMax() {
    if (this._count === 0) {
      return;
    }
    const root = 1;
    const last = this._count;
    // const max = this._storage[1];
    this._swap(root, last); // swap root and last element in heap
    this._count -= 1;  // need to set last ele values to undefined?
    this._sink(root); // sink new root until max-heap property holds
    return this._storage[last].element;
}

  /**
   * How many records are in the priority queue?
   *
   * @returns {number} Record count
   */
  count() {
    return this._count;
  }

  /**
   * Turn this max heap into a sorted array
   *
   * Destroys the max heap in the process - insert, removeMax, etc will NOT
   * work after this function has been run
   *
   * @returns Sorted storage array. Note that the array is 1-indexed (so the first element is null)
   */
  sort() {
    // heap built by constructor
    const count = this._count;
    for (let i = 0; i < count; i += 1) {
      this.removeMax();
    }
    return this._storage;
  }
}

export default MaxHeap;
