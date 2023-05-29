import React, { useState } from 'react'
import { clientContactListAction, formChangedAction } from 'actions'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import { useEffect } from 'react';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import { toast } from 'react-toastify';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';

export const ContactDetails = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});

  const columnsArray = [
    'S.No',
    'Contact Person',
    'Mobile No',
    'Email Id',
    'Designation',
    'Send Mail',
    'Action'
  ];

  const dispatch = useDispatch();

  const emptyRow = {
    id: rowData.length + 1,
    encryptedClientCode: localStorage.getItem("EncryptedResponseClientCode") ? localStorage.getItem("EncryptedResponseClientCode") : "",
    contactPerson: '',
    mobileNo: '',
    emailId: '',
    designation: '',
    sendMail: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const clientContactListReducer = useSelector((state) => state.rootReducer.clientContactListReducer)
  let clientContactListData = clientContactListReducer.clientContactList;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (clientContactListReducer.clientContactList.length > 0) {
      setRowData(clientContactListData)
    }

  }, [clientContactListData, clientContactListReducer])

  const validateContactDetailForm = () => {
    let isValid = true;

    if (clientContactListData && clientContactListData.length > 0) {
      clientContactListData.forEach((row, index) => {
        if (!row.contactPerson || !row.mobileNo) {
          isValid = false;
          setFormError(true);
        }

        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(row.mobileNo))) {
          isValid = false;
          setFormError(true);
        }

        if (row.emailId) {
          if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(row.emailId))) {
            isValid = false;
            setFormError(true);
          }
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
      clientContactListData.unshift(emptyRow)
      dispatch(clientContactListAction(clientContactListData))
    }
  }

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var contactDetails = [...rowData];
    contactDetails[index][name] = value;
    contactDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(clientContactListAction(contactDetails))

    if (contactDetails[index].encryptedClientContactDetailsId) {
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

  const ModalPreview = (encryptedClientContactDetailsId, contactMobileNoToDelete) => {
    setModalShow(true);
    setParamsData({ encryptedClientContactDetailsId, contactMobileNoToDelete });
  }

  const deleteContactDetails = () => {

    if (!paramsData)
      return false;

    var objectIndex = clientContactListReducer.clientContactList.findIndex(x => x.mobileNo == paramsData.contactMobileNoToDelete);
    clientContactListReducer.clientContactList.splice(objectIndex, 1)

    var deleteContactDetailId = localStorage.getItem("DeleteContactDetailsId");

    if (paramsData.encryptedClientContactDetailsId) {
      var deleteContactDetail = deleteContactDetailId ? deleteContactDetailId + "," + paramsData.encryptedClientContactDetailsId : paramsData.encryptedClientContactDetailsId;
      localStorage.setItem("DeleteContactDetailsId", deleteContactDetail);
    }

    toast.success("Contact deleted successfully", {
      theme: 'colored'
    });

    dispatch(clientContactListAction(clientContactListData));

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
            <Button variant="danger" onClick={() => deleteContactDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <Card className="h-100 mb-2" id='ContactDetailsTable'>
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
        <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
          
        <Form
          noValidate
          // validated={formHasError || (farmerError.landDetailErr.invalidLandDetail)}
          validated={formHasError}
          className="details-form"
          id="AddClientContactDetailsForm"
        >
          {
            clientContactListData && clientContactListData.length > 0 &&
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
                {rowData.map((clientContactListData, index) => (
                  <tr key={index}>
                    <td>
                      {index + 1}
                    </td>

                    <td key={index}>
                      <EnlargableTextbox
                        id="txtContactPerson"
                        name="contactPerson"
                        value={clientContactListData.contactPerson}
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Contact Person Name"
                        className="form-control"
                        required={true}
                        maxLength={50}
                      />
                    </td>

                    <td key={index}>
                      <EnlargableTextbox
                        id="txtMobileno"
                        name="mobileNo"
                        value={clientContactListData.mobileNo}
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Mobile No"
                        className="form-control"
                        maxLength={10}
                        required={true}
                        onKeyPress={(e) => {
                          const regex = /[0-9]|\./;
                          const key = String.fromCharCode(e.charCode);
                          if (!regex.test(key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>

                    <td key={index}>
                      <EnlargableTextbox
                        id="txtEmailId"
                        name="emailId"
                        value={clientContactListData.emailId}
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Email Id"
                        className="form-control"
                        maxLength={50}
                      />
                    </td>

                    <td key={index}>
                      <EnlargableTextbox
                        id="txtDesignation"
                        name="designation"
                        value={clientContactListData.designation}
                        onChange={(e) => handleFieldChange(e, index)}
                        placeholder="Designation"
                        className="form-control"
                        maxLength={50}
                      />
                    </td>

                    <td key={index}>
                      <Form.Select
                        type="text"
                        id="txtSendMail"
                        name="sendMail"
                        className="form-control"
                        value={clientContactListData.sendMail}
                        onChange={(e) => handleFieldChange(e, index)}
                      >
                        <option value=''>Select</option>
                        <option value="Y">Yes</option>
                        <option value="N">No</option>
                      </Form.Select>
                    </td>

                    <td>
                      <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(clientContactListData.encryptedClientContactDetailsId, clientContactListData.mobileNo) }} />
                    </td>
                  </tr>
                ))
                }
              </tbody>
            </Table>
          }
        </Form>

      </Card.Body>
      </Card>
    </>
  )
}

export default ContactDetails