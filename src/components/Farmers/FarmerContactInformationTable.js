import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { commonContactDetailsAction, commonContactDetailsListAction } from 'actions';

export const FarmerContactInformationTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const columnsArray = [
    'Contact Person',
    'Contact Type',
    'Contact Details',
    'Action'
  ];

  const [contactNameErr, setContactNameErr] = useState({});
  const [contactTypeErr, setContactTypeErr] = useState({});
  const [contactDetailsErr, setContactDetailsErr] = useState({});

  const resetFarmerContactDetailData = () => {
    commonContactDetailData = {
      contactPerson: '',
      contactType: '',
      contactDetails: '',
      originatedFrom: 'FR'
    };
  };

  const commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
  var commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

  const commonContactDetailListReducer = useSelector((state) => state.rootReducer.commonContactDetailsListReducer)

  if (!commonContactDetailsReducer.commonContactDetails ||
    commonContactDetailsReducer.commonContactDetails.length <= 0) {
    resetFarmerContactDetailData();
  }

  const validateCommonContactDetailForm = () => {
    const contactNameErr = {};
    const contactTypeErr = {};
    const contactDetailsErr = {};

    let isValid = true;

    if (!commonContactDetailData.contactPerson) {
      contactNameErr.nameEmpty = "Enter contact person name";
      isValid = false;
      setFormError(true);
    }

    if (!commonContactDetailData.contactType) {
      contactTypeErr.contactTypeEmpty = "Select contact type";
      isValid = false;
      setFormError(true);
    }

    if (!commonContactDetailData.contactDetails) {
      contactDetailsErr.contactDetailsEmpty = "Enter contact detail";
      isValid = false;
      setFormError(true);
    }

    if (!isValid) {
      setContactNameErr(contactNameErr);
      setContactTypeErr(contactTypeErr);
      setContactDetailsErr(contactDetailsErr);
    }
    return isValid;
  }

  const changeHandle = e => {
    dispatch(commonContactDetailsAction({
      ...commonContactDetailData,
      [e.target.name]: e.target.value
    }));
  };

  const clearStates = () => {
    setFormError(false);
    setContactNameErr({});
    setContactTypeErr({});
    setContactDetailsErr({});
    dispatch(commonContactDetailsAction(undefined))
  }

  const addCommonContactDetailInList = () => {
    if (validateCommonContactDetailForm()) {
      const contactData = {
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        contactPerson: commonContactDetailData.contactPerson,
        contactType: commonContactDetailData.contactType,
        contactDetails: commonContactDetailData.contactDetails,
        flag: commonContactDetailData.flag == null || commonContactDetailData.flag == "0" ? "0" : "1",
        originatedFrom: "FR",
        addUser: localStorage.getItem("LoginUserName"),
      }

      dispatch(commonContactDetailsListAction(contactData));
      resetFarmerContactDetailData();
      clearStates();
    }
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddBankNameTable"
          className="mb-2"
          onClick={addCommonContactDetailInList}
        >
          Add Bank Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddCommonContactDetailsForm"
      >
        <Table striped responsive id="TableList" className="no-pb">
          <thead>
            <tr>
              {columnsArray.map((column, index) => (
                <th className="text-left" key={index}>
                  {column}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody id="tbody" className="details-form">
            <tr>
              <td>
                <Form.Control
                  type="text"
                  id="txtContactPerson"
                  name="contactPerson"
                  maxLength={45}
                  value={commonContactDetailData.contactPerson}
                  onChange={changeHandle}
                  placeholder="Contact person name"
                  className="form-control"
                  required
                />
                {Object.keys(contactNameErr).map((key) => {
                  return <span className="error-message">{contactNameErr[key]}</span>
                })}
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtContactType"
                  name="contactType"
                  value={commonContactDetailData.contactType}
                  onChange={changeHandle}
                  className="form-control"
                  required
                >
                  <option value=''>Select contact type</option>
                  <option value="OFE">Office Email Id</option>
                  <option value="OFM">Office Mobile No</option>
                  <option value="OFL">Office Land Line No</option>
                  <option value="OFX">Office Ext No</option>
                  <option value="OFF">Office Fax No</option>
                  <option value="PPP">PP No</option>
                  <option value="PMN">Personal Mobile No</option>
                  <option value="PRL">Personal Land Line No</option>
                  <option value="PRS">Spouse Mob No</option>
                  <option value="PRE">Personal Mail</option>
                </Form.Select>
                {Object.keys(contactTypeErr).map((key) => {
                  return <span className="error-message">{contactTypeErr[key]}</span>
                })}
              </td>

              <td>
                <Form.Control
                  type="text"
                  id="txtContactDetails"
                  name="contactDetails"
                  maxLength={30}
                  value={commonContactDetailData.contactDetails}
                  onChange={changeHandle}
                  placeholder="Contact details"
                  className="form-control"
                  required
                />
                {Object.keys(contactDetailsErr).map((key) => {
                  return <span className="error-message">{contactDetailsErr[key]}</span>
                })}
              </td>
              <td>
                <i className="fa fa-pencil me-1" />
                <i className="fa fa-trash " />
              </td>
            </tr>
          </tbody>
          <thead>
            {commonContactDetailListReducer.commonContactDetailsList.length > 0 ?
              commonContactDetailListReducer.commonContactDetailsList.map((data, idx) => (
                data &&
                <tr key={idx}>
                  <td key={idx}>{data.contactPerson}</td>
                  <td key={idx}>{data.contactType == "OFE" ? "Office Email Id" :
                    data.contactType == "OFM" ? "Office Mobile No" :
                      data.contactType == "OFL" ? "Office Land Line No" :
                        data.contactType == "OFX" ? "Office Ext No" :
                          data.contactType == "OFF" ? "Office Fax No" :
                            data.contactType == "PPP" ? "PP No" :
                              data.contactType == "PMN" ? "Personal Mobile No" :
                                data.contactType == "PRL" ? "Land Line No" :
                                  data.contactType == "PRS" ? "Spouse Mob No" : "Personal Mail"}</td>
                  <td>{data.contactDetails}</td>
                  <td>
                    <i className="fa fa-pencil me-2" />
                    <i className="fa fa-trash" />
                  </td>
                </tr>
              )) : null}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FarmerContactInformationTable;
