import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { farmerCardDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';

export const FarmersCardTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, cardDescription: '', farmerKisanCardNo: '', activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
  },]);
  const columnsArray = ['Card Name', 'Card Number', 'Active Status', '	Action'];

  const handleAddRow = () => {
    setRowData([...rowData, {
      id: rowData.length + 1, cardDescription: '', farmerKisanCardNo: '', activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
    },]);
  };

  const farmerCardDetailsReducer = useSelector((state) => state.rootReducer.farmerCardDetailsReducer)
  var farmerCardDetailData = farmerCardDetailsReducer.farmerCardDetails;

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerCardDetails = [...rowData];
    farmerCardDetails[index][name] = value;
    farmerCardDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerCardDetailsAction(farmerCardDetails))
  }

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
            {rowData.map((farmerCardDetailData, index) => (
              <tr key={index}>
                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtCardName"
                    name="cardDescription"
                    className="form-control"
                    value={farmerCardDetailData.cardDescription}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value='' >Select</option>
                    <option value='KISAN CREDIT CARD'>KISAN CREDIT CARD</option>
                    <option value='ICICI CREDIT CARD'>ICICI CREDIT CARD</option>
                    <option value='SBI CREDIT CARD'>SBI CREDIT CARD</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Control
                    type="text"
                    id="txtFarmersCardNumber"
                    name="farmerKisanCardNo"
                    value={farmerCardDetailData.farmerKisanCardNo}
                    placeholder="Card Name"
                    maxLength={45}
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, index)}
                  />
                </td>

                <td key={index}>
                  <Form.Select
                    id="txtStatus"
                    name="activeStatus"
                    className="form-control"
                    value={farmerCardDetailData.activeStatus}
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
            )
            )}
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default FarmersCardTable;
