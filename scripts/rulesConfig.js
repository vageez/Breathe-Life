const healthRules = [
  {
    point: -15,
    health: ['DEPRESSION', 'ANXIETY'],
    bmi: {
      less: 18.5
    },
    alcohol: {
      greater: 10,
    },
    smoker: false
  },
  {
    point: -25,
    health: ['SURGERY'],
    bmi: {
      greater: 25.0,
    },
    alcohol: {
      greater: 10,
    },
    smoker: true
  },
  {
    point: -30,
    health: ['HEART'],
    bmi: {
      greater: 30.0,
    },
    alcohol: {
    },
    smoker: false
  }
]

module.exports = healthRules