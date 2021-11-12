function MyInterator(list) {
    let i = 0;
    return {
        next() {
            let done = i >= list.length;
            let value = !done ? list[i++] : undefined;
            return {
                value,
                done
            }
        }
    }
};
let interator = MyInterator([1, 2, 3]);
console.log(interator.next()); // { value: 1, done: false }
console.log(interator.next()); // { value: 2, done: false }
console.log(interator.next()); // { value: 3, done: false }
console.log(interator.next()); // { value: undefined, done: true }