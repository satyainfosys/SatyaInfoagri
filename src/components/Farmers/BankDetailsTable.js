import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const BankDetailsTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState([]);
  const columnsArray = [
    'Bank Name',
    'Bank Address',
    'Account Number',
    'Account Type',
    'IFSC Code',
    'Active Status',
    'Action'
  ];

  const handleAddRow = () => {
    const item = {
      bankName: '',
      bankAddress: '',
      accountNumber: '',
      accountType: '',
      ifscCode: '',
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
          id="btnAddBankNameTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Bank Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersBankTableDetailsForm"
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
                <Form.Control
                  type="text"
                  id="txtBankName"
                  name="bankName"
                  value={rowData.bankName}
                  onChange={changeHandle}
                  placeholder="Bank Name"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  id="txtBankAddress"
                  name="bankAddress"
                  value={rowData.bankAddress}
                  onChange={changeHandle}
                  placeholder="Bank Address"
                  className="form-control"
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numAccountNumber"
                  name="accountNumber"
                  value={rowData.accountNumber}
                  onChange={changeHandle}
                  placeholder="Account Number"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtAccountType"
                  name="accountType"
                  value={rowData.accountType}
                  onChange={changeHandle}
                  className="form-control"
                >
                  <option>Select</option>
                  <option>Saving</option>
                </Form.Select>
              </td>

              <td>
                <Form.Control
                  type="number"
                  id="numIfscCode"
                  name="ifscCode"
                  value={rowData.ifscCode}
                  onChange={changeHandle}
                  placeholder="IFSC Code"
                  className="form-control"
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
                  <option>Suspended</option>
                </Form.Select>
              </td>
              
              <td>
                <i className="fa fa-pencil me-1" />
                <i className="fa fa-trash " />
              </td>
            </tr>
          </tbody>
          <thead>
            {rowData.map((item, idx) => (
              <tr key={idx}>
                <td key={idx}>{data.bankname}</td>
                <td key={idx}>{data.bankaddress}</td>
                <td key={idx}>{data.accountnumber}</td>
                <td key={idx}>{data.accounttype}</td>
                <td key={idx}>{data.ifsccode}</td>
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

export default BankDetailsTable;
