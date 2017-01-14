'use strict'

// template string, let, const and destructering

// --------------------------------------------------------

let scope = 100
console.log('scope=', scope) // scope= 100
{
    let scope = 50
    console.log('scope=', scope) // scope= 50
}
console.log(`scope= ${scope}`) // scope= 100

// --------------------------------------------------------

const obj = { first: 'Jane', last: 'Doe' }

const { first: f, last: l } = obj
console.log('f=', f, 'l=', l) // f = 'Jane' l = 'Doe'

const { first, last } = obj
console.log('first=', f, 'last=', l) // first = 'Jane' last = 'Doe'

const [ x, ...y ] = 'abc'
console.log('x=', x, 'y=', y) // x='a'; y=['b', 'c']

const { length : len } = 'abc'
console.log('len=', len) // len = 3

const iterable = ['a', 'b']

const [ a, b ] = iterable
console.log('a=', a, 'b=', b) // a = 'a' b = 'b'

const [all, year, month, day] = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
    .exec('2017-01-14')

console.log("all=", all, 'year=', year, 'month=', month, 'day=', day)
// all= 2017-01-14 year= 2017 month= 01 day= 14

const [ p=3, q ] = [ ]
console.log('p=', p, 'q=', q) // p = 3; q = undefined

const {foo: u=3, bar: v} = {}
console.log('u=', u, 'v=', v) // u = 3; v = undefined

// --------------------------------------------------------

for(const num of [1, 2, 3]) {
    console.log(`num= ${num}`)
}

// --------------------------------------------------------
