import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

 export const FarmersLiveStockTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState([]);
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
    const item = {
      cattleType:'',
      noOfCattle: '',
      production:'',
      ratePerLiter:'',
      age:'',
      milkType:'',
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
          
              <tr>
                <td>
                  <Form.Select
                    type="text"
                    id="txtCattleType"
                    value={rowData.cattleType}
                    onChange={changeHandle}
                    name="cattleType"
                    className="form-control"
                  >
                    <option >Select</option>
                  </Form.Select>
                </td>

                <td>
                  <Form.Control
                    type="number"
                    id="numNoOfCattle"
                    name="noOfCattle"
                    value={rowData.noOfCattle}
                    onChange={changeHandle}
                    placeholder="No Of Cattle"
                    className="form-control"
                  /> 
                </td>

                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numProduction"activeStatus
                    name="production"
                    value={rowData.production}
                    onChange={changeHandle}
                    placeholder="Production"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numRatePerLiter"
                    name="ratePerLiter"
                    value={rowData.ratePerLiter}
                    onChange={changeHandle}
                    placeholder="Rate Per Liter"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numAge"
                    name="age"
                    value={rowData.age}
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
                    value={rowData.milkType}
                    onChange={changeHandle}
                  >
                    <option >Select</option>
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
                  <i className="fa fa-pencil pe-1" />
                  <i className="fa fa-trash" />
                </td>
              </tr>
         
          </tbody>
          <thead>
            {rowData.map((item, idx) => (
              <tr key={idx}>
                <td key={idx}>{data.cattleType}</td>
                <td key={idx}>{data.noOfCattle}</td>
                <td key={idx}>{data.production}</td>
                <td key={idx}>{data.ratePerLiter}</td>
                <td key={idx}>{data.age}</td>
                <td key={idx}>{data.milkType}</td>
                <td key={idx}>{data.activeStatus}</td>
                <td key={idx}> </td>
              </tr>
            ))}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FarmersLiveStockTable;
