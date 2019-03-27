const pargeHealthData = health =>
  health.slice(1, -1).length > 0 ? health.slice(1, -1).split(',') : []

const calculateBmi = weight => height => weight / Math.pow(height / 100, 2)

const healthPenalty15 = health => {
  const penalty = -15
  let count = 0
  count = health.filter(x => x === 'DEPRESSION' || 'ANXIETY').length
  return count * penalty
}

const healthPenalty25 = health => {
  const penalty = -25
  let count = 0
  count = health.filter(x => x === 'SURGERY').length
  return count * penalty
}

const healthPenalty30 = health => {
  const penalty = -30
  let count = 0
  count = health.filter(x => x === 'HEART').length
  return count * penalty
}

const bmiPenalty = bmi =>
  bmi < 18.5 ? -15 : bmi > 25.0 ? -25 : bmi < 30.0 ? -30 : 0

const smokerPenalty = smoker => (smoker === 'S' ? -25 : 0)
const alcoholPenalty = consumption =>
  consumption > 10 ? -25 : consumption > 25 ? -30 : 0

const assignAgeRange = age =>
  age >= 18 && age <= 39
    ? 'age-18-40'
    : age >= 40 && age <= 60
      ? 'age-40-60'
      : 'age-not-found'

const rateMap = {
  'age-18-40': {
    S: 0.25,
    NS: 0.1
  },
  'age-40-60': {
    S: 0.3,
    NS: 0.55
  },
  'age-not-found': {
    S: 1.0,
    NS: 1.0
  }
}

const calculatePremiumMonth = coveragePrice => policyrequested =>
  ((coveragePrice * policyrequested) / 1000).toFixed(2)
const calculatePremiumYear = coveragePrice => policyrequested =>
  (((coveragePrice * policyrequested) / 1000) * 12).toFixed(2)

const createBaseData = person => ({
  ...person,
  health: pargeHealthData(person.health),
  weight: parseInt(person.weight),
  height: parseInt(person.height),
  age: parseInt(person.age),
  alcohol: parseInt(person.alcohol),
  policyrequested: parseFloat(person.policyrequested),
  score: 0
})

const addCoveragePrice = person => ({
  ...person,
  coveragePrice: rateMap[assignAgeRange(parseInt(person.age))][person.smoker]
})

const addBmiCalculation = person => ({
  ...person,
  bmi: calculateBmi(person.weight)(person.height)
})

const addScore = person => ({
  ...person,
  score:
    healthPenalty15(person.health) +
    healthPenalty25(person.health) +
    healthPenalty30(person.health) +
    bmiPenalty(person.bmi) +
    smokerPenalty(person.smoker) +
    alcoholPenalty(person.alcohol)
})

const addPremium = person => ({
  name: person.name,
  bmi: person.bmi,
  score: person.score,
  premium: {
    monthly: calculatePremiumMonth(person.coveragePrice)(
      person.policyrequested
    ),
    year: calculatePremiumYear(person.coveragePrice)(person.policyrequested)
  }
})

const processData = data =>
  [data]
    .map(createBaseData)
    .map(addCoveragePrice)
    .map(addBmiCalculation)
    .map(addScore)
    .map(addPremium)

module.exports = { processData }
