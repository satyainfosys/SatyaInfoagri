import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { farmerIrrigationDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';

export const FarmersIrrigrationTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, irrigationOwner: '', irrigationType: '', irrigationSource: '', activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
  },]);
  const columnsArray = [
    'Irrigration Detail',
    'Irrigation Type',
    'Source Of Water',
    'Active Status',
    'Action'
  ];

  const handleAddRow = () => {
    setRowData([...rowData, {
      id: rowData.length + 1, irrigationOwner: '', irrigationType: '', irrigationSource: '', activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
    },]);
  };

  const farmerIrrigationDetailsReducer = useSelector((state) => state.rootReducer.farmerIrrigationDetailsReducer)
  var farmerIrrigationDetailData = farmerIrrigationDetailsReducer.farmerIrrigationDetails;

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerIrrigationDetails = [...rowData];
    farmerIrrigationDetails[index][name] = value;
    farmerIrrigationDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerIrrigationDetailsAction(farmerIrrigationDetails))
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmerIrrigrationTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Irrigration Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersIrrigrationTableDetailsForm"
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
            {rowData.map((farmerIrrigationDetailData, index) => (
              <tr key={index}>
                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtIrrigrationDetails"
                    name="irrigationOwner"
                    value={farmerIrrigationDetailData.irrigationOwner}
                    onChange={(e) => handleFieldChange(e, index)}
                    className="form-control"
                  >
                    <option value=''>Select</option>
                    <option value='OWNED'>OWNED</option>
                    <option value='HIRED'>HIRED</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtIrrigrationDetails"
                    name="irrigationType"
                    value={farmerIrrigationDetailData.irrigationType}
                    onChange={(e) => handleFieldChange(e, index)}
                    className="form-control"
                  >
                    <option value=''>Select</option>
                    <option value='Bore Well'>Bore Well</option>
                    <option value='Canal'>Canal</option>
                    <option value='Disel Engine'>Disel Engine</option>
                    <option value='Drip'>Drip</option>
                    <option value='Flood'>Flood</option>
                    <option value='Jharna'>Jharna</option>
                    <option value='Pump'>Pump</option>
                    <option value='River'>River</option>
                    <option value='Shallow'>Shallow</option>
                    <option value='Sprinkle'>Sprinkle</option>
                    <option value='TubeWell'>TubeWell</option>

                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtSourceOfWater"
                    name="irrigationSource"
                    className="form-control"
                    value={farmerIrrigationDetailData.irrigationSource}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value=''>Select</option>
                    <option value='Bore Well'>Bore Well</option>
                    <option value='Bhada'>Bhada</option>
                    <option value='Canal'>Canal</option>
                    <option value='Electric Motor'>Electric Motor</option>
                    <option value='Ground Water'>Ground Water</option>
                    <option value='Nalkup'>Nalkup</option>
                    <option value='Pump'>Pump</option>
                    <option value='Pond'>Pond</option>
                    <option value='River'>River</option>
                    <option value='Shallow'>Shallow</option>
                    <option value='Tubewell'>Tubewell</option>
                    <option value='Well'>Well</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    id="txtStatus"
                    name="activeStatus"
                    className="form-control"
                    value={farmerIrrigationDetailData.activeStatus}
                    onChange={(e) => handleFieldChange(e, index)}
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
  );
};

export default FarmersIrrigrationTable;
