'use strict'

const {
    go,
    timeout,
    chan,
    take,
    put,
    buffers,
    CLOSED,
    operations
} = require('js-csp')

const _ = require('ramda')

// Lib ref :- https://github.com/ubolonton/js-csp
// Ref:- http://lucasmreis.github.io/blog/quick-introduction-to-csp-in-javascript/

// -----------------------------------------------

function helloWorld() {
    go(function* () {
        console.log('Hello CSP!')
    })
}
// helloWorld()

// -----------------------------------------------

function pause() {
    go(function* () {
        console.log('before pause', new Date())
        yield timeout(2000)
        console.log('after pause', new Date())
    })
}
// pause()

// -----------------------------------------------
function interCommunication() {
    let channelA = chan()
    let channelB = chan()

    // Process A
    go(function* () {
        const receivedFirst = yield take(channelA)
        console.log('A > RECEIVED:', receivedFirst)

        const sending = 'cat'
        console.log('A > SENDING:', sending)
        yield put(channelB, sending)

        const receivedSecond = yield take(channelA)
        console.log('A > RECEIVED:', receivedSecond)
    })

    // Process B
    go(function* () {
        const sendingFirst = 'dog'
        console.log('B > SENDING:', sendingFirst)
        yield put(channelA, sendingFirst)

        const received = yield take(channelB)
        console.log('B > RECEIVED:', received)

        const sendingSecond = 'another dog'
        console.log('B > SENDING:', sendingSecond)
        yield put(channelA, sendingSecond)
    })
}

// interCommunication()

// -----------------------------------------------


function fixedBuffers() {
    let ch = chan(buffers.fixed(2))

    go(function* () {
        yield put(ch, 'value A')
        yield put(ch, 'value B')
        console.log('I should print!')
        yield put(ch, 'value C')
        console.log('I should not print!')
    })
}

// fixedBuffers()

// -----------------------------------------------


function pingPong() {

    function* player(name, table) {
        while (true) {
            let ball = yield take(table)

            if (ball === CLOSED) {
                console.log(name + ": table's gone")
                return
            }

            ball.hits += 1
            console.log(`${name} ${ball.hits}`)

            yield timeout(100)
            yield put(table, ball)
        }
    }

    go(function* main() {
        const table = chan()

        go(player, ["ping", table])
        go(player, ["pong", table])

        yield put(table, {
            hits: 0
        })
        yield timeout(1000)

        table.close()
    })

}

// pingPong()

// -----------------------------------------------

// More advanced examples

// https://github.com/ubolonton/js-csp/blob/master/doc/advanced.md


// -----------------------------------------------

// => (last channel) * --> * --> * --> * --> * ..... --> * (first channel)
// * - goroutine
// --> - channel

function chineseWhisperer(number) {
    go(function* chineseWhisperer() {
        const whisperers = _.range(1, number)
        const last = chan()
        const first = _.reduce(function (channel, __) {
            const newChannel = chan()
            go(function* () {
                const secretWord = yield take(channel)
                yield put(newChannel, secretWord)
            })
            return newChannel
        }, last, whisperers)
        yield put(last, "GodOnlyKnows")
        const secretWord = yield take(first)
        console.log(secretWord)
    })
}

// chineseWhisperer(10000)

// -----------------------------------------------

// delaying computationally complex tasks

function factorialR(number) { // too much costly
    if (number === 0)
        return 1
    else
        return number * factorialR(number - 1)
}

// console.log(factorialR(50))

function factorialR1(number, lowerLimit = 1) {
    if (number === lowerLimit)
        return lowerLimit
    else
        return number * factorialR1(number - 1, lowerLimit)
}

// console.log(factorialR1(50))


// divide and time slice by delaying it
// 1..10  *  11..20  *  21..30 *  31..40  *  41..50 


function factorial(tasks) {
    go(function* () {
        const last = chan()
        const first = _.reduce(function (channel, task) {
            const newChannel = chan()
            go(function* () {  // 1 goroutine per task
                const partialResult = yield take(channel)
                // yield timeout(100)  // if you can afford more lag
                yield put(newChannel, partialResult * factorialR1(_.last(task), _.head(task))) // compute
            })
            return newChannel
        }, last, _.tail(tasks))
        const firstTask = _.head(tasks)
        yield put(last, factorialR1(_.last(firstTask), _.head(firstTask))) // compute
        const finalResult = yield take(first)
        console.log(finalResult)
    })
}

// factorial([
//     [1, 10],
//     [11, 20],
//     [21, 30],
//     [31, 40],
//     [41, 50]
// ])

// -----------------------------------------------


// https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes

// 0 - 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
// 2 - 2 3 (4) 5 (6) 7 (8) 9 (10) 11 (12) 13 (14) 15 (16) 17 (18) 19 (20) 21 (22) 23 (24) 25 (26) 27 (28) 29 (30)
// 3 - 2 3 5 7 (9) 11 13 (15) 17 19 (21) 23 25 (27) 29
// 5 - 2 3 5 7 11 13 17 19 23 (25) 29

function sieve(number) {
    go(function* () {
        const range = chan(number < 10 ? number : 10)
        const primes = chan(number < 10 ? number : 10)

        go(function* generate() {
            for (let i = 2; i <= number; i++) {
                yield put(range, i)
            }
            range.close()
        })


        function filter(channel) {
            return function* () {

                const prime = yield take(channel) // first element
                if (prime === CLOSED) { //end of range
                    primes.close()
                    return
                }
                yield put(primes, prime)

                const next = chan()
                go(filter(next)) //spawn recursively

                while (true) {
                    const num = yield take(channel)
                    if (num === CLOSED)
                        break
                    if (num % prime !== 0) // filter logic
                        yield put(next, num)
                }
                next.close()
            }
        }

        go(filter(range))

        while (true) {
            const prime = yield take(primes)
            if (prime === CLOSED)
                break;
            console.log(prime)
        }
    })
}

// sieve(10000)

// -----------------------------------------------