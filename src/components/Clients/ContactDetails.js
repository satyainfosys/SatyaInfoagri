import React from 'react';
import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { formChangedAction, updateClientContactDetailsAction } from '../../actions/index';
import { clientContactDetailsAction } from '../../actions/index'
import { contactDetailChangedAction } from '../../actions/index'
import EnlargableTextbox from 'components/common/EnlargableTextbox';

const ContactDetails = () => {

  const dispatch = useDispatch();

  const resetContactDetailData = () => {
    contactDetailData = {
      contactPerson: '',
      mobileNo: '',
      emailId: '',
      designation: '',
      sendMail: ''
    }
  }

  const contactDetailListReducer = useSelector((state) => state.rootReducer.clientContactDetailsReducer)
  const contactDetailList = contactDetailListReducer.clientContactDetails;

  const updateClientContactDetailReducer = useSelector((state) => state.rootReducer.updateClientContactDetailReducer)
  var contactDetailData = updateClientContactDetailReducer.updateClientContactDetails;

  if (!updateClientContactDetailReducer.updateClientContactDetails ||
    updateClientContactDetailReducer.updateClientContactDetails.length <= 0) {
    resetContactDetailData();
  }

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const [formHasError, setFormError] = useState(false);
  const [contactNameErr, setContactNameErr] = useState({});
  const [contactMobileNoErr, setContactMobileNoErr] = useState({});
  const [emailIdErr, setEmailIdErr] = useState({});

  const validateContactDetailForm = () => {
    const contactNameErr = {};
    const contactMobileNoErr = {};
    const emailIdErr = {};

    let isValid = true;

    if (!contactDetailData.contactPerson) {
      contactNameErr.nameEmpty = "Enter contact person name";
      isValid = false;
      setFormError(true);
    }

    if (!contactDetailData.mobileNo) {
      contactMobileNoErr.mobileNoEmpty = "Enter contact mobile number";
      isValid = false;
      setFormError(true);
    }
    else if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(contactDetailData.mobileNo))) {
      contactMobileNoErr.mobileNoInvalid = "Invalid mobile number, mobile number should be of 10 digits";
      isValid = false;
      setFormError(true);
    }

    if (contactDetailData.emailId) {
      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contactDetailData.emailId))) {
        emailIdErr.emailInvalid = "Invalid email address";
        isValid = false;
        setFormError(true);
      }
    }
    if (!isValid) {
      setContactNameErr(contactNameErr);
      setContactMobileNoErr(contactMobileNoErr);
      setEmailIdErr(emailIdErr);
    }
    return isValid;
  }

  const clearStates = () => {
    setFormError(false);
    setContactNameErr({});
    setContactMobileNoErr({});
    setEmailIdErr({});
  }


  const addContactDetailInList = () => {

    if (validateContactDetailForm()) {
      const userData = {
        encryptedClientContactDetailsId: "",
        encryptedClientCode: localStorage.getItem("EncryptedResponseClientCode"),
        contactPerson: contactDetailData.contactPerson,
        mobileNo: contactDetailData.mobileNo,
        emailId: contactDetailData.emailId,
        designation: contactDetailData.designation,
        sendMail: contactDetailData.sendMail == "Y" ? "Y" : "N",
        addUser: localStorage.getItem("LoginUserName"),
      }

      dispatch(clientContactDetailsAction(userData));

      dispatch(formChangedAction({
        ...formChangedData,
        contactDetailAdd: true
      }))

      toast.success("Contact Added Successfully", {
        theme: 'colored'
      });

      hideForm();
    }
  };

  const updateContactDetails = () => {

    if (validateContactDetailForm()) {

      var contactPersonMobileNoToUpdate = localStorage.getItem("contactPersonMobileNoToUpdate");

      const contactDetail = {
        encryptedClientContactDetailsId: contactDetailData.encryptedClientContactDetailsId,
        encryptedClientCode: contactDetailData.encryptedClientCode,
        contactPerson: contactDetailData.contactPerson,
        mobileNo: contactDetailData.mobileNo,
        emailId: contactDetailData.emailId,
        designation: contactDetailData.designation,
        sendMail: contactDetailData.sendMail == "Y" ? "Y" : "N",
        addUser: contactDetailData.addUser,
        modifyUser: localStorage.getItem("LoginUserName"),
      }

      var objectIndex = contactDetailList.findIndex(x => x.mobileNo == contactPersonMobileNoToUpdate);
      contactDetailList[objectIndex] = contactDetail;

      dispatch(clientContactDetailsAction(contactDetailList));

      dispatch(formChangedAction({
        ...formChangedData,
        contactDetailUpdate: true
      }))

      toast.success("Contact Updated Successfully", {
        theme: 'colored'
      });

      hideForm();

      localStorage.setItem("contactPersonMobileNoToUpdate", "");
    }
  };

  const handleFieldChange = e => {
    dispatch(updateClientContactDetailsAction({
      ...contactDetailData,
      [e.target.name]: e.target.value
    }));
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  };

  const hideForm = () => {
    $("#AddContactDetailsForm").hide();
    $("#ContactDetailsTable").show();
    dispatch(updateClientContactDetailsAction(undefined));
    resetContactDetailData();
    clearStates();
  }

  return (
    <>
      {contactDetailData &&
        <Form noValidate validated={formHasError} className="details-form" id='AddContactForm'>
          <Row>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label className='details-form'>Contact Person<span className="text-danger">*</span></Form.Label>
                <EnlargableTextbox id="txtContactPerson" name="contactPerson" maxLength={50} value={contactDetailData.contactPerson} onChange={handleFieldChange} placeholder="Contact person name" required={true} />
                {Object.keys(contactNameErr).map((key) => {
                  return <span className="error-message">{contactNameErr[key]}</span>
                })}
              </Row>
            </Col>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Mobile No<span className="text-danger">*</span></Form.Label>
                <EnlargableTextbox id="txtMobileno" name="mobileNo" maxLength={10} value={contactDetailData.mobileNo} onChange={handleFieldChange} placeholder="Mobile No" required={true}
                  onKeyPress={(e) => {
                    const regex = /[0-9]|\./;
                    const key = String.fromCharCode(e.charCode);
                    if (!regex.test(key)) {
                      e.preventDefault();
                    }
                  }} />
                {Object.keys(contactMobileNoErr).map((key) => {
                  return <span className="error-message">{contactMobileNoErr[key]}</span>
                })}
              </Row>
            </Col>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Email Id</Form.Label>
                <EnlargableTextbox id="txtEmailId" name="emailId" maxLength={50} value={contactDetailData.emailId} onChange={handleFieldChange} placeholder="Email Id" />
                {Object.keys(emailIdErr).map((key) => {
                  return <span className="error-message">{emailIdErr[key]}</span>
                })}
              </Row>
            </Col>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Designation</Form.Label>
                <EnlargableTextbox id="txtDesignation" name="designation" maxLength={50} value={contactDetailData.designation} onChange={handleFieldChange} placeholder="Designation" />
              </Row>
            </Col>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Send Mail</Form.Label>
                <Form.Select id="txtSendMail" name="sendMail" value={contactDetailData.sendMail} onChange={handleFieldChange}>
                  <option value=''>Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </Form.Select>
              </Row>
              <Row className="mb-2" id='btnAddContactDetail'>
                <Button variant="primary" type="button" onClick={() => addContactDetailInList()}>
                  Add
                </Button>
              </Row>
              <Row className="mb-2" id='btnUpdateContactDetail'>
                <Button variant="primary" onClick={() => updateContactDetails()}>
                  Update
                </Button>
              </Row>
              <Row className="mb-2">
                <Button variant="danger" onClick={() => hideForm()}>
                  Cancel
                </Button>
              </Row>
            </Col>
          </Row>
        </Form>
      }
    </>
  )
};


export default ContactDetails;