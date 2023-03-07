import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FarmersMachinaryDetailsTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState([]);
  const columnsArray = [
    'Equipment Category',
    'Equipment Type',
    'Quantity',
    'Active Status',
    '	Action'
  ];

  const handleAddRow = () => {
    const item = {
      equipmentCategory: '',
      equipmentType: '',
      quantity: '',
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
          id="btnAddFarmersMachinaryTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Machinary Details
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
            <tr>
              <td>
                <Form.Select
                  type="text"
                  id="txtEquipment"
                  name="equipmentCategory"
                  className="form-control"
                  value={rowData.equipmentCategory}
                  onChange={changeHandle}
                >
                  <option>Select</option>
                  <option>Select one</option>
                </Form.Select>
              </td>

              <td>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="txtequipmentType"
                  name="equipmentType"                  
                  value={rowData.equipmentType}
                  onChange={changeHandle}
                  placeholder="Equipment Type"
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="txtQuantity"
                  name="quantity"
                  value={rowData.quantity}
                  onChange={changeHandle}
                  placeholder="Quantity"
                />
              </td>

              <td>
                <Form.Select
                  id="txtStatus"
                  name="activeStatus"
                  className="form-control"
                  value={rowData.activeStatus}
                  onChange={changeHandle}
                >
                  <option>Active</option>
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
                <td key={idx}>{data.equipmentCategory}</td>
                <td key={idx}>{data.equipmentType}</td>
                <td key={idx}>{data.quantity}</td>
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

export default FarmersMachinaryDetailsTable;
