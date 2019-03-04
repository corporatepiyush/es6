'use strict'

const _ = require('ramda')

// ref : - http://ramdajs.com/docs


// identity - who am I
const whoAmI = _.identity('Aham Bramhasmi')
console.log('I am ', whoAmI)


// i am always false
const alwaysFalse = _.F
console.log('alwaysFalse=', alwaysFalse())
console.log('alwaysFalse=', alwaysFalse(1))
console.log('alwaysFalse=', alwaysFalse(1, 'Two'))


// i am always true
const alwaysTrue = _.T
console.log('alwaysTrue=', alwaysTrue())
console.log('alwaysTrue=', alwaysTrue(1))
console.log('alwaysTrue=', alwaysTrue(1, 'Two'))


const fn = _.cond([
    [_.equals(0), _.always('water freezes at 0°C')],
    [_.equals(100), _.always('water boils at 100°C')],
    [_.T, temp => 'nothing special happens at ' + temp + '°C']
])
fn(0) //=> 'water freezes at 0°C'
fn(50) //=> 'nothing special happens at 50°C'
fn(100) //=> 'water boils at 100°C'


// Gimme all numbers between 1 and 100, both inclusive
const range1To100 = _.range(1, 101)
console.log('range1To100=', range1To100)


// squares of 1 to 100
const square = num => num * num
const squareOfRange = _.map(square, range1To100)
console.log('squareOfRange=', squareOfRange)


// odd number between 1 to 100
const isOdd = num => num % 2 == 1
const oddRange1To100 = _.filter(isOdd, range1To100)
console.log('oddRange1To100=', oddRange1To100)


// sum of squares of even numbers between 1 to 100
//composing works from right to left
// observe auto currying
const sumUsingCompose = _.compose(
    _.sum,
    _.map(square),
    _.filter(isOdd)
)
console.log('sumUsingCompose=', sumUsingCompose(range1To100))


//pipe (like Unix pipe) works from left to right
//also observe all operation are functions and curry placeholder
// over engineered code
const sumUsingPipe = _.pipe(
    _.filter(_.compose(_.identical(1), _.modulo(_.__, 2))),
    _.map(_.converge(_.multiply, [_.identity, _.identity])), // dont try this at home
    _.reduce(_.add, 0)
)
console.log('sumUsingPipe=', sumUsingPipe(range1To100))


// Using generators to realize lazy collection


function* range_lazy(start, end) {
    if (start > end)
        return
    else {
        yield start
        return yield* range_lazy(start + 1, end)
    }
}


const map_lazy = (fn, gen) => ((function* () {
    for (const i of gen) {
        yield fn(i)
    }
})())

const squares_lazy = map_lazy(square, range_lazy(1, 10))

console.log('map_lazy=', [...squares_lazy])


const filter_lazy = (fn, gen) => ((function* () {
    for (const j of gen) {
        if (fn(j))
            yield j
    }
})())
const odd_lazy = filter_lazy(isOdd, range_lazy(1, 10))
console.log('odd_lazy=', [...odd_lazy])

const odd_squares_lazy = map_lazy(square,
    filter_lazy(isOdd,
        range_lazy(1, 7000)))

// console.log('odd_squares_lazy=', [...odd_squares_lazy])


function sum_lazy(gen) {
    const next = gen.next()
    if (next.done)
        return 0
    else {
        return next.value + sum_lazy(gen)
    }
}

console.log('sum_lazy=', sum_lazy(map_lazy(square,
    filter_lazy(isOdd,
        range_lazy(1, 100)))))


// Lazy evaluation with transducers

const transduce = _.transduce(
    _.compose(_.map(square), _.filter(isOdd)), // transducer
    _.add, // reducer function
    0, // initial value
    _.unfold((num) => num >= 10 ? false : [num, num + 1], 1) //  lazy iteration
)

console.log('transduce=', transduce)


/// objects


{

    // basic operations

    const obj = {
        name: 'Penelope Cruz',
        profession: 'Actor',
        nationality: 'Spanish',
        married: true
    }
    console.log("object keys =", _.keys(obj))
    console.log("object values =", _.values(obj))
    console.log("object add attribute =", _.assoc('height', 1.68, obj))
    console.log("object remove attribute =", _.dissoc('nationality', obj))
    console.log("object check attribute =", _.has('married', obj))

}


{

    const input = {
        firstName: 'Charles',
        lastName: 'Bukowski'
    }

    const output = {
        '-firstName-': 'Charles',
        '-lastName-': 'Bukowski'

    }

    const transform = (input) => _.fromPairs(
        _.map(([key, value]) => [`-${key}-`, value],
            _.toPairs(input)))


    console.log("transform=", transform(input)) // output
}


{

    // omit pairs which does not value Number value

    const input = {
        firstName: 'Tom',
        lastName: 'Hardy',
        age: 34,
        salary: 1000000
    }

    const output = {
        'age': 34,
        'salary': 1000000
    }

    function transform(input) {
        const pairs = _.toPairs(input)
        const filteredPairs = _.filter(_.compose(_.is(Number), _.view(_.lensIndex(1))), pairs)
        return _.fromPairs(filteredPairs)
    }

    console.log("transform=", transform(input)) // output
}


{

    // evolve you object to new realities

    const tomato = {
        firstName: '  Tomato ',
        data: {
            elapsed: 100,
            remaining: 1400
        },
        id: 123
    }
    const transformations = {
        firstName: _.trim,
        lastName: _.trim, // Will not get invoked.
        data: {
            elapsed: _.add(1),
            remaining: _.add(-1)
        }
    }
    console.log("evolve=", _.evolve(transformations, tomato)) //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}

}



{
    // lenses

    const xLens = _.lens(_.prop('x'), _.assoc('x'))

    _.view(xLens, {
        x: 1,
        y: 2
    }) //=> 1
    _.set(xLens, 4, {
        x: 1,
        y: 2
    }) //=> {x: 4, y: 2}
    _.over(xLens, _.negate, {
        x: 1,
        y: 2
    }) //=> {x: -1, y: 2}


    const headLens = _.lensIndex(0)

    _.view(headLens, ['a', 'b', 'c']) //=> 'a'
    _.set(headLens, 'x', ['a', 'b', 'c']) //=> ['x', 'b', 'c']
    _.over(headLens, _.toUpper, ['a', 'b', 'c']) //=> ['A', 'b', 'c']


    const xHeadYLens = _.lensPath(['x', 0, 'y'])

    _.view(xHeadYLens, {
        x: [{
            y: 2,
            z: 3
        }, {
            y: 4,
            z: 5
        }]
    }) //=> 2
    _.set(xHeadYLens, 1, {
        x: [{
            y: 2,
            z: 3
        }, {
            y: 4,
            z: 5
        }]
    }) //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
    _.over(xHeadYLens, _.negate, {
        x: [{
            y: 2,
            z: 3
        }, {
            y: 4,
            z: 5
        }]
    }) //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}


}