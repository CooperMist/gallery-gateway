/* eslint-disable no-unused-vars */
import { ApolloServer, gql } from 'apollo-server-express'

import resolvers from './resolvers'

const typeDefs = gql`
scalar Date

type User {
    username: ID!
    firstName: String!
    lastName: String!
    displayName: String
    hometown: String
    type: UserType!
    entries: [Entry]
    shows(date: Date): [Show]
}

input UserInput {
    username: String!
    firstName: String!
    lastName: String!
    displayName: String
    hometown: String
}

input PermissionInput {
    username: String!
    type: UserType
}

type Group {
    id: ID!
    creator: User!
    participants: String!
}

input GroupInput {
    creatorUsername: String!
    participants: String!
}

type PortfolioPeriod {
    id: ID!
    name: String
    description: String
    startDate: Date!
    endDate: Date!
    judges: [User]
    judgingStartDate: Date!
    judgingEndDate: Date!
    portfolios: [Portfolio]
    createdAt: Date!
    updatedAt: Date!
}

input PortfolioPeriodInput {
    name: String
    description: String
    startDate: Date!
    endDate: Date!
    judgingStartDate: Date!
    judgingEndDate: Date!
}

input PortfolioPeriodUpdate {
    name: String
    description: String
    startDate: Date
    endDate: Date
    judgingStartDate: Date
    judgingEndDate: Date
}

type PortfolioPeriodJudge {
    portfolioPeriodId: ID!
    judgeUsername: String!
}

input PortfolioPeriodJudgeInput {
    portfolioPeriodId: Int!
    usernames: [String]!
}

type Portfolio {
    id: ID!
    title: String!
    studentUsername: String!
    description: String
    portfolioPeriodId: ID
    score: Float
    entries: [Entry]
    createdAt: Date!
    updatedAt: Date!
}

input PortfolioInput {
    title: String!
    description: String
    studentUsername: String
    portfolioPeriodId: String
}

input ScholarshipInput {
    name: String!
    description: String!
}

input UpdateScholarshipInput {
    name: String
    description: String
    active: Boolean
}

type Scholarship {
    id: ID!
    active: Boolean
    name: String!
    description: String
    submissions: [Portfolio]
}

input ScholarshipSubmissionInput {
    scholarshipId: Int!
    portfolioId: Int!
    essayPath: String!
}

type ScholarshipSubmission {
    id: ID!
    scholarshipId: Int
    scholarship: Scholarship
    portfolioPeriodId: Int
    portfolioId: Int
    portfolio: Portfolio
    essayPath: String
}

type Show {
    id: ID!
    name: String!
    description: String
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
    entryCap: Int!
    finalized: Boolean
    entries: [Entry]
    judges: [User]
    ownVotes: [Vote]
    createdAt: Date!
    updatedAt: Date!
}

input ShowInput {
    name: String!
    description: String
    entryStart: Date!
    entryEnd: Date!
    judgingStart: Date!
    judgingEnd: Date!
    entryCap: Int!
}

input ShowUpdate {
    name: String
    description: String
    entryStart: Date
    entryEnd: Date
    judgingStart: Date
    judgingEnd: Date
    entryCap: Int
    finalized: Boolean
}

type Vote {
    id: ID!
    judge: User
    entry: Entry
    value: Int!
}

input VoteInput {
    judgeUsername: String!
    entryId: Int!
    value: Int!
}

type Rating {
    id: ID!
    portfolio: Portfolio
    rating: Int!
    judge: User
}

input RatingInput {
    portfolioId: Int!
    rating: Int!
    judgeUsername: String!
}

interface Entry {
    id: ID!
    distributionAllowed: Boolean
    group: Group
    student: User
    show: Show
    portfolioId: Int
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean
}

input EntryInput {
    group: GroupInput
    distributionAllowed: Boolean
    studentUsername: String
    showId: Int
    portfolioId: Int
    title: String!
    comment: String
    forSale: Boolean
    hometown: String
    displayName: String
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
}

input EntryUpdate {
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    excludeFromJudging: Boolean
}

type Photo implements Entry {
    id: ID!
    group: Group
    distributionAllowed: Boolean
    student: User
    show: Show
    portfolioId: Int
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

    path: String!
    horizDimInch: Float
    vertDimInch: Float
    mediaType: String
}

input PhotoInput {
    entry: EntryInput
    path: String!
    horizDimInch: Float!
    vertDimInch: Float!
    mediaType: String!
}

type Video implements Entry {
    id: ID!
    group: Group
    student: User
    distributionAllowed: Boolean
    show: Show
    portfolioId: Int
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

    provider: String!
    videoId: String!
}

input VideoInput {
    entry: EntryInput
    url: String!
}

type OtherMedia implements Entry {
    id: ID!
    group: Group
    distributionAllowed: Boolean
    student: User
    show: Show
    portfolioId: Int
    title: String
    comment: String
    forSale: Boolean
    invited: Boolean
    yearLevel: String
    academicProgram: String
    moreCopies: Boolean
    score: Float
    entryType: String
    votes: [Vote]
    excludeFromJudging: Boolean

    path: String!
}

input OtherMediaInput {
    entry: EntryInput
    path: String
}

enum UserType {
    STUDENT
    ADMIN
    JUDGE
}

type Query {
    self: User
    user(id: ID!): User
    users(type: UserType): [User]
    group(id: ID!): Group
    portfolio(id: ID!): Portfolio
    portfolioPeriod(id: ID): PortfolioPeriod
    portfolioPeriods(orderBy: OrderByItem, active: Boolean, activeSubmission: Boolean, activeJudging: Boolean): [PortfolioPeriod]
    portfolios(orderBy: OrderByItem, studentUsername: String): [Portfolio]
    scholarship(id: ID): Scholarship
    scholarships(orderBy: OrderByItem, includeInactive: Boolean): [Scholarship]
    scholarshipSubmission(id: ID): ScholarshipSubmission
    scholarshipSubmissions(orderBy: OrderByItem, portfolioId: Int, portfolioPeriodId: Int, scholarshipId: Int): [ScholarshipSubmission]
    show(id: ID!): Show
    groups: [Group]
    shows(orderBy: OrderByItem, studentUsername: String): [Show]
    vote(entryId: ID!, judgeUsername: String!): Vote
    votes(showId: ID!, judgeUsername: String): [Vote]
    rating(portfolioId: ID!, judgeUsername: String!): Rating
    ratings(portfolioPeriodId: ID!, judgeUsername: String!): [Rating]
    photo(id: ID!): Photo
    video(id: ID!): Video
    otherMedia(id: ID!): OtherMedia
    entry(id: ID!): Entry
    entries(showId: ID, studentUsername: String): [Entry]
    periodPortfolios(portfolioPeriodId: ID!): [Portfolio]
}

type Mutation {
    createJudge(input: UserInput!): User
    createAdmin(input: UserInput!): User
    updatePermissions(input: PermissionInput!): User
    updateUser(input: UserInput!): User
    deleteUser(id: ID!): User

    createScholarship(input: ScholarshipInput!): Scholarship
    
    updateScholarship(id: ID!, input: UpdateScholarshipInput!): Scholarship

    createScholarshipSubmission(input: ScholarshipSubmissionInput!): ScholarshipSubmission

    createShow(input: ShowInput!): Show
    updateShow(id: ID!, input: ShowUpdate!): Show
    deleteShow(id: ID!): Boolean
    assignToShow(showId: ID!, usernames: [String]!): Boolean
    removeFromShow(showId: ID!, usernames: [String]!): Boolean

    createPortfolio(input: PortfolioInput!): Portfolio

    assignJudgesToPortfolioPeriod(input: PortfolioPeriodJudgeInput! ): Boolean
    removeJudgesFromPortfolioPeriod(portfolioPeriodId: ID!, usernames: [String]!): Boolean
    createPortfolioPeriod(input: PortfolioPeriodInput!): PortfolioPeriod
    updatePortfolioPeriod(id: ID!, input: PortfolioPeriodUpdate!): PortfolioPeriod

    createPhoto(input: PhotoInput!): Show
    createVideo(input: VideoInput!): Show
    createOtherMedia(input: OtherMediaInput!): Show
    updateEntry(id: ID!, input: EntryUpdate!): Entry

    vote(input: VoteInput): Vote
    rating(input: RatingInput): Rating
}

enum SortDirection {
    ASC
    DESC
}

input OrderByItem {
    sort: String!
    direction: SortDirection!
}
`

const SCHEMA = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    authType: req.auth.type,
    username: req.auth.username
  })
})

// NOTE: Uncomment in development to have schema endpoints mocked
// addMockFunctionsToSchema({schema})

export default SCHEMA
