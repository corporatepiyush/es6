'use strict'


// --------------------------------------------------------

function simpleGenerator() {

    function* foo() {
        yield 'red'
        yield 'panda'
    }

    const fooGenerator = foo()
    console.log('fooGenerator.next()', fooGenerator.next()) // { value: 'red', done: false }
    console.log('fooGenerator.next()', fooGenerator.next()) // { value: 'panda', done: false }
    console.log('fooGenerator.next()', fooGenerator.next()) // { value: undefined, done: true }


    function* bar(x) {
        var y = 2 * (yield(x + 1));
        console.log("y=", y)
        var z = yield(y / 3);
        console.log("z=", z)
        return (x + y + z);
    }

    var barGenerator = bar(5);
    console.log('barGenerator.next()=', barGenerator.next()); // { value:6, done:false }
    console.log('barGenerator.next(12)=', barGenerator.next(12)); // { value:8, done:false }
    console.log('barGenerator.next(13)=', barGenerator.next(13)); // { value:42, done:true }

}
// simpleGenerator()

// --------------------------------------------------------

function nestedGenearator() {

    function* foo() {
        yield 'red'
        yield 'panda'
    }

    function* bar() {
        yield 'Pune'
        yield* foo()
        yield 'Mumbai'
    }

    console.log('foo bar =', [...bar()]) // [ 'Pune', 'red', 'panda', 'Mumbai' ]
}

// nestedGenearator()

// --------------------------------------------------------

function rangeGenerator() {

    function* range(start, end) {
        //  console.log('start=', start, ', end=',end)
        if (start > end)
            return
        else {
            yield start
            return yield* range(start + 1, end)
        }
    }

    for (const num of range(1, 10)) {
        console.log('num=', num)
    }
}

// rangeGenerator()
// --------------------------------------------------------

function promiseGenerator() {

    const axios = require('axios')
    const co = require('co')

    function* fetchData() {
        const response = yield axios.get("http://swapi.co/api/people/")
        console.log('data=', response.data)
        return response.data
    }

    function* fetchDataFromAlienSite() {
        try {
            const response = yield axios.get("http://some.alien.site/hello")
        } catch (error) {
            console.log("error=", error)
        }
    }

    co(fetchData()) // returns promise
    co(fetchDataFromAlienSite()) // returns promise
}

// Old Style
// axios.get("http://swapi.co/api/people/")
//     .then(function(response) {
//         console.log(response.data)
//     })

 // promiseGenerator()
// --------------------------------------------------------
