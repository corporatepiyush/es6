const _ = require('ramda')

// ref :-  http://fr.umio.us/why-ramda/


const tasks = [
    {
        username: 'Priyanka', title: 'Curry stray functions', dueDate: '2016-05-06',
        complete: true, effort: 'low', priority: 'low'
    },
    {
        username: 'Amar', title: 'Add `fork` function', dueDate: '2016-05-14',
        complete: true, effort: 'low', priority: 'low'
    },
    {
        username: 'Priyanka', title: 'Write intro doc', dueDate: '2016-05-16',
        complete: true, effort: 'low', priority: 'low'
    },
    {
        username: 'Priyanka', title: 'Add modulo function', dueDate: '2016-05-17',
        complete: false, effort: 'low', priority: 'low'
    },
    {
        username: 'Priyanka', title: 'Separating generators', dueDate: '2016-05-24',
        complete: false, effort: 'medium', priority: 'medium'
    },
    {
        username: 'Amar', title: 'Fold algebra branch back in', dueDate: '2016-11-01',
        complete: false, effort: 'low', priority: 'low'
    },
    {
        username: 'Amar', title: 'Fix `and`/`or`/`not`', dueDate: '2016-11-05',
        complete: false, effort: 'low', priority: 'low'
    },
    {
        username: 'Priyanka', title: 'Types infrastucture', dueDate: '2016-11-06',
        complete: false, effort: 'medium', priority: 'high'
    },
    {
        username: 'Amar', title: 'Add `mapObj`', dueDate: '2016-11-09',
        complete: false, effort: 'low', priority: 'medium'
    },
    {
        username: 'Amar', title: 'Write using doc', dueDate: '2016-11-11',
        complete: false, effort: 'medium', priority: 'high'
    },
    {
        username: 'Priyanka', title: 'Finish algebraic types', dueDate: '2016-11-15',
        complete: false, effort: 'high', priority: 'high'
    },
    {
        username: 'Amar', title: 'Determine versioning scheme', dueDate: '2016-11-15',
        complete: false, effort: 'low', priority: 'medium'
    },
    {
        username: 'Priyanka', title: 'Integrate types with main code', dueDate: '2016-11-22',
        complete: false, effort: 'medium', priority: 'high'
    },
    {
        username: 'Pavan', title: 'API documentation', dueDate: '2016-11-22',
        complete: false, effort: 'high', priority: 'medium'
    },
    {
        username: 'Amar', title: 'Complete build system', dueDate: '2016-11-22',
        complete: false, effort: 'medium', priority: 'high'
    },
    {
        username: 'Pavan', title: 'Overview documentation', dueDate: '2016-11-25',
        complete: false, effort: 'medium', priority: 'high'
    }
]

const complete = _.filter(_.propEq('complete', true))
const incomplete = _.filter(_.propEq('complete', false))
const sortByDate = _.sortBy(_.prop('dueDate'))
const sortByDateDescend = _.compose(_.reverse, sortByDate)
const importantFields = _.project(['title', 'dueDate'])
const groupByUser = _.groupBy(_.prop('username'))
const activeByUser = _.compose(groupByUser, incomplete)
const gloss = _.compose(importantFields, _.take(5), sortByDateDescend)
const topData = _.compose(gloss, incomplete)


console.log("incomplete tasks =", incomplete(tasks))

console.log("Completed task sort by date and group by user =", groupByUser(sortByDate(complete(tasks))))

console.log("Active Tasks By User =", activeByUser(tasks))

console.log("top data =", topData(tasks))