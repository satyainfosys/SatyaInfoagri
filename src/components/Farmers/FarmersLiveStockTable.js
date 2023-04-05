import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLiveStockCattleDetailsAction } from '../../actions/index';
import { toast } from 'react-toastify';

export const FarmersLiveStockTable = () => {

  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [cattleTypeErr, setCattleTypeErr] = useState({});
  const [rowData, setRowData] = useState([{
    id: 1,
    cattleType: '',
    noOfCattle: 0,
    production: 0,
    rate: 0,
    cattleAge: 0,
    milkType: '',
    activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  },]);
  const columnsArray = [
    'Cattle Type',
    'No Of Cattle',
    'Production',
    'Rate Per Liter',
    'Age',
    'Milk Type',
    'Active Status',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});

  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    cattleType: '',
    noOfCattle: 0,
    production: 0,
    rate: 0,
    cattleAge: 0,
    milkType: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerLiveStockCattleDetailsReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsReducer)
  var farmerLiveStockCattleData = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails;

  useEffect(() => {
    setRowDataValue(farmerLiveStockCattleDetailsReducer, farmerLiveStockCattleData, emptyRow);
  }, [farmerLiveStockCattleData, farmerLiveStockCattleDetailsReducer]);

  const setRowDataValue = (farmerLiveStockCattleDetailsReducer, farmerLiveStockCattleData, emptyRow) => {
    setRowData(farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.length > 0 ? farmerLiveStockCattleData : [emptyRow]);
  };

  const handleAddRow = () => {
    const newId = rowData.length + 1;
    const newRow = {
      id: newId,
      encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
      encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      encryptedFarmerCattleCode: farmerLiveStockCattleData.encryptedFarmerCattleCode ? farmerLiveStockCattleData.encryptedFarmerCattleCode : '',
      cattleType: '',
      noOfCattle: 0,
      production: 0,
      rate: 0,
      cattleAge: 0,
      milkType: '',
      activeStatus: '',
      addUser: localStorage.getItem("LoginUserName"),
      modifyUser: localStorage.getItem("LoginUserName")
    }
    let newArray = farmerLiveStockCattleData.push(newRow);
    dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleData));
  };

  const validateFarmersLiveStockCattleDetailForm = () => {
    const cattleTypeErr = {};

    let isValid = true;

    if (!farmerLiveStockCattleData.cattleType) {
      cattleTypeErr.empty = "Select cattle type";
      isValid = false;
      setFormError(true);
    }

    if (!isValid) {
      setCattleTypeErr(cattleTypeErr);
    }

    return isValid;
  }

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerLiveStockCattleDetails = [...rowData];
    farmerLiveStockCattleDetails[index][name] = value;
    farmerLiveStockCattleDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  };

  const ModalPreview = (encryptedFarmerCattleCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerCattleCode });
  }

  const deleteFarmerCattleLiveStockDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.findIndex(x => x.encryptedFarmerCattleCode == paramsData.encryptedFarmerCattleCode);
    farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.splice(objectIndex, 1)

    var deleteFarmerLiveStockDetailCode = localStorage.getItem("DeleteFarmerLiveStockCattleDetailIds");

    var deleteFarmerCattleLiveStockDetail = deleteFarmerLiveStockDetailCode ? deleteFarmerLiveStockDetailCode + "," + paramsData.encryptedFarmerCattleCode : paramsData.encryptedFarmerCattleCode;

    localStorage.setItem("DeleteFarmerLiveStockCattleDetailIds", deleteFarmerCattleLiveStockDetail);

    toast.success("Cattle details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleData));

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
            <h4>Are you sure, you want to delete this livestock cattle detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerCattleLiveStockDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersLiveStockTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Live Stock Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersLiveStockTableDetailsForm"
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
            {rowData.map((farmerLiveStockCattleData, index) => (
              <tr key={index}>
                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtCattleType"
                    name="cattleType"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, index)}
                    value={farmerLiveStockCattleData.cattleType}
                  >
                    <option value=''>Select</option>
                    <option value='Cow'>Cow</option>
                    <option value='Buffalo'>Buffalo</option>
                    <option value='Poultry Bird'>Poultry Bird</option>
                    <option value='Goat'>Goat</option>
                    <option value='Sheep'>Sheep</option>
                    <option value='Poni'>Poni</option>
                    <option value='Pig'>Pig</option>
                    <option value='Camel'>Camel</option>
                    <option value='Horse'>Horse</option>
                    <option value='Others'>Others</option>
                  </Form.Select>
                  {Object.keys(cattleTypeErr).map((key) => {
                    return <span className="error-message">{cattleTypeErr[key]}</span>
                  })}
                </td>

                <td key={index}>
                  <Form.Control
                    type="number"
                    id="numNoOfCattle"
                    name="noOfCattle"
                    value={farmerLiveStockCattleData.noOfCattle}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="No Of Cattle"
                    className="form-control"
                  />
                </td>

                <td key={index}>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numProduction" activeStatus
                    name="production"
                    value={farmerLiveStockCattleData.production}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Production"
                  />
                </td>

                <td key={index}>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numRatePerLiter"
                    name="rate"
                    value={farmerLiveStockCattleData.rate}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Rate Per Liter"
                  />
                </td>

                <td key={index}>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numAge"
                    name="cattleAge"
                    value={farmerLiveStockCattleData.cattleAge}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Age"
                  />
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtMilkType"
                    name="milkType"
                    className="form-control"
                    value={farmerLiveStockCattleData.milkType}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value='Yes'>Yes</option>
                    <option value='No'>No</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    id="txtStatus"
                    name="activeStatus"
                    className="form-control"
                    value={farmerLiveStockCattleData.activeStatus}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </Form.Select>
                </td>

                <td>
                  <i className="fa fa-trash" onClick={() => { ModalPreview(farmerLiveStockCattleData.encryptedFarmerCattleCode) }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default FarmersLiveStockTable;
