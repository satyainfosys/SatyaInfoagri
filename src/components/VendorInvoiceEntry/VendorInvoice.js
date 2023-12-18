import React, { useState } from 'react'
import TabPage from 'components/common/TabPage';
import { useSelector } from 'react-redux';
import { Spinner, Modal, Button } from 'react-bootstrap';

const tabArray = ['Vendor Invoice Entry List', 'Add Vendor Invoice Entry '];

const listColumnArray = [
  { accessor: 'sl', Header: 'S.No' },
  { accessor: 'poNo', Header: 'Po No' },
  { accessor: 'vendorName', Header: 'Vendor Name' },
  { accessor: 'invoiceDate', Header: 'Invoice Date' },
  { accessor: 'dueDate', Header: 'Due Date' },
  { accessor: 'status', Header: 'Status' }
];

const VendorInvoice = () => {
  const [listData, setListData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  const newDetails = () => {
    $('[data-rr-ui-event-key*="Add Vendor Invoice Entry "]').attr('disabled', false);
    $('[data-rr-ui-event-key*="Add Vendor Invoice Entry "]').trigger('click');
    $('#btnSave').attr('disabled', false);
  }

  const cancelClick = () => {
    $('#btnExit').attr('isExit', 'false');
    if (isFormChanged) {
      setModalShow(true);
    }
    else {
      $('[data-rr-ui-event-key*="Vendor Invoice Entry List"]').trigger('click');
    }
  }

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true);
    }
    else {
      window.location.href = '/dashboard';
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      {modalShow &&
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
            <h4>Do you want to save changes?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" >Save</Button>
            <Button variant="danger" id='btnDiscard'>Discard</Button>
          </Modal.Footer>
        </Modal>
      }

      <TabPage
        listData={listData}
        tabArray={tabArray}
        listColumnArray={listColumnArray}
        module="VendorInvoice"
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
      />
    </>
  )
}

export default VendorInvoice