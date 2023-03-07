import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FarmersLoanTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{}]);
  const [data, setdata] = useState([]);
  const columnsArray = [
    'Loan Name',
    'Bank Name',
    '	Branch Name',
    'Loan Amount',
    'Active Status',
    '	Action'
  ];

  const handleAddRow = () => {
    const item = {
      loanName: '',
      bankName: '',
      branchName: '',
      loanAmount: '',
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
          Add Loan Details
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
                  id="txtLoanName"
                  name="loanName"
                  value={rowData.loanName}
                  onChange={changeHandle}
                  className="form-control"
                >
                  <option >Select</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtBankName"
                  name="bankName"
                  value={rowData.bankName}
                  onChange={changeHandle}
                  className="form-control"
                >
                  <option >Select</option>
                </Form.Select>
              </td>

              <td>
                <Form.Control
                  type="text"
                  id="txtBranchName"
                  name="branchName"
                  value={rowData.branchName}
                  onChange={changeHandle}
                  placeholder="Branch Name"
                  className="form-control"
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numLoanAmount"
                  name="loanAmount"
                  value={rowData.loanAmount}
                  onChange={changeHandle}
                  placeholder="Loan Amount"
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
                <td key={idx}>{data.loanName}</td>
                <td key={idx}>{data.bankName}</td>
                <td key={idx}>{data.branchName}</td>
                <td key={idx}>{data.loanAmount}</td>
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

export default FarmersLoanTable;
