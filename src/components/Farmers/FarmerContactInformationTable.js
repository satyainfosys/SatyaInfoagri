import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { commonContactDetailsAction } from 'actions';
import { toast } from 'react-toastify';

export const FarmerContactInformationTable = () => {
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, contactPerson: '', contactType: '', contactDetails: '', originatedFrom: 'FR', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName"),
    encryptedConnectingCode: localStorage.getItem("EncryptedFarmerCode")
  },]);
  const columnsArray = [
    'Contact Person',
    'Contact Type',
    'Contact Details',
    'Action'
  ];

  const emptyRow = {
    id: rowData.length + 1,
    encryptedConnectingCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    contactPerson: '',
    contactType: '',
    contactDetails: '',
    originatedFrom: 'FR',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  };


  let commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
  let commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

  useEffect(() => {
    setRowDataValue(commonContactDetailsReducer, commonContactDetailData, emptyRow);
  }, [commonContactDetailData, commonContactDetailsReducer]);

  const setRowDataValue = (commonContactDetailsReducer, commonContactDetailData, emptyRow) => {
    setRowData(commonContactDetailsReducer.commonContactDetails.length > 0 ? commonContactDetailData : [emptyRow]);
  };

  const [contactNameErr, setContactNameErr] = useState({});
  const [contactTypeErr, setContactTypeErr] = useState({});
  const [contactDetailsErr, setContactDetailsErr] = useState({});

  const handleAddRow = () => {

    const newId = rowData.length + 1;
    const newRow = {
      id: newId,
      encryptedConnectingCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
      encryptedCommonContactDetailsId: commonContactDetailData.encryptedCommonContactDetailsId ? commonContactDetailData.encryptedCommonContactDetailsId : '',
      contactPerson: '',
      contactType: '',
      contactDetails: '',
      originatedFrom: 'FR',
      addUser: localStorage.getItem("LoginUserName"),
      modifyUser: localStorage.getItem("LoginUserName"),
      encryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }

    let newArray = commonContactDetailData.push(newRow);
    dispatch(commonContactDetailsAction(commonContactDetailData));
  };


  // const validateCommonContactDetailForm = () => {
  //   const contactNameErr = {};
  //   const contactTypeErr = {};
  //   const contactDetailsErr = {};

  //   let isValid = true;

  //   if (!commonContactDetailData.contactPerson) {
  //     contactNameErr.nameEmpty = "Enter contact person name";
  //     isValid = false;
  //     setFormError(true);
  //   }

  //   if (!commonContactDetailData.contactType) {
  //     contactTypeErr.contactTypeEmpty = "Select contact type";
  //     isValid = false;
  //     setFormError(true);
  //   }

  //   if (!commonContactDetailData.contactDetails) {
  //     contactDetailsErr.contactDetailsEmpty = "Enter contact detail";
  //     isValid = false;
  //     setFormError(true);
  //   }

  //   if (!isValid) {
  //     setContactNameErr(contactNameErr);
  //     setContactTypeErr(contactTypeErr);
  //     setContactDetailsErr(contactDetailsErr);
  //   }
  //   return isValid;
  // }

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var commonContactDetails = [...rowData];
    commonContactDetails[index][name] = value;
    commonContactDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(commonContactDetailsAction(commonContactDetails))
  }

  const ModalPreview = (encryptedCommonContactDetailsId, contactDetailsToDelete) => {
    setModalShow(true);
    setParamsData({ encryptedCommonContactDetailsId, contactDetailsToDelete });
  }

  const deleteFarmerContactDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = commonContactDetailsReducer.commonContactDetails.findIndex(x => x.contactDetails == paramsData.contactDetailsToDelete);
    commonContactDetailsReducer.commonContactDetails.splice(objectIndex, 1)

    var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");

    var deleteFarmerCommonContactDetails = deleteCommonContactDetailsId ? deleteCommonContactDetailsId + "," + paramsData.encryptedCommonContactDetailsId : paramsData.encryptedCommonContactDetailsId;

    localStorage.setItem("DeleteCommonContactDetailsIds", deleteFarmerCommonContactDetails);

    toast.success("Contact details deleted successfully", {
      theme: 'colored'
    });

    dispatch(commonContactDetailsAction(commonContactDetailData));

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);

    setModalShow(false);
  }

  return (
    <>
      {modalShow && paramsData &&
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure, you want to delete this contact detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerContactDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddBankNameTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Contact Details
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
            {rowData.map((commonContactDetailData, index) => (
              <tr key={index}>
                <td key={index}>
                  <Form.Control
                    type="text"
                    id="txtContactPerson"
                    name="contactPerson"
                    maxLength={45}
                    value={commonContactDetailData.contactPerson}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Contact person name"
                    className="form-control"
                    required
                  />
                  {Object.keys(contactNameErr).map((key) => {
                    return <span className="error-message">{contactNameErr[key]}</span>
                  })}
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtContactType"
                    name="contactType"
                    value={commonContactDetailData.contactType}
                    onChange={(e) => handleFieldChange(e, index)}
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

                <td key={index}>
                  <Form.Control
                    type="text"
                    id="txtContactDetails"
                    name="contactDetails"
                    maxLength={30}
                    value={commonContactDetailData.contactDetails}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Contact details"
                    className="form-control"
                    required
                  />
                  {Object.keys(contactDetailsErr).map((key) => {
                    return <span className="error-message">{contactDetailsErr[key]}</span>
                  })}
                </td>
                <td>
                  <i className="fa fa-trash " onClick={() => { ModalPreview(commonContactDetailData.encryptedCommonContactDetailsId, commonContactDetailData.contactDetails) }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default FarmerContactInformationTable;
