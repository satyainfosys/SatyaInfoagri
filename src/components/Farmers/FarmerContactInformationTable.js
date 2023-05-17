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
  const [rowData, setRowData] = useState([]);
  const columnsArray = [
    'S.No',
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

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    setRowDataValue(commonContactDetailsReducer, commonContactDetailData);
  }, [commonContactDetailData, commonContactDetailsReducer]);

  const setRowDataValue = (commonContactDetailsReducer, commonContactDetailData) => {
    setRowData(commonContactDetailsReducer.commonContactDetails.length > 0 ? commonContactDetailData : []);
  };

  const validateContactDetailForm = () => {
    let isValid = true;

    if (commonContactDetailData && commonContactDetailData.length > 0) {
      commonContactDetailData.forEach((row, index) => {
        if (!row.contactPerson || !row.contactDetails || !row.contactType) {
          isValid = false;
          setFormError(true);
        }
      });
    }

    if (isValid) {
      setFormError(false)
    }

    return isValid;
  }

  const handleAddRow = () => {

    let formValid = validateContactDetailForm()
    if (formValid) {
      commonContactDetailData.unshift(emptyRow);
      dispatch(commonContactDetailsAction(commonContactDetailData));
    }
  };

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

    if(paramsData.encryptedCommonContactDetailsId){
      var deleteFarmerCommonContactDetails = deleteCommonContactDetailsId ? deleteCommonContactDetailsId + "," + paramsData.encryptedCommonContactDetailsId : paramsData.encryptedCommonContactDetailsId;
      localStorage.setItem("DeleteCommonContactDetailsIds", deleteFarmerCommonContactDetails);
    }        

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
      {
        farmerError.contactErr && farmerError.contactErr.contactEmpty &&
        (
          <div className='mb-2'>
            <span className="error-message">{farmerError.contactErr.contactEmpty}</span>
          </div>
        )
      }
      <Form
        noValidate
        validated={formHasError || (farmerError.contactErr.invalidContactDetail)}
        className="details-form"
        id="AddCommonContactDetailsForm"
      >
        {
          commonContactDetailData && commonContactDetailData.length > 0 &&
          <Table striped bordered responsive id="TableList" className="no-pb text-nowrap">
            <thead className='custom-bg-200'>
              <tr>
                {columnsArray.map((column, index) => (
                  <th className="text-left" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="tbody" className="details-form">
              {rowData.map((commonContactDetailData, index) => (
                <tr key={index}>
                  <td>
                    {index + 1}
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtContactPerson"
                      name="contactPerson"
                      maxLength={45}
                      value={commonContactDetailData.contactPerson}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Contact Person Name"
                      className="form-control"
                      required
                    />
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
                      <option value=''>Select Contact Type</option>
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
                  </td>

                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtContactDetails"
                      name="contactDetails"
                      maxLength={30}
                      value={commonContactDetailData.contactDetails}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Contact Details"
                      className="form-control"
                      required
                    />
                  </td>
                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(commonContactDetailData.encryptedCommonContactDetailsId, commonContactDetailData.contactDetails) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </Form>
    </>
  );
};

export default FarmerContactInformationTable;