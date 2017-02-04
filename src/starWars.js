const _ = require('ramda')
const http = require('axios')
const co = require('co')


const getPeopleById = (id) => http.get(`http://swapi.co/api/people/${id}`)

function* getAllPeople(page='http://swapi.co/api/people/?page=1') {
    if(_.isNil(page))
        return []
    else {
        const peoplesOnGivenPage = yield http.get(page)
        return _.flatten(
            _.append(peoplesOnGivenPage.data.results,
                yield*  getAllPeople(peoplesOnGivenPage.data.next)))
    }
}


    co(getAllPeople()).then(console.log)


function* getAllPeopleWith() {

}