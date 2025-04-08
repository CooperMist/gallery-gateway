import ScholarshipSubmissions from "../../models/scholarshipSubmissions";

export function scholarshipSubmission(_, args, context) {
    const { id } = args
    return ScholarshipSubmissions.findByPk(id)
}

export function scholarshipSubmissions(_, args, context) {
    const { orderBy, portfolioId, portfolioPeriodId, scholarshipId } = args
    let whereClause = {
        where: {}
    }
    // Build the where clause and ensure all ids provided are an int
    if(!isNaN(portfolioId)) whereClause.where.portfolioId = portfolioId
    if(!isNaN(portfolioPeriodId)) whereClause.where.portfolioPeriodId = portfolioPeriodId
    if(!isNaN(scholarshipId)) whereClause.where.scholarshipId = scholarshipId

    // Apply ordering, if desired
    const order = orderBy ? { order: [[orderBy.sort, orderBy.direction]] } : {}

    return ScholarshipSubmissions.findAll(Object.assign({}, whereClause, order))
}

export function portfolioEssays(_, args, context) {
    return ScholarshipSubmissions.findAll({
        where: { portfolioId: args.portfolioId }
      })
}