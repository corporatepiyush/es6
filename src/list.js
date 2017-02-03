"use strict"

// Thinking functionally series - Lists
// LISPy Data structures in JS

const Nil = {}

// data Optional a = Nothing | Something a

function cons(value, cons) {
  return {
    value : value,
    cons : cons
  }
}

//JS specific
const printList = (cons) => JSON.stringify(cons, null, 2)
//console.log(printList(list))

const list = cons(1, cons(2, cons(3, cons(4, cons(5, Nil)))))
//console.log("List:", printList(list)) // [1,2,3,4,5]










const head = ({ value }) => value

//console.log("Head:", head(list)) // 1
//console.log("head empty:", head({}))

const tail = ({ _, cons }) => cons

//console.log("Tail:", tail(list)) // [2,3,4,5]

// come back here after recursion example
const init = ({ value, cons:_cons}) => _cons == Nil ? Nil : cons(value, init(_cons))

// console.log("Init:", init(list)) // [1,2,3,4]

const last = ({value, cons}) => cons == Nil ? value : last(cons)

// console.log("Last:", last(list)) // 5








const length = ({value, cons}) =>
    value ?
      ( cons !== Nil ? 1 + length(cons) : 1 ) :
      0

//console.log("Length of cons():", length(cons())) // 0
//console.log("Length of cons(1, null):", length(cons(1, Nil))) // 1
//console.log("Length of List:", length(list)) // 5


const range = (start, end, step = 1) =>
    start <= end - step ? cons(start, range(start + step, end, step)) :
                  start >= end + step ? cons(start, range(start - step, end, step)) :
                              cons(end, Nil)




// console.log("Range(1, 10, 2):", printList(range(1, 10, 2))) // [10, 9, 8]
// console.log("Range(1, 3):", range(1, 3)) // [1, 2, 3]
//
// console.log("Range(-3, -1):", range(-3, -1)) // [1, 2, 3]
// console.log("Range(-1, -3):", range(-1, -3)) // [1, 2, 3]

const equals = (cons1, cons2, predicate = (value1, value2) => value1 === value2) =>
    (cons1 != Nil && cons2 == Nil) || (cons1 == Nil && cons2 != Nil) ?
      false :
      cons1 != Nil && cons2 != Nil && predicate(head(cons1), head(cons2)) ?
        equals(tail(cons1), tail(cons2), predicate) :
        true

//console.log("Equals should be false : ", equals(range(1, 10), range(1, 5)))
//console.log("Equals should be true: ", equals(range(1, 10), range(1, 10)))








const map = (mapperFn, {value, cons:_cons}) =>
  _cons == Nil ?
    cons(mapperFn(value), Nil) :
    cons(mapperFn(value), map(mapperFn, _cons))

// console.log("Map: divide by 2:", map((num) => num / 2, list))

const filter = (predicate, {value, cons:_cons}) =>
  _cons == Nil ?
    (predicate(value) ? cons(value, Nil) : Nil) :
    predicate(value) ? cons(value, filter(predicate, _cons)) : filter(predicate, _cons) 



// console.log("Map : even nums: ", filter( (num) => num % 2 === 0, list )) // [2,4]





