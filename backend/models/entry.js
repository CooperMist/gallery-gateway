import Image from './image'
import Video from './video'
import Other from './other'
import Group from './group'
import User from './user'
import Vote from './vote'
import DataTypes from 'sequelize'
import sequelize from '../config/sequelize'
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'

const Entry = sequelize.define('entry', {
  academicProgram: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  awardWon: {
    type: DataTypes.TEXT
  },
  comment: {
    type: DataTypes.TEXT
  },
  distributionAllowed: {
    type: DataTypes.BOOLEAN,
  },
  entryType: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  entryId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  excludeFromJudging: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  forSale: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN
  },
  groupId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'groups',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  invited: {
    allowNull: true,
    type: DataTypes.BOOLEAN
  },
  moreCopies: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN
  },
  // The id of the portfolio the entry is associated with (only if showId is null)
  portfolioId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'portfolios',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  showId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'shows',
      key: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  studentUsername: {
    allowNull: true,
    type: DataTypes.STRING,
    references: {
      model: 'users',
      key: 'username'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'Untitled',
    allowNull: false
  },
  yearLevel: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  score: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
},
{
  validate: {
    entrantPresentValidation () {
      if (!this.studentUsername && !this.groupId) {
        throw new Error('Entry must have an entrant')
      }
    }
  }
})

/*
* Calculate the score on the entry
*/
Entry.prototype.getScore = function getScore () {
  // Calculate score by getting all votes with this
  // entry id and then averaging over the sum of the votes
  return Vote.findAll({ where: { entryId: this.id } })
    .then((votes) => {
      const votesValues = votes.map(vote => vote.value)
      if (votesValues.length === 0) {
        return 0
      }
      return votesValues.reduce((acc, curr) => acc + curr) / votesValues.length
    })
}

/*
 * Gets the associated photo as a Promise
 */
Entry.prototype.getImage = function getImage () {
  if (this.entryType !== IMAGE_ENTRY) {
    return Promise.resolve(null)
  }
  return this.imagePromise ? this.imagePromise
    : (this.imagePromise = Image.findOne({ where: { id: this.entryId } }))
}

Entry.prototype.getVideo = function getVideo () {
  if (this.entryType !== VIDEO_ENTRY) {
    return Promise.resolve(null)
  }
  return this.videoPromise ? this.videoPromise
    : (this.videoPromise = Video.findOne({ where: { id: this.entryId } }))
}

Entry.prototype.getOther = function getOther () {
  if (this.entryType !== OTHER_ENTRY) {
    return Promise.resolve(null)
  }
  return this.otherPromise ? this.otherPromise
    : (this.otherPromise = Other.findOne({ where: { id: this.entryId } }))
}

Entry.prototype.getGroup = function getGroup () {
  if (!this.isGroupSubmission()) {
    return Promise.resolve(null)
  }
  return Group.findByPk(this.groupId)
}

Entry.prototype.getStudent = function getUser () {
  if (!this.isStudentSubmission()) {
    return Promise.resolve(null)
  }
  return User.findByPk(this.studentUsername)
}

Entry.prototype.isGroupSubmission = function () {
  return Number.isInteger(this.groupId)
}

Entry.prototype.isStudentSubmission = function () {
  return !!this.studentUsername
}

export default Entry
