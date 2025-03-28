export default {
    Rating: {
      judge (rating) {
        return rating.getJudge()
      },
      portfolio (rating) {
        return rating.getPortfolio()
      }
    }
  }
  