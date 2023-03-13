import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLiveStockCattleDetailsAction, farmerLiveStockCattleDetailsListAction } from '../../actions/index';

export const FarmersLiveStockTable = () => {

  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [cattleTypeErr, setCattleTypeErr] = useState({});  
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

  const resetFarmerLiveStockCattleDetail = () => {
    farmerLiveStockCattleData = {
      cattleType: '',
      noOfCattle: 0,
      production: 0,
      rate: 0,
      cattleAge: 0,
      milkType: '',
      activeStatus: ''
    }
  };

  const farmerLiveStockCattleDetailsReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsReducer)
  var farmerLiveStockCattleData = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails;

  const farmerLiveStockCattleDetailsListReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsListReducer)

  if (!farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails ||
    farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.length <= 0) {
    resetFarmerLiveStockCattleDetail();
  }

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

  const changeHandle = e => {
    dispatch(farmerLiveStockCattleDetailsAction({
      ...farmerLiveStockCattleData,
      [e.target.name]: e.target.value
    }));
  };

  const clearStates = () => {
    setFormError(false);
    setCattleTypeErr({});
  }

  const addFarmerLiveStockCattleDetailInList = () => {
    if (validateFarmersLiveStockCattleDetailForm()) {
      const requestData = {
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        cattleType: farmerLiveStockCattleData.cattleType,
        noOfCattle: farmerLiveStockCattleData.noOfCattle ? farmerLiveStockCattleData.noOfCattle : 0,
        production: farmerLiveStockCattleData.production ? farmerLiveStockCattleData.production : 0,
        rate: farmerLiveStockCattleData.rate ? farmerLiveStockCattleData.rate : 0,
        cattleAge: farmerLiveStockCattleData.cattleAge ? farmerLiveStockCattleData.cattleAge : 0,
        milkType: farmerLiveStockCattleData.milkType == null || farmerLiveStockCattleData.milkType == "No" ? "N" : "Y",
        activeStatus: farmerLiveStockCattleData.activeStatus == null || farmerLiveStockCattleData.activeStatus == "Active" ? "A" : "S",
        addUser: localStorage.getItem("LoginUserName"),
      }

      dispatch(farmerLiveStockCattleDetailsListAction(requestData));
      resetFarmerLiveStockCattleDetail();
      clearStates();
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersLiveStockTable"
          className="mb-2"
          onClick={addFarmerLiveStockCattleDetailInList}
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

            <tr>
              <td>
                <Form.Select
                  type="text"
                  id="txtCattleType"
                  value={farmerLiveStockCattleData.cattleType}
                  onChange={changeHandle}
                  name="cattleType"
                  className="form-control"
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

              <td>
                <Form.Control
                  type="number"
                  id="numNoOfCattle"
                  name="noOfCattle"
                  value={farmerLiveStockCattleData.noOfCattle}
                  onChange={changeHandle}
                  placeholder="No Of Cattle"
                  className="form-control"
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numProduction" activeStatus
                  name="production"
                  value={farmerLiveStockCattleData.production}
                  onChange={changeHandle}
                  placeholder="Production"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numRatePerLiter"
                  name="rate"
                  value={farmerLiveStockCattleData.rate}
                  onChange={changeHandle}
                  placeholder="Rate Per Liter"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numAge"
                  name="cattleAge"
                  value={farmerLiveStockCattleData.cattleAge}
                  onChange={changeHandle}
                  placeholder="Age"
                />
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtMilkType"
                  name="milkType"
                  className="form-control"
                  value={farmerLiveStockCattleData.milkType}
                  onChange={changeHandle}
                >                  
                  <option value='Yes'>Yes</option>
                  <option value='No'>No</option>
                </Form.Select>
              </td>

              <td>
                <Form.Select
                  id="txtStatus"
                  name="activeStatus"
                  className="form-control"
                  value={farmerLiveStockCattleData.activeStatus}
                  onChange={changeHandle}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </td>

              <td>
                <i className="fa fa-pencil pe-1" />
                <i className="fa fa-trash" />
              </td>
            </tr>

          </tbody>
          <thead>
            {farmerLiveStockCattleDetailsListReducer.farmerLiveStockCattleDetailsList.length > 0 ?
              farmerLiveStockCattleDetailsListReducer.farmerLiveStockCattleDetailsList.map((data, idx) => (
                data &&
                <tr key={idx}>
                  <td key={idx}>{data.cattleType}</td>
                  <td key={idx}>{data.noOfCattle ? data.noOfCattle : 0}</td>
                  <td key={idx}>{data.production ? data.production : 0}</td>
                  <td key={idx}>{data.rate ? data.rate : 0}</td>
                  <td key={idx}>{data.cattleAge ? data.cattleAge : 0}</td>
                  <td key={idx}>{data.milkType == "Y" ? "Yes" : "No"}</td>
                  <td key={idx}>{data.activeStatus == "A" ? "Active" : "Suspended"}</td>
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

export default FarmersLiveStockTable;
