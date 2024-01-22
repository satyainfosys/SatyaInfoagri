import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
const tabArray = ['Payment'];

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  let isFormChanged = Object.values(formChangedData).some(value => value === true);

  useEffect(() => {
    $("#btnNew").hide();
    $("#btnSave").show();
  }, []);

  $('[data-rr-ui-event-key*="Payment"]').off('click').on('click', function () {
    $("#btnSave").show();
    $("#btnSave").attr('disabled', true);
    $("#btnNew").hide();
  })

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    if (isFormChanged) {
      setModalShow(true)
    } else {
      window.location.href = '/dashboard';
    }
  }

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true') {
      window.location.href = '/dashboard';
    }
    setModalShow(false);
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
            <Button variant="success" onClick="">Save</Button>
            <Button variant="danger" id="btnDiscard" onClick={() => discardChanges()}>Discard</Button>
          </Modal.Footer>
        </Modal>
      }
      <TabPage
        tabArray={tabArray}
        module='Payment'
        saveDetails=""
        exitModule={exitModule}
      />
    </>
  )
}

export default Payment