import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { farmerCardDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export const FarmersCardTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const columnsArray = ['Card Name', 'Card Number', 'Active Status', '	Action'];
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    cardDescription: '',
    farmerKisanCardNo: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerCardDetailsReducer = useSelector((state) => state.rootReducer.farmerCardDetailsReducer)
  var farmerCardDetailData = farmerCardDetailsReducer.farmerCardDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    setRowDataValue(farmerCardDetailsReducer, farmerCardDetailData);
  }, [farmerCardDetailData, farmerCardDetailsReducer]);

  const setRowDataValue = (farmerCardDetailsReducer, farmerCardDetailData) => {
    setRowData(farmerCardDetailsReducer.farmerCardDetails.length > 0 ? farmerCardDetailData : []);
  };

  const validateCardDetailsForm = () => {
    let isValid = true;

    if (farmerCardDetailData && farmerCardDetailData.length > 0) {
      farmerCardDetailData.forEach((row, index) => {
        if (!row.cardDescription || !row.farmerKisanCardNo) {
          isValid = false;
          setFormError(true);
        }
      });
    }
    return isValid;
  }

  const handleAddRow = () => {
    if (validateCardDetailsForm()) {
      farmerCardDetailData.push(emptyRow);
      dispatch(farmerCardDetailsAction(farmerCardDetailData));
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerCardDetails = [...rowData];
    farmerCardDetails[index][name] = value;
    farmerCardDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerCardDetailsAction(farmerCardDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerKisanCardId, cardNoToBeDelete) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerKisanCardId, cardNoToBeDelete });
  }

  const deleteFarmerCardDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerCardDetailsReducer.farmerCardDetails.findIndex(x => x.farmerKisanCardNo == paramsData.cardNoToBeDelete);
    farmerCardDetailsReducer.farmerCardDetails.splice(objectIndex, 1)

    var deleteFarmerKisanCardId = localStorage.getItem("DeleteFarmerKisanCardIds");

    var deleteFarmerKisanCardDetail = deleteFarmerKisanCardId ? deleteFarmerKisanCardId + "," + paramsData.encryptedFarmerKisanCardId : paramsData.encryptedFarmerKisanCardId;

    localStorage.setItem("DeleteFarmerKisanCardIds", deleteFarmerKisanCardDetail);

    toast.success("Card details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerCardDetailsAction(farmerCardDetailData));

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
            <h4>Are you sure, you want to delete this card detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerCardDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersCardTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Card Details
        </Button>
      </div>
      <Form
        noValidate
        // validated={formHasError || (farmerError.cardDetailErr.invalidCardDetail)}
        validated={formHasError}
        className="details-form"
        id="AddFarmersCardTableDetailsForm"
      >
        {
          farmerCardDetailData && farmerCardDetailData.length > 0 &&
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
              {rowData.map((farmerCardDetailData, index) => (
                <tr key={index}>
                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtCardName"
                      name="cardDescription"
                      className="form-control"
                      value={farmerCardDetailData.cardDescription}
                      onChange={(e) => handleFieldChange(e, index)}
                      required
                    >
                      <option value='' >Select</option>
                      <option value='KISAN CREDIT CARD'>KISAN CREDIT CARD</option>
                      <option value='ICICI CREDIT CARD'>ICICI CREDIT CARD</option>
                      <option value='SBI CREDIT CARD'>SBI CREDIT CARD</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtFarmersCardNumber"
                      name="farmerKisanCardNo"
                      value={farmerCardDetailData.farmerKisanCardNo}
                      placeholder="Card Name"
                      maxLength={45}
                      className="form-control"
                      onChange={(e) => handleFieldChange(e, index)}
                      required
                    />
                  </td>

                  <td key={index}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      value={farmerCardDetailData.activeStatus}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </td>
                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerCardDetailData.encryptedFarmerKisanCardId, farmerCardDetailData.farmerKisanCardNo) }} />
                  </td>
                </tr>
              )
              )}
            </tbody>
          </Table>
        }

      </Form>
    </>
  );
};

export default FarmersCardTable;
