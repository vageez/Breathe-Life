const data = [
  {
    name: 'jean',
    age: '45',
    gender: 'M',
    smoker: 'S',
    email: 'jean@videotron.ca',
    height: '179',
    weight: '90',
    health: '[ANXIETY,HEART]',
    alcohol: '2',
    postalcode: 'H1S 3Y3',
    policyrequested: '200000.00'
  },
  {
    name: 'sylvie',
    age: '33',
    gender: 'F',
    smoker: 'NS',
    email: 'sylvie@textis.com',
    height: '155',
    weight: '76',
    health: '[SURGERY]',
    alcohol: '3',
    postalcode: 'H4S 2D3',
    policyrequested: '150000.00'
  },
  {
    name: 'robert',
    age: '44',
    gender: 'M',
    smoker: 'NS',
    email: 'robbie@outlook.com',
    height: '175',
    weight: '60',
    health: '[HEART]',
    alcohol: '25',
    postalcode: 'H1S 4F2',
    policyrequested: '345000.00'
  },
  {
    name: 'nancy',
    age: '49',
    gender: 'F',
    smoker: 'NS',
    email: 'nancy@varneno.com',
    height: '161',
    weight: '65',
    health: '[]',
    alcohol: '5',
    postalcode: 'W3C 1B3',
    policyrequested: '540000.00'
  },
  {
    name: 'henry',
    age: '21',
    gender: 'M',
    smoker: 'S',
    email: 'henry@partyhouse.com',
    height: '184',
    weight: '52',
    health: '[]',
    alcohol: '25',
    postalcode: 'H4L 5Y2',
    policyrequested: '125000.00'
  },
  {
    name: 'ali',
    age: '33',
    gender: 'M',
    smoker: 'NS',
    email: 'ali2351@gmail.com',
    height: '182',
    weight: '76',
    health: '[]',
    alcohol: '10',
    postalcode: 'H2V 6F3',
    policyrequested: '350000.00'
  },
  {
    name: 'herve',
    age: '41',
    gender: 'M',
    smoker: 'S',
    email: 'herve@yahoo.com',
    height: '179',
    weight: '84',
    health: '[]',
    alcohol: '12',
    postalcode: 'H5S 8N8',
    policyrequested: '210000.00'
  }
]

const { taggedSum } = require('daggy')

const QualificationType = taggedSum('QualificationType', {
  RegularPremium: [],
  FollowUpInterview: [],
  Charge15x: [],
  Charged25x: [],
  NotEvaluated: []
})

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

const processData = data => {
  return [data]
    .map(r => ({
      ...r,
      health: pargeHealthData(r.health),
      weight: parseInt(r.weight),
      height: parseInt(r.height),
      age: parseInt(r.age),
      alcohol: parseInt(r.alcohol),
      policyrequested: parseFloat(r.policyrequested),
      score: 0,
      referral: QualificationType.NotEvaluated
    }))
    .map(data => ({
      ...data,
      coveragePrice: rateMap[assignAgeRange(parseInt(data.age))][data.smoker]
    }))
    .map(data => ({
      ...data,
      bmi: calculateBmi(data.weight)(data.height)
    }))
    .map(data => ({
      ...data,
      score:
        healthPenalty15(data.health) +
        healthPenalty25(data.health) +
        healthPenalty30(data.health) +
        bmiPenalty(data.bmi) +
        smokerPenalty(data.smoker) +
        alcoholPenalty(data.alcohol)
    }))
    .map(data => ({
      name: data.name,
      bmi: data.bmi,
      score: data.score,
      premium: {
        monthly: calculatePremiumMonth(data.coveragePrice)(
          data.policyrequested
        ),
        year: calculatePremiumYear(data.coveragePrice)(data.policyrequested)
      }
    }))
}

module.exports = { processData }
