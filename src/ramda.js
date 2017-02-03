'use strict'

const _ = require('ramda')
const axios = require('axios')

// ref : - http://ramdajs.com/docs


// identity - who am I
const whoAmI = _.identity("Aham Bramhasmi")
// console.log("I am ", whoAmI)


// i am always false
const alwaysFalse = _.F
// console.log("alwaysFalse=", alwaysFalse())
// console.log("alwaysFalse=", alwaysFalse(1))
// console.log("alwaysFalse=", alwaysFalse(1, "Two"))


// i am always true
const alwaysTrue = _.T
// console.log("alwaysTrue=", alwaysTrue())
// console.log("alwaysTrue=", alwaysTrue(1))
// console.log("alwaysTrue=", alwaysTrue(1, "Two"))


// Gimme all numbers between 1 and 100, both inclusive
const range1To100 = _.range(1, 101)
// console.log("range1To100=", range1To100)


// squares of 1 to 100
const square = num => num * num
const squareOfRange = _.map(square, range1To100)
// console.log("squareOfRange=", squareOfRange)


// odd number between 1 to 100
const isOdd = num => num % 2 == 1
const oddRange1To100 = _.filter(isOdd, range1To100)
// console.log("oddRange1To100=", oddRange1To100)


// sum of squares of even numbers between 1 to 100
//composing works from right to left
// observe auto currying
const sumUsingCompose = _.compose(
    _.sum,
    _.map(square),
    _.filter(isOdd)
)
// console.log("sumUsingCompose=", sumUsingCompose(range1To100))


//pipe (like Unix pipe) works from left to right
//also observe all operation are functions and curry placeholder
const sumUsingPipe = _.pipe(
    _.filter(_.compose(_.identical(1), _.modulo(_.__, 2))),
    _.map(_.converge(_.multiply, [_.identity, _.identity])), // dont try this at home
    _.reduce(_.add, 0)
)
// console.log("sumUsingPipe=", sumUsingPipe(range1To100))


// Using generators to realize lazy collection


function* range_lazy(start, end) {
    if (start > end)
        return
    else {
        yield start
        return yield* range_lazy(start + 1, end)
    }
}


const map_lazy = (fn, gen) => ((function*() {
    console.log("gen=", gen)
    for (const i of gen) {
        yield fn(i)
    }
})())

const squares_lazy = map_lazy(square, range_lazy(1, 10))

// console.log("map_lazy=", [...squares_lazy])


const filter_lazy = (fn, gen) => ((function*() {
    for (const j of gen) {
        if (fn(j))
            yield j
    }
})())
const odd_lazy = filter_lazy(isOdd, range_lazy(1, 10))
// console.log("odd_lazy=", [...odd_lazy])

const odd_squares_lazy = map_lazy(square,
    filter_lazy(isOdd,
        range_lazy(1, 10)))

// console.log("odd_squares_lazy=", [...odd_squares_lazy])


// Lazy evaluation with transducers

const transduce = _.transduce(
    _.compose(_.map(square), _.filter(isOdd)), // transducer
    _.add, // reducer function
    0,  // initial value
    _.unfold((num) => num >= 10 ? false : [num, num + 1], 1) //  lazy iteration
)

console.log("transduce=", transduce)

