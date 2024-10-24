import moment from 'moment'
import { download, genId, FISH_JPG, TREE_JPG, BOOK_JPG, APPLES_JPG, RUNNING_JPG, PURPLE_THING_JPG, BOOK_COVER_JPG, SAMPLE_PDF } from "./20180415220000-seed-demo"

export function up (queryInterface, Sequelize) {
    return Promise.all([
      download(FISH_JPG, '5864ff80-2d22-4fb6-a1d5-d2c537f4317a', 'jpg'),
      download(TREE_JPG, 'c7091aea-9d34-49ad-a7cd-311fd93dce83', 'jpg'),
      download(BOOK_JPG, 'e25d9093-d3da-4b2c-ae39-17520114d8d1', 'jpg'),
      download(APPLES_JPG, 'db98604f-9a2f-4339-907c-a1901dcfe058', 'jpg'),
      download(RUNNING_JPG, '4f566242-d504-491e-bab7-509f3ceea5e6', 'jpg'),
      download(PURPLE_THING_JPG, '8ab1c0b4-3733-49be-8d2e-a364f19165f6', 'jpg'),
      download(BOOK_COVER_JPG, '2f8e972e-1bae-41a2-b90b-fd4532f2268a', 'jpg')
      //download(SAMPLE_PDF, '1a5a1357-44bb-4d6e-9d5b-9c727be776fa', 'pdf')
    ])
    .then(() => {
      // Create ids for each portfolio period
      const portfolioPeriodIdActive = 1
      const portfolioPeriodIdExpired = 2
      const portfolioPeriodIdInJudging = 3
      const portfolioPeriodIdFuture = 4

      /// Create entry and judgings dates for each period
      // Active Period
      const startDateActive = new Date()
      const endDateActive = new Date() 
      endDateActive.setDate(endDateActive.getDate() + 14)

      const startJudgingActive = new Date()
      startJudgingActive.setDate(startJudgingActive.getDate() + 15)
      const endJudgingActive = new Date()
      endJudgingActive.setDate(endJudgingActive.getDate() + 29)

      // Expired Period
      const startDateExpired = new Date()
      startDateExpired.setDate(startDateExpired.getDate() - 45)
      const endDateExpired = new Date()
      endDateExpired.setDate(endDateExpired.getDate() - 40)

      const startJudgingExpired = new Date()
      startJudgingExpired.setDate(startJudgingExpired.getDate() - 39)
      const endJudgingExpired = new Date()
      endJudgingExpired.setDate(endJudgingExpired.getDate() - 20)
      
      // In Judging Period
      const startDateInJudging = new Date()
      startDateInJudging.setDate(startDateInJudging.getDate() - 20)
      const endDateInJudging = new Date()
      endDateInJudging.setDate(endDateInJudging.getDate() - 1)

      const startJudgingDateInJudging = new Date()
      const endJudgingDateInJudging = new Date()
      endJudgingDateInJudging.setDate(endJudgingDateInJudging.getDate() + 14)

      // Future Period
      const startDateFuture = new Date()
      startDateFuture.setDate(startDateFuture.getDate() + 14)
      const endDateFuture = new Date()
      endDateFuture.setDate(endDateFuture.getDate() + 28)

      const startJudgingDateFuture = new Date()
      startJudgingDateFuture.setDate(startJudgingDateFuture.getDate() + 29)
      const endJudgingDateFuture = new Date()
      endJudgingDateFuture.setDate(endJudgingDateFuture.getDate() + 35)

      return queryInterface.bulkInsert('portfolioPeriods', [
        // Active portfolio period entry
        {
          id: portfolioPeriodIdActive,
          startDate: startDateActive,
          endDate: endDateActive,
          judgingStartDate: startJudgingActive,
          judgingEndDate: endJudgingActive 
        },

        // Expired portfolio period entry
        {
          id: portfolioPeriodIdExpired,
          startDate: startDateExpired,
          endDate: endDateExpired,
          judgingStartDate: startJudgingExpired,
          judgingEndDate: endJudgingExpired
        },

        // In judging portfolio period entry
        {
          id: portfolioPeriodIdInJudging,
          startDate: startDateInJudging,
          endDate: endDateInJudging,
          judgingStartDate: startJudgingDateInJudging,
          judgingEndDate: endJudgingDateInJudging
        },

        // Future portfolio period entry
        {
          id: portfolioPeriodIdFuture,
          startDate: startDateFuture,
          endDate: endDateFuture,
          judgingStartDate: startJudgingDateFuture,
          judgingEndDate: endJudgingDateFuture
        }
      ]).then(() => ({portfolioPeriodIdActive, portfolioPeriodIdExpired, portfolioPeriodIdInJudging, portfolioPeriodIdFuture}))
    })
    .then (ids => {     
      const {portfolioPeriodIdActive, portfolioPeriodIdExpired, portfolioPeriodIdInJudging, portfolioPeriodIdFuture} = ids
      const portfolioId1 = 1 
      const portfolioId2 = 2 
      const portfolioId3 = 3 
      const portfolioId4 = 4 
      const portfolioId5 = 5 

      // Create 2 portfolios for student with username = "user7",
      // create 2 portfolios for student with username = "user6",
      // and 1 portfolio for student with username = "user8"
      return queryInterface.bulkInsert('portfolios', [
        {
          id: portfolioId1,
          title: 'User7 Portfolio 1',
          studentUsername: 'user7',
          name: 'Nature Portfolio',
          portfolioPeriodId: portfolioPeriodIdActive
        },
        {
          id: portfolioId2,
          title: 'User6 Portfolio 1',
          studentUsername: 'user6',
          name: 'Farming Portfolio',
          portfolioPeriodId: portfolioPeriodIdActive
        },
        {
          id: portfolioId3,
          title: 'User7 Portfolio 2',
          studentUsername: 'user7',
          name: 'Test Portfolio',
          portfolioPeriodId: portfolioPeriodIdExpired
        },
        {
          id: portfolioId4,
          title: 'User6 Portfolio 2',
          studentUsername: 'user6',
          name: 'Random Portfolio',
          portfolioPeriodId: portfolioPeriodIdInJudging
        },
        {
          id: portfolioId5,
          title: 'User8 Portfolio 1',
          studentUsername: 'user8',
          name: 'Future Portfolio',
          portfolioPeriodId: portfolioPeriodIdInJudging
        },
      ]).then(() => ({...ids, portfolioId1, portfolioId2, portfolioId3, portfolioId4, portfolioId5}))
    })
    .then(ids => {
      const {portfolioPeriodIdActive, portfolioPeriodIdExpired, portfolioPeriodIdInJudging, portfolioPeriodIdFuture} = ids

      return queryInterface.bulkInsert('portfolioPeriodJudges', [
        // Assigns judges user2 and user3 to active portfolio period
        {
          portfolioPeriodId: portfolioPeriodIdActive,
          judgeUsername: 'user2'
        },
        {
          portfolioPeriodId: portfolioPeriodIdActive,
          judgeUsername: 'user3'
        },

        // Assigns judges user2 and user4 to expired portfolio period
        {
          portfolioPeriodId: portfolioPeriodIdExpired,
          judgeUsername: 'user2'
        },
        {
          portfolioPeriodId: portfolioPeriodIdExpired,
          judgeUsername: 'user4'
        },

        // Assigns judges user3 and user4 to a portfolio period currently in judging
        {
          portfolioPeriodId: portfolioPeriodIdInJudging,
          judgeUsername: 'user3'
        },
        {
          portfolioPeriodId: portfolioPeriodIdInJudging,
          judgeUsername: 'user4'
        },

        // Assigns judges user3 and user5 to future portfolio period
        {
          portfolioPeriodId: portfolioPeriodIdFuture,
          judgeUsername: 'user3'
        },
        {
          portfolioPeriodId: portfolioPeriodIdFuture,
          judgeUsername: 'user5'
        }
      ]).then(() => ({...ids}))
    })
    .then (ids => {
      // add all the images
      const now = moment()
      const fishImageId = genId()
      const treeImageId = genId()
      const bookImageId = genId()
      const applesImageId = genId()
      const runningImageId = genId()
      const purpleThingImageId = genId()

      return queryInterface.bulkInsert('images', [
        {
          id: fishImageId,
          path: '5/8/5864ff80-2d22-4fb6-a1d5-d2c537f4317a.jpg',
          horizDimInch: 20,
          vertDimInch: 11,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: treeImageId,
          path: 'c/7/c7091aea-9d34-49ad-a7cd-311fd93dce83.jpg',
          horizDimInch: 10,
          vertDimInch: 8,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: bookImageId,
          path: 'e/2/e25d9093-d3da-4b2c-ae39-17520114d8d1.jpg',
          horizDimInch: 20,
          vertDimInch: 31,
          mediaType: 'Inkjet Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: applesImageId,
          path: 'd/b/db98604f-9a2f-4339-907c-a1901dcfe058.jpg',
          horizDimInch: 8.5,
          vertDimInch: 11,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: runningImageId,
          path: '4/f/4f566242-d504-491e-bab7-509f3ceea5e6.jpg',
          horizDimInch: 21,
          vertDimInch: 24,
          mediaType: 'Inkjet Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: purpleThingImageId,
          path: '8/a/8ab1c0b4-3733-49be-8d2e-a364f19165f6.jpg',
          horizDimInch: 21,
          vertDimInch: 25,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        fishImageId,
        treeImageId,
        bookImageId,
        applesImageId,
        runningImageId,
        purpleThingImageId
      }))
    })
    .then(ids => {
      const { 
        fishImageId, treeImageId, bookImageId, applesImageId, runningImageId, purpleThingImageId} = ids
      const portfolioId1 = 1 
      const portfolioId2 = 2 
      const portfolioId3 = 3 
      const portfolioId4 = 4 
      const portfolioId5 = 5
      
      const fishEntryId = genId()
      const treeEntryId = genId()
      const bookEntryId = genId()
      const applesEntryId = genId()
      const runningEntryId = genId()
      const purpleThingEntryId = genId()

      const now = moment()
      return queryInterface.bulkInsert('entries', [

        // make user 7 add the fish and the tree to their first portfolio
        {
          id: fishEntryId,
          portfolioId: portfolioId1 ,
          studentUsername: 'user7',
          entryType: 1,
          entryId: fishImageId,
          title: 'Betta In Bloom',
          comment: '',
          moreCopies: 1,
          forSale: 1,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: treeEntryId,
          portfolioId: portfolioId1 ,
          studentUsername: 'user7',
          entryType: 1,
          entryId: treeImageId,
          title: 'Tree in the Field',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },

        // make user 6 add the book to their first portfolio
        {
          id: bookEntryId,
          portfolioId: portfolioId2 ,
          studentUsername: 'user6',
          entryType: 1,
          entryId: bookImageId,
          title: 'Light Reading',
          comment: '',
          moreCopies: 1,
          forSale: 1,
          yearLevel: 'four',
          academicProgram: 'Software Engineering',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },

        // make user 7 add the apple to their second portfolio
        {
          id: applesEntryId,
          portfolioId: portfolioId3 ,
          studentUsername: 'user7',
          entryType: 1,
          entryId: applesImageId,
          title: 'One a Day',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },

        // make user 6 add the running image to their second portfolio
        {
          id: runningEntryId,
          portfolioId: portfolioId4 ,
          studentUsername: 'user6',
          entryType: 1,
          entryId: runningImageId,
          title: 'Zoom',
          comment: '',
          moreCopies: 1,
          forSale: 1,
          yearLevel: 'four',
          academicProgram: 'Software Engineering',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },

        // make user 8 add the purple thing to their first portfolio
        {
          id: purpleThingEntryId,
          portfolioId: portfolioId5 ,
          studentUsername: 'user8',
          entryType: 1,
          entryId: purpleThingImageId,
          title: 'Purple Thing',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'three',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        fishEntryId,
        treeEntryId
      }))
    })
  }
  
  export function down (queryInterface) {
    return queryInterface.bulkDelete('portfolios', null)
  }