import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { formChangedAction, updateClientContactDetailsAction } from '../../actions/index';
import { clientContactDetailsAction } from '../../actions/index';
import { contactDetailChangedAction } from '../../actions/index'
import { toast } from 'react-toastify';

const ContactDetailsList = () => {

  const dispatch = useDispatch();
  const contactDetailReducer = useSelector((state) => state.rootReducer.clientContactDetailsReducer)
  const clientDetailsErrorReducer = useSelector((state) => state.rootReducer.clientDetailsErrorReducer)
  const clientError = clientDetailsErrorReducer.clientDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const [paramsData, setParamsData] = useState({});

  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {

    const count = $('#ContactDetailsTable tr').length;
    if (count > 1) {
      $("#ContactDetailsTable").show();
    }
  }, []);

  const editContactDetails = (data, mobileNoToUpdate) => {
    $("#AddContactDetailsForm").show();
    $("#btnAddContactDetail").hide();
    $("#btnUpdateContactDetail").show();
    $("#ContactDetailsTable").hide();
    localStorage.setItem("contactPersonMobileNoToUpdate", mobileNoToUpdate);
    dispatch(updateClientContactDetailsAction(data));
  }

  const ModalPreview = (encryptedClientContactDetailsId, contactMobileNoToDelete) => {
    setModalShow(true);
    setParamsData({ encryptedClientContactDetailsId, contactMobileNoToDelete });
  }

  const deleteContactDetails = () => {

    if (!paramsData)
      return false;

    var objectIndex = contactDetailReducer.clientContactDetails.findIndex(x => x.mobileNo == paramsData.contactMobileNoToDelete);
    contactDetailReducer.clientContactDetails.splice(objectIndex, 1)

    var deleteContactDetailId = localStorage.getItem("DeleteContactDetailsId");

    var deleteContactDetail = deleteContactDetailId ? deleteContactDetailId + "," + paramsData.encryptedClientContactDetailsId : paramsData.encryptedClientContactDetailsId;

    localStorage.setItem("DeleteContactDetailsId", deleteContactDetail);

    toast.success("Contact deleted successfully", {
      theme: 'colored'
    });

    dispatch(clientContactDetailsAction(contactDetailReducer.clientContactDetails));

    dispatch(formChangedAction({
      ...formChangedData,
      contactDetailDelete: true
    }))

    setModalShow(false);
  }

  const showAddContactDetailsForm = () => {
    $("#AddContactDetailsForm").show();
    $("#btnAddContactDetail").show();
    $("#btnUpdateContactDetail").hide();
    $('#ContactDetailsTable').hide();
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

      <div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <Button id='btnAdd' onClick={() => showAddContactDetailsForm()} className="mb-2">
            Add Contact Detail
          </Button>
        </div>
        {
          clientError.contactDetailErr && clientError.contactDetailErr.contactEmpty &&
          (
            <div className='mb-2'>
              <span className="error-message">{clientError.contactDetailErr.contactEmpty}</span>
            </div>
          )
        }
        {contactDetailReducer &&
          contactDetailReducer.clientContactDetails &&
          contactDetailReducer.clientContactDetails.length > 0 && (
            <Table striped bordered responsive id="ClientContactDetailsTable" className="no-pb text-nowrap">
              <thead className='custom-bg-200'>
                <tr>
                  <th>S. No</th>
                  <th>Contact Person</th>
                  <th>Mobile No</th>
                  <th>Email Id</th>
                  <th>Designation</th>
                  <th>Send Mail</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id='tableContactPerson'>

                {contactDetailReducer.clientContactDetails.length > 0 ?

                  contactDetailReducer.clientContactDetails.map((data, index) =>
                  (data &&
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.contactPerson}</td>
                      <td>{data.mobileNo}</td>
                      <td>{data.emailId}</td>
                      <td>{data.designation}</td>
                      <td>{data.sendMail == 'Y' ? "Yes" : "No"}</td>
                      <td><i className="fa fa-pencil me-2" onClick={() => { editContactDetails(data, data.mobileNo) }} />
                        <i className="fa fa-trash" onClick={() => { ModalPreview(data.encryptedClientContactDetailsId, data.mobileNo) }} /></td>
                    </tr>)
                  )
                  : null}
              </tbody>
            </Table>)}
      </div>
    </>
  )
};

export default ContactDetailsList;