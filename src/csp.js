'use strict'

const {
    go,
    timeout,
    chan,
    take,
    put,
    buffers,
    CLOSED
} = require('js-csp')

// Lib ref :- https://github.com/ubolonton/js-csp
// Ref:- http://lucasmreis.github.io/blog/quick-introduction-to-csp-in-javascript/

// -----------------------------------------------

function helloWorld() {
    go(function*() {
        console.log('Hello CSP!')
    })
}
// helloWorld()

// -----------------------------------------------

function pause() {
    go(function*() {
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
    go(function*() {
        const receivedFirst = yield take(channelA)
        console.log('A > RECEIVED:', receivedFirst)

        const sending = 'cat'
        console.log('A > SENDING:', sending)
        yield put(channelB, sending)

        const receivedSecond = yield take(channelA)
        console.log('A > RECEIVED:', receivedSecond)
    })

    // Process B
    go(function*() {
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

    go(function*() {
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
