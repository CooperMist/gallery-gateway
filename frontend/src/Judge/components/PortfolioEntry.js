import React from "react"
import { getImageThumbnail, getRawFile, STATIC_PATH } from '../../utils'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { EntryNoThumbContainer } from "../../Student/components/ShowCard";
import FaYouTube from '@fortawesome/fontawesome-free-brands/faYoutube'
import FaVimeo from '@fortawesome/fontawesome-free-brands/faVimeoV'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'
import FaImage from "@fortawesome/fontawesome-free-solid/faImage"

/**
 * Handles rendering a single entry
 * Cases include: PHOTO, VIDEO, and OTHER
 */
function PortfolioEntry({entry}) {
  switch (entry.entryType) {
    case "VIDEO":
      const url =
        entry.provider === 'youtube'
          ? `https://youtube.com/watch?v=${entry.videoId}`
          : `https://vimeo.com/${entry.videoId}`
      const icon =
        entry.provider === 'youtube' ? (
          <FontAwesomeIcon icon={FaYouTube} size='3x' />
        ) : (
          <FontAwesomeIcon icon={FaVimeo} size='3x' />
        )
      const embed_url =
        entry.provider === 'youtube'
          ? `https://youtube.com/embed/${entry.videoId}`
          : `https://player.vimeo.com/video/${entry.videoId}`
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded position-relative'>
          <h5>Video Submission {icon} </h5>
          <h5><span className="text-muted">Distribution Allowed:</span> <span className="fw-bold">{entry.distributionAllowed ? "Yes" : "No"}</span></h5>
          <h5>
            <span className="text-muted">Title: </span>
            <a href={url} target='_blank' className="stretched-link">{entry.title}</a>
          </h5>
          <iframe width="420" height="345" src={embed_url}></iframe>
        </EntryNoThumbContainer>
      )
    case "PHOTO":
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded position-relative'>
          <h5>Photo Submission  <FontAwesomeIcon icon={FaImage} /> </h5>
          <h5><span className="text-muted">Title: </span> {entry.title}</h5>
          <h5><span className="text-muted">Distribution Allowed:</span> <span className="fw-bold">{entry.distributionAllowed ? "Yes" : "No"}</span></h5>
          <h5><a href={`${STATIC_PATH}${getRawFile(entry.path)}`} target="_blank" download>Full Image</a></h5>
          <img className="img-fluid" src={`${STATIC_PATH}${getImageThumbnail(entry.path)}`} alt="Submitted entry" />
        </EntryNoThumbContainer>
      )
    case "OTHER":
    const fileUrl = `${STATIC_PATH}${getRawFile(entry.path)}`;
    const isPdf = entry.path.toLowerCase().endsWith(".pdf");
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded position-relative'>
          <h5>Other Submission  <FontAwesomeIcon icon={FaBook} /> </h5>
          <h5><span className="text-muted">Title: </span> {entry.title}</h5>
          <h5><span className="text-muted">Distribution Allowed:</span> {entry.distributionAllowed ? "Yes" : "No"}</h5>
          <h5><a href={fileUrl} target="_blank" download>Download Link</a></h5>
          {//<iframe src={fileUrl}></iframe>
            }
        </EntryNoThumbContainer>
      )
    default:
      return <React.Fragment></React.Fragment>
  }
}

export default PortfolioEntry;