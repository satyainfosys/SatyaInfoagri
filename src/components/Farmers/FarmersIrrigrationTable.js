import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FarmersIrrigrationTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState([]);
  const columnsArray = [
    'Irrigration Detail',
    'Source Of Water',
    'Active Status',
    '	Action'
  ];

  const handleAddRow = () => {
    const item = {
      irrigrationDetails: '',
      sourceOfWater: '',
      activeStatus: ''
    };
    setRowData([...rowData, item]);
  };
  const changeHandle = e => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

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
            <tr>
              <td>
                <Form.Select
                  type="text"
                  id="txtIrrigrationDetails"
                  name="irrigrationDetails"
                  value={rowData.irrigrationDetails}
                  onChange={changeHandle}
                  className="form-control"
                >
                  <option>Select</option>
                  <option>11</option>
                </Form.Select>
              </td>

              <td>
                <Form.Select
                  type="text"
                  id="txtSourceOfWater"
                  name="sourceOfWater"
                  className="form-control"
                  value={rowData.sourceOfWater}
                  onChange={changeHandle}
                >
                  <option>Select</option>
                  <option>10</option>
                </Form.Select>
              </td>

              <td>
                <Form.Select
                  id="txtStatus"
                  name="activeStatus"
                  className="form-control"
                  value={rowData.activeStatus}
                  onChange={changeHandle}
                >
                  <option >Active</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </td>
              <td>
                <i className="fa fa-pencil me-2" />
                <i className="fa fa-trash" />
              </td>
            </tr>
          </tbody>
          <thead>
            {rowData.map((item, idx) => (
              <tr key={idx}>
                <td key={idx}>{data.irrigrationDetails}</td>
                <td key={idx}>{data.sourceOfWater}</td>
                <td key={idx}>{data.activeStatus}</td>
                
              </tr>
            ))}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FarmersIrrigrationTable;
