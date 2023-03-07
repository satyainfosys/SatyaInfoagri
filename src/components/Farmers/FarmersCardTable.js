import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FarmersCardTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{}]);
  const [data, setdata] = useState([]);
  const columnsArray = ['Card Name', 'Card Number', 'Active Status', '	Action'];

  const handleAddRow = () => {
    const item = {
      cardName: '',
      cardNumber: '',
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
          id="btnAddFarmersCardTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Card Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersCardTableDetailsForm"
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
            
              <tr >
                <td >
                  <Form.Select
                    type="text"
                    id="txtCardName"
                    name="cardName"
                    className="form-control"
                    value={rowData.cardName}
                  onChange={changeHandle}
                  >
                    <option >Select</option>
                    <option >ICC</option>
                  </Form.Select>
                </td>

                <td >
                  <Form.Control
                    type="text"
                    id="numFarmersCardNumber"
                    name="cardNumber"
                    value={rowData.cardNumber}
                  onChange={changeHandle}
                    placeholder="Card Name"
                    min={0}
                    className="form-control"
                  />
                </td>

                <td >
                  <Form.Select
                    id="txtStatus"
                    name="status"
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
             <td  key={idx}>{data.cardName}</td>
            <td  key={idx}>{data.cardNumber}</td>
            <td  key={idx}>{data.activeStatus}</td>
            
             </tr>
            ))}

        </thead>
        </Table>
      </Form>
    </>
  );
};

export default FarmersCardTable;
