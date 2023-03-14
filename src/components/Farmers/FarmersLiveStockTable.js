import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLiveStockCattleDetailsAction } from '../../actions/index';

export const FarmersLiveStockTable = () => {

  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [cattleTypeErr, setCattleTypeErr] = useState({});
  const [rowData, setRowData] = useState([{
    id: 1, cattleType: '', noOfCattle: 0, production: 0, rate: 0, cattleAge: 0, milkType: '', activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
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

  const handleAddRow = () => {
    setRowData([...rowData, {
      id: rowData.length + 1, cattleType: '', noOfCattle: 0, production: 0, rate: 0, cattleAge: 0, milkType: '', activeStatus: '',
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
    },]);
  };

  const farmerLiveStockCattleDetailsReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsReducer)
  var farmerLiveStockCattleData = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails;

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
  };

  return (
    <>
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
                  <i className="fa fa-pencil pe-1" />
                  <i className="fa fa-trash" />
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
