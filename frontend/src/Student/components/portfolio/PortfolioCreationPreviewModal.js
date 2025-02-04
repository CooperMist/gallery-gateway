import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { EntryNoThumbContainer } from '../ShowCard'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'
import FaVideo from "@fortawesome/fontawesome-free-solid/faVideo"
import FaImage from "@fortawesome/fontawesome-free-solid/faImage"
import WorkReleasePopover from "../../../shared/components/WorkReleasePopover"

/* 
  Creates and returns one element for previewing a portfolio entry.
  Returns either a photo, video, or other media element based on the given props.
*/
function PortfolioEntryPreview(props) {
  switch (props.entry.type) {
    case "video":
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded'>
          <h5>Video Submission <FontAwesomeIcon icon={FaVideo} /> </h5>
          <h5>
            <span className="text-muted">Title: </span> {props.entry.title}
          </h5>
          <h5 className='text-muted'>URL: <a href={props.entry.url} target='_blank'>{props.entry.url}</a> </h5>
        </EntryNoThumbContainer>
      )
    case "photo":
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded'>
          <h5>Photo Submission  <FontAwesomeIcon icon={FaImage} /> </h5>
          <h5>
            <span className="text-muted">Title: </span> {props.entry.title}
          </h5>
          <img className="img-fluid" src={URL.createObjectURL(props.entry.file)} alt="Submitted Photo entry" />
        </EntryNoThumbContainer>
      )
    case "other":
      return (
        <EntryNoThumbContainer className='portfolio-entry border border-dark rounded'>
          <h5>Other Media Submission <FontAwesomeIcon icon={FaBook} /> </h5>
          <h5>
            <span className="text-muted">Title: </span> {props.entry.title}
          </h5>
          <img className="img-fluid" src={URL.createObjectURL(props.entry.file)} alt="Submitted Other Media entry" />
        </EntryNoThumbContainer>
      )
    default:
      return <React.Fragment></React.Fragment>
  }
}

function PortfolioCreationPreviewModal(props) {
  if(props.isPreview) {
    return (
      <Modal isOpen={props.isPreview} toggle={props.cancel} size="lg" className="portfolio-modal">
        <ModalHeader toggle={props.cancel} className='' >
          Portfolio Summary - {props.form_data.title}
        </ModalHeader>
        <ModalBody>
          <h2>Details</h2>
          <p><strong>Created:</strong> {new Date().toDateString()}</p>
          <hr />
          <h2>Entries</h2>
          <div className='d-flex flex-column'>
            {props.form_data.submissions.map((submission) => {
              return <div>
                <PortfolioEntryPreview entry={submission} key={submission.id} /> <br />
              </div>
            })}
          </div>
          <div className='d-flex flex-column'>
          <h2>Additional info</h2>
          <WorkReleasePopover id="modal-pop-over-work-release" />
          <span className='mb-4'><strong>{props.form_data.distributionAllowed ? "Yes" : "No"}</strong></span>
          <span><strong>After submitting this portfolio it cannot be changed. Please click cancel if you want to make any additional changes.</strong></span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" className="mr-auto" onClick={props.cancel}>Cancel</Button>
          <Button color="primary" className="ml-auto" onClick={props.accept}>Confirm</Button>
        </ModalFooter>
      </Modal>
    )
  } else {
        return (
          <Modal isOpen={props.isProcess} size="lg" className="portfolio-modal">
            <ModalHeader className='' >
              Do not close this page!
            </ModalHeader>
            <ModalBody>
              <p>Your portfolio is submitting. This may take a few minutes...</p>
              <p>You will be redirected when it is submitted.</p>
            </ModalBody>
          </Modal>
        )
  }
}

export default PortfolioCreationPreviewModal
