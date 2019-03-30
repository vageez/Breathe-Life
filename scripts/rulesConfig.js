module.exports = healthRules = [
  {
    point: -15,
    health: ['DEPRESSION', 'ANXIETY'],
    bmi: {
      greaterThan: undefined,
      lessThan: 18.5
    },
    alcohol: {
      greaterThan: 10,
      lessThan: undefined
    },
    smoker: false
  },
  {
    point: -25,
    health: ['SURGERY'],
    bmi: {
      greaterThan: 25.0,
      lessThan: undefined
    },
    alcohol: {
      greaterThan: 10,
      lessThan: undefined
    },
    smoker: true
  },
  {
    point: -30,
    health: ['HEART'],
    bmi: {
      greaterThan: 25.0,
      lessThan: undefined
    },
    alcohol: {
      greaterThan: undefined,
      lessThan: undefined
    },
    smoker: false
  }
]
