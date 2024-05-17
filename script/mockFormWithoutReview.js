const { Form } = require('../src/db/models')

const arr = []
const count = 84

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < count; i++) {
    arr.push({
        itineraryRate: getRandomIntInclusive(1, 5),
        trafficRate: getRandomIntInclusive(1, 5),
        attractionRate: getRandomIntInclusive(1, 5),
        itineraryId: getRandomIntInclusive(177, 182)
    })
}

// console.log(arr)
Form.bulkCreate(arr)