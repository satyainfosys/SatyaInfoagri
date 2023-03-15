import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerMachineryDetailsAction } from '../../actions/index';

export const FarmersMachinaryDetailsTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, machineryCategory: '', machineryType: '', machineryQty: '', activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
  },]);
  const columnsArray = [
    'Equipment Category',
    'Equipment Type',
    'Quantity',
    'Active Status',
    'Action'
  ];

  const handleAddRow = () => {
    setRowData([...rowData, { id: rowData.length + 1, machineryCategory: '', machineryType: '', machineryQty: '', activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName") },]);
  };

  const farmerMachineryDetailsReducer = useSelector((state) => state.rootReducer.farmerMachineryDetailsReducer)
  var farmerMachineryDetailsData = farmerMachineryDetailsReducer.farmerMachineryDetails;

  const handleFieldChange = (e, idx) => {
    const { name, value } = e.target;
    var farmerMachineryDetails = [...rowData];
    farmerMachineryDetails[idx][name] = value;
    farmerMachineryDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerMachineryDetailsAction(farmerMachineryDetails))
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button id="btnAddFarmersMachinaryTable" className="mb-2" onClick={handleAddRow}>
          Add Machinery Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersMachinaryTableDetailsForm"
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
            {rowData.map((farmerMachineryDetailsData, idx) => (
              <tr key={idx}>
                <td key={idx}>
                  <Form.Select
                    type="text"
                    id="txtEquipment"
                    name="machineryCategory"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, idx)}
                    value={farmerMachineryDetailsData.machineryCategory}
                  >
                    <option value=''>Select</option>
                    <option value="HIRED">HIRED</option>
                    <option value="OWNED">OWNED</option>
                  </Form.Select>
                </td>

                <td key={idx}>
                  <Form.Select
                    type="text"
                    id="txtequipmentType"
                    name="machineryType"
                    value={farmerMachineryDetailsData.machineryType}
                    placeholder="Equipment Type"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, idx)}
                  >
                    <option value=''>Select</option>
                    <option value='Tractor'>Tractor</option>
                    <option value='Leveller'>Leveller</option>
                    <option value='Biogas'>Biogas</option>
                    <option value='Vermi Compost'>Vermi Compost</option>
                    <option value='Polyhouse'>Polyhouse</option>
                    <option value='NetHouse'>NetHouse</option>
                    <option value='Solar Light'>Solar Light</option>
                    <option value='Spray Pump'>Spray Pump</option>
                    <option value='Vegetable Crates'>Vegetable Crates</option>
                    <option value='Tillerweeder'>Tillerweeder</option>
                    <option value='Irregation Pump'>Irregation Pump</option>
                    <option value='Weeder'>Weeder</option>
                    <option value='Tiller'>Tiller</option>
                  </Form.Select>
                </td>

                <td key={idx}>
                  <Form.Control
                    type="number"
                    min={0}
                    id="txtQuantity"
                    name="machineryQty"
                    value={farmerMachineryDetailsData.machineryQty}
                    placeholder="Quantity"
                    onChange={(e) => handleFieldChange(e, idx)}
                  />
                </td>

                <td key={idx}>
                  <Form.Select
                    id="txtStatus"
                    name="activeStatus"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, idx)}
                    value={farmerMachineryDetailsData.activeStatus}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </Form.Select>
                </td>
                <td>
                  <i className="fa fa-pencil me-2" />
                  <i className="fa fa-trash" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Form>
    </>
  )
}

export default FarmersMachinaryDetailsTable