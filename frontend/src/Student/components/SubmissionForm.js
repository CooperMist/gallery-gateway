import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'

import { Formik, Field } from 'formik'
import * as yup from 'yup'
import styled from 'styled-components'

import SelectInput from '../../shared/components/SelectInput'
import SuccessModal from './SuccessModal'
import SubmitAsGroupRadio from './SubmitAsGroupRadio'
import HomeTownInput from './HometownInput'
import DisplayNameInput from './DisplayNameInput'
import FileUploadInput from './FileUploadInput'
import WorkReleasePopover from '../../shared/components/WorkReleasePopover'

const Header = styled.h1`
  margin-bottom: 10px;
`

const SubHeader = styled.h3`
  margin-bottom: 25px;
`

const ButtonContainer = styled.div`
  margin-top: 50px;
`

class SubmissionForm extends Component {
  static defaultProps = {
    previewImage: {}
  }

  constructor(props) {
    super(props)
    this.state = { showModal: false }
    // Clear any uploaded files for the next time a user views the form.
    if (props.clearPreview) { props.clearPreview() }
    this.submitForm = this.submitForm.bind(this)
    this.buildInput = this.buildInput.bind(this)
    this.createEntry = this.createEntry.bind(this)
    this.buildValidationSchema = this.buildValidationSchema.bind(this)
  }

  renderErrors = (touched, errors, field) => {
    // Render feedback if this field's been touched and has errors
    if (touched[field] && errors[field]) {
      return (
        <FormFeedback style={{ display: 'block' }}>
          {errors[field]}
        </FormFeedback>
      )
    }
    // Otherwise, don't render anything
    return null
  }

  // Create the object of input values and submit the entry
  submitForm(values) {
    const inputs = this.buildInput(values)
    this.createEntry(inputs, values)
  }

  // Create the object containing all input values for submission
  buildInput(values) {
    return {
      entry: {
        group: values.submittingAsGroup === 'yes'
          ? {
            creatorUsername: this.props.user.username,
            participants: values.groupParticipants
          } : null,
        displayName: values.displayName,
        distributionAllowed: values.distributionAllowed === 'yes',
        hometown: values.submittingAsGroup === 'no' ? values.hometown : null,
        studentUsername: values.submittingAsGroup === 'no' ? this.props.user.username : null,
        showId: this.props.forShow.id,
        academicProgram: values.academicProgram,
        yearLevel: values.yearLevel,
        title: values.title,
        comment: values.comment,
        forSale: values.forSale === 'yes',
        // Must select 'forSale = yes' first
        // So, if you select 'forSale = yes', 'moreCopies = yes', 'forSale = no' => 'moreCopies' will be false
        moreCopies:
          values.forSale === 'yes' && values.moreCopies === 'yes'
      },
      mediaType: values.mediaType,
      horizDimInch: values.horizDimInch,
      vertDimInch: values.vertDimInch,
      url: values.url,
      path: values.path
    }
  }

  // Create the validation schema for the form ui
  buildValidationSchema() {
    const isRequiredString = yup.string().required('Required') // required string field
    const isRequiredNumber = yup.number().required('Required') // required number field
    const radioValues = yup.string().required('Required').oneOf(['yes', 'no']) // radio values
    const isPhoto = this.props.type === 'Photo' // form is for photo submission

    return yup.object().shape({
      academicProgram: isRequiredString,
      yearLevel: isRequiredString,
      title: isRequiredString,
      distributionAllowed: radioValues,
      submittingAsGroup: radioValues,
      forSale: radioValues,
      moreCopies: radioValues,
      groupParticipants: yup.string().when('submittingAsGroup', {
        is: 'yes',
        then: isRequiredString
      }),
      comment: yup.string(),
      hometown: yup.string().when('submittingAsGroup', {
        is: 'no',
        then: isRequiredString
      }),
      // conditional schema for different types
      mediaType: isPhoto ? isRequiredString.nullable() : null, // react-select uses 'null' to represent when the value is cleared
      horizDimInch: isPhoto ? isRequiredNumber.positive('Width Must be Positive') : null,
      vertDimInch: isPhoto ? isRequiredNumber.positive('Height Must be Positive') : null,
      url: this.props.type === 'Video' ? isRequiredString.url('Must be a valid URL') : null,
      path: this.props.type !== 'Video' ? isRequiredString : null
    })
  }

  // Create an entry, show the success modal, and then go to the dashboard
  createEntry(input, values) {
    // removes non-null from input
    const cleanInput = Object.fromEntries(Object.entries(input).filter(([_, v]) => v != null))
    this.props.create(cleanInput)
      .then(() => {
        if (values.submittingAsGroup === 'no')
          this.props.handleHometown(values.hometown)
        this.props.handleDisplayName(values.displayName)
      })
      .then(() => {
        this.props.done()
      })
      .catch(err => this.props.handleError(err.message))
  }

  render() {
    const validation = this.buildValidationSchema()
    
    return (
      <FormGroup>
        <Fragment>
          <Formik
            initialValues={{
              academicProgram: '',
              yearLevel: '',
              submittingAsGroup: this.props.canSubmitAsSingle ? 'no' : 'yes',
              groupParticipants: '',
              title: 'Untitled',
              comment: '',
              mediaType: this.props.type === 'Photo' ? '' : null,
              horizDimInch: this.props.type === 'Photo' ? '' : null,
              vertDimInch: this.props.type === 'Photo' ? '' : null,
              distributionAllowed: 'no',
              forSale: 'no',
              moreCopies: 'no',
              path: this.props.type !== 'Video' ? '' : null,
              url: this.props.type === 'Video' ? '' : null,
              hometown: this.props.user.hometown || '',
              displayName: this.props.user.displayName || ''
            }}
            validationSchema={validation}
            onSubmit={values => { this.submitForm(values) }}>
            {({
              values,
              errors,
              touched,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
              isSubmitting
            }) => {
              return (
                <Form onSubmit={handleSubmit} style={{ marginBottom: '75px' }}>
                  <Row>
                    <Col xs='12' md='8' style={{ margin: '0 auto' }}>
                      <Header>New {this.props.type} Submission</Header>
                      <SubHeader>{this.props.forShow.name}</SubHeader>
                      <FormGroup>
                        <Label>Academic Program</Label>
                        <Field
                          type='text'
                          id='academicProgram'
                          name='academicProgram'
                          className='form-control'
                          required
                        />
                        {this.renderErrors(touched, errors, 'academicProgram')}
                      </FormGroup>
                      <FormGroup>
                        <Label>Year Level</Label>
                        <Field
                          type='text'
                          id='yearLevel'
                          name='yearLevel'
                          className='form-control'
                          required
                        />
                        {this.renderErrors(touched, errors, 'yearLevel')}
                      </FormGroup>
                      <SubmitAsGroupRadio
                        values={values}
                        touched={touched}
                        errors={errors}
                        canSubmitAsSingle={this.props.canSubmitAsSingle}
                        renderErrors={this.renderErrors}
                      />
                      {values.submittingAsGroup === 'yes' ? (
                        <FormGroup>
                          <Label>List the names of your other group members.</Label>
                          <Field
                            type='text'
                            id='groupParticipants'
                            name='groupParticipants'
                            className='form-control'
                            required
                          />
                          {this.renderErrors(touched, errors, 'groupParticipants')}
                        </FormGroup>
                      ) : null}
                      {this.props.type === 'Video' ? <FormGroup>
                        <Label>YouTube or Vimeo Video URL</Label>
                        <Field
                          type="url"
                          id="url"
                          name="url"
                          className="form-control"
                          placeholder=""
                          required
                        />
                        {this.renderErrors(touched, errors, 'url')}
                      </FormGroup>
                        : null}
                      <FormGroup>
                        <Label>Title</Label>
                        <Field
                          type='text'
                          id='title'
                          name='title'
                          className='form-control'
                          required
                        />
                        {this.renderErrors(touched, errors, 'title')}
                      </FormGroup>
                      <FormGroup>
                        <Label for='comment'>Artist Comment (Optional)</Label>
                        <Field
                          component='textarea'
                          id='comment'
                          name='comment'
                          className='form-control'
                          rows={4}
                        />
                        {this.renderErrors(touched, errors, 'comment')}
                      </FormGroup>
                      {values.submittingAsGroup === 'no' ? (
                        <HomeTownInput
                          hometownNeeded={!this.props.user.hometown}
                          values={values}
                          touched={touched}
                          errors={errors}
                          renderErrors={this.renderErrors}
                        />
                      ) : null}
                      <DisplayNameInput
                        displayNameNeeded={!this.props.user.displayName}
                        values={values}
                        touched={touched}
                        errors={errors}
                        renderErrors={this.renderErrors}
                      />
                      {this.props.type === 'Photo' ? <FormGroup>
                        <Label>Type of Media</Label>
                        <SelectInput
                          id='mediaType'
                          name='mediaType'
                          field='mediaType'
                          input={{
                            onChange: setFieldValue,
                            onBlur: setFieldTouched,
                            value: values.mediaType
                          }}
                          options={[
                            { value: 'Chromogenic Print', label: 'Chromogenic Print' },
                            { value: 'Inkjet Print', label: 'Inkjet Print' }
                          ]}
                          placeholder={'Select or create option...'}
                          required
                        />
                        {this.renderErrors(touched, errors, 'mediaType')}
                      </FormGroup>
                        : null}
                      {this.props.type === 'Photo' ? <FormGroup>
                        <Label>Dimensions (inches)</Label>
                        <div className='input-group'>
                          <Label for='horizDimInch' hidden>
                            Width
                          </Label>
                          <Field
                            type='number'
                            id='horizDimInch'
                            name='horizDimInch'
                            className='form-control'
                            placeholder='width'
                            required
                            style={{
                              borderTopLeftRadius: '0.25rem',
                              borderBottomLeftRadius: '0.25rem'
                            }}
                          />
                          <div className='input-group-prepend input-group-append'>
                            <span className='input-group-text'>x</span>
                          </div>
                          <Label for='vertDimInch' hidden>
                            Height
                          </Label>
                          <Field
                            type='number'
                            id='vertDimInch'
                            name='vertDimInch'
                            className='form-control'
                            placeholder='height'
                            required
                          />
                        </div>
                        {this.renderErrors(touched, errors, 'horizDimInch')}
                        {this.renderErrors(touched, errors, 'vertDimInch')}
                      </FormGroup>
                        : null}
                      <FormGroup>
                        <Label>
                          Is this work available for purchase if selected for a
                          purchase award?
                        </Label>
                        {['no', 'yes'].map((i, id) => { // rendering no and yes radios
                          return (
                            <FormGroup check key={id}>
                              <Label check>
                                <Field
                                  type='radio'
                                  id='forSale'
                                  name='forSale'
                                  value={i}
                                  required
                                  checked={values.forSale === i}
                                />
                                <span className='ml-2'>{i}</span>
                              </Label>
                            </FormGroup>
                          )
                        })}
                        {this.renderErrors(touched, errors, 'forSale')}
                      </FormGroup>
                      {values.forSale === 'yes' ? (
                        <FormGroup>
                          <Label>
                            If selected for multiple purchase awards, are you
                            willing to sell multiple copies?
                          </Label>
                          {['no', 'yes'].map((i, id) => { // rendering no and yes radios
                            return (
                              <FormGroup check key={id}>
                                <Label check>
                                  <Field
                                    type='radio'
                                    id='moreCopies'
                                    name='moreCopies'
                                    value={i}
                                    required
                                    checked={values.moreCopies === i}
                                  />
                                  <span className='ml-2'>{i}</span>
                                </Label>
                              </FormGroup>
                            )
                          })}
                          {this.renderErrors(touched, errors, 'moreCopies')}
                        </FormGroup>
                      ) : null}
                      <FormGroup>
                        <WorkReleasePopover />
                        {['no', 'yes'].map((value, idx) => { // rendering no and yes radios
                          return (
                            <FormGroup check key={idx}>
                              <Label check>
                                <Field
                                  type='radio'
                                  id='distributionAllowed'
                                  name='distributionAllowed'
                                  value={value}
                                  required
                                  checked={values.distributionAllowed === value}
                                />
                                <span className='ml-2'>{value}</span>
                              </Label>
                            </FormGroup>
                          )
                        })}
                        {this.renderErrors(touched, errors, 'forSale')}
                      </FormGroup>
                      {this.props.type !== 'Video' ? <FileUploadInput
                        accept='image/jpeg'
                        errors={errors}
                        handleImageUpload={this.props.handleImageUpload}
                        handlePDFUpload={this.props.handlePDFUpload}
                        name='path'
                        previewFile={this.props.previewImage}
                        renderErrors={this.renderErrors}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        type={this.props.type}
                      />
                        : null}
                      <ButtonContainer>
                        <Link to={`/submit?to=${this.props.forShow.id}`}>
                          <Button
                            type='button'
                            color='danger'
                            style={{ cursor: 'pointer', width: '150px' }}
                          >
                            Back
                          </Button>
                        </Link>
                        <Button
                          type='submit'
                          color='primary'
                          style={{ cursor: 'pointer', float: 'right', width: '150px' }}
                          disabled={isSubmitting}
                        >
                          Submit
                        </Button>
                      </ButtonContainer>
                    </Col>
                  </Row>
                </Form>
              )
            }}
          </Formik>
          <SuccessModal isOpen={this.props.showModal} />
        </Fragment>
      </FormGroup>
    )
  }
}
export default SubmissionForm
