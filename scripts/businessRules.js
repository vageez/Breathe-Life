const healthRules = require('./rulesConfig') // ?

const parseHealthData = health =>
  health.slice(1, -1).length > 0 ? health.slice(1, -1).split(',') : []

const calculateBmi = weight => height => weight / Math.pow(height / 100, 2)

const calculateHealthScore = health => (acc, rule) => {
  rule.health.reduce((d, issue) => {
    if (health.indexOf(issue) > -1) {
      d.push(rule.point)
    }
    return d
  }, acc)
  return acc
}

const healthScore = rules => health =>
  health.length > 0
    ? rules
      .reduce(calculateHealthScore(health), [])
      .reduce((acc, a) => acc + a, 0)
    : 0

const calculateBmiPenalty = bmi => (a, c) => {
  a.push(
    c.bmi.greater
      ? bmi > c.bmi.greater
        ? c.point
        : 0
      : 0 + c.bmi.less
        ? bmi < c.bmi.less
          ? c.point
          : 0
        : 0
  )
  return a
}

const bmiPenalty = rules => bmi =>
  rules.reduce(calculateBmiPenalty(bmi), []).reduce((acc, a) => acc + a, 0)

const smokerPenalty = rules => smoker =>
  !smoker
    ? 0
    : rules
      .reduce((a, c) => {
        a.push((c.smoker && c.point) || 0)
        return a
      }, [])
      .reduce((acc, a) => acc + a, 0)

const alcoholPenalty = rules => alcohol => {
  // Get penalty for alchohol consumption
  const res = rules
    .reduce((a, c) => {
      a.push(
        c.alcohol.greater
          ? alcohol > c.alcohol.greater
            ? c.point
            : 0
          : 0 + c.alcohol.less
            ? alcohol < c.alcohol.less
              ? c.point
              : 0
            : 0
      )
      return a
    }, [])

  // Return the highest penalty
  return Math.min(...res)
}

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
  health: parseHealthData(person.health),
  weight: parseInt(person.weight),
  height: parseInt(person.height),
  age: parseInt(person.age),
  alcohol: parseInt(person.alcohol),
  policyrequested: parseFloat(person.policyrequested),
  isSmoker: person.smoker === 'S',
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
    healthScore(healthRules)(person.health) +
    bmiPenalty(healthRules)(person.bmi) +
    smokerPenalty(healthRules)(person.isSmoker) +
    alcoholPenalty(healthRules)(person.alcohol)
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
