import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { commonContactDetailsAction, formChangedAction } from 'actions';
import { toast } from 'react-toastify';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CommonContactTable = () => {
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
    contactPerson: '',
    contactType: '',
    contactDetails: '',
    originatedFrom: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  };

  let commonContactDetailsReducer = useSelector((state) => state.rootReducer.commonContactDetailsReducer)
  let commonContactDetailData = commonContactDetailsReducer.commonContactDetails;

  const commonContactDetailErrorReducer = useSelector((state) => state.rootReducer.commonContactDetailErrorReducer)
  const contactDetailError = commonContactDetailErrorReducer.commonContactDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

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

    if (commonContactDetails[index].encryptedCommonContactDetailsId) {
      dispatch(formChangedAction({
        ...formChangedData,
        contactDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        contactDetailAdd: true
      }))
    }
  }

  const ModalPreview = (encryptedCommonContactDetailsId, contactDetailsToDelete) => {
    setModalShow(true);
    setParamsData({ encryptedCommonContactDetailsId, contactDetailsToDelete });
  }

  const deleteCommonContactDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = commonContactDetailsReducer.commonContactDetails.findIndex(x => x.contactDetails == paramsData.contactDetailsToDelete);
    commonContactDetailsReducer.commonContactDetails.splice(objectIndex, 1)

    var deleteCommonContactDetailsId = localStorage.getItem("DeleteCommonContactDetailsIds");

    if (paramsData.encryptedCommonContactDetailsId) {
      var deleteCommonContactDetails = deleteCommonContactDetailsId ? deleteCommonContactDetailsId + "," + paramsData.encryptedCommonContactDetailsId : paramsData.encryptedCommonContactDetailsId;
      localStorage.setItem("DeleteCommonContactDetailsIds", deleteCommonContactDetails);
    }

    toast.success("Contact details deleted successfully", {
      theme: 'colored'
    });

    dispatch(commonContactDetailsAction(commonContactDetailData));

    dispatch(formChangedAction({
      ...formChangedData,
      contactDetailDelete: true
    }))

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
            <Button variant="danger" onClick={() => deleteCommonContactDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }

      {
        contactDetailError.contactErr && contactDetailError.contactErr.contactEmpty &&
        (
          <div className='mb-2'>
            <span className="error-message">{contactDetailError.contactErr.contactEmpty}</span>
          </div>
        )
      }
      <Card className="h-100 mb-2">
        <FalconCardHeader
          title="Contact Details"
          titleTag="h6"
          className="py-2"
          light
          endEl={
            <Flex>
              <div >
                <Button
                  variant="primary"
                  size="sm"
                  className="btn-reveal"
                  type="button"
                  onClick={handleAddRow}
                >
                  <i className="fa-solid fa-plus" />
                </Button>
              </div>
            </Flex>
          }
        />
        {
          commonContactDetailData && commonContactDetailData.length > 0 &&
          <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
            <Form
              noValidate
              validated={formHasError || (contactDetailError.contactErr.invalidContactDetail)}
              className="details-form"
              id="AddCommonContactDetailsForm"
            >
              <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
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
                        <EnlargableTextbox
                          id="txtContactPerson"
                          name="contactPerson"
                          maxLength={45}
                          value={commonContactDetailData.contactPerson}
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Contact Person Name"
                          className="form-control"
                          required={true}
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
                        <EnlargableTextbox
                          id="txtContactDetails"
                          name="contactDetails"
                          maxLength={30}
                          value={commonContactDetailData.contactDetails}
                          onChange={(e) => handleFieldChange(e, index)}
                          placeholder="Contact Details"
                          className="form-control"
                          required={true}
                        />
                      </td>
                      <td>
                        <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(commonContactDetailData.encryptedCommonContactDetailsId, commonContactDetailData.contactDetails) }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form>
          </Card.Body>
        }
      </Card>
    </>
  );
};

export default CommonContactTable;