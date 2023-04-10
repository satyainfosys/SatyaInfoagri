import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { bankDetailsAction } from 'actions';
import { toast } from 'react-toastify';

export const BankDetailsTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const columnsArray = [
    'Bank Name',
    'Bank Address',
    'Branch Name',
    'Account Number',
    'Account Type',
    'IFSC Code',
    'Active Status',
    'Action'
  ];
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const emptyRow = {
    id: rowData.length + 1,
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    bankName: '',
    bankAddress: '',
    branchName: '',
    accountNo: '',
    accountType: '',
    bankIfscCode: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const bankDetailsReducer = useSelector((state) => state.rootReducer.bankDetailsReducer)
  var bankDetailData = bankDetailsReducer.bankDetails;

  useEffect(() => {
    setRowDataValue(bankDetailsReducer, bankDetailData);
  }, [bankDetailData, bankDetailsReducer]);

  const setRowDataValue = (bankDetailsReducer, bankDetailData) => {
    setRowData(bankDetailsReducer.bankDetails.length > 0 ? bankDetailData : []);
  };

  const validateBankDetailsForm = () => {

    let isValid = true;

    if (bankDetailData && bankDetailData.length > 0) {
      bankDetailData.forEach((row, index) => {
        if (!row.bankName || row.bankAddress == 0 || !row.branchName || !row.accountNo || !row.accountType || !row.bankIfscCode) {
          isValid = false;
          setFormError(true);
        }
      });
    }
    return isValid;
  }

  const handleAddRow = () => {
    let formValid = validateBankDetailsForm()
    if (formValid) {
      bankDetailData.push(emptyRow);
      dispatch(bankDetailsAction(bankDetailData));
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var bankDetails = [...rowData];
    bankDetails[index][name] = value;
    bankDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(bankDetailsAction(bankDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedBankCode, accountNoToBeDelete) => {
    setModalShow(true);
    setParamsData({ encryptedBankCode, accountNoToBeDelete });
  }

  const deleteBankDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = bankDetailsReducer.bankDetails.findIndex(x => x.accountNo == paramsData.accountNoToBeDelete);
    bankDetailsReducer.bankDetails.splice(objectIndex, 1);

    var deleteBankDetailCode = localStorage.getItem("DeleteBankDetailCodes");

    var deleteBankDetailCodes = deleteBankDetailCode ? deleteBankDetailCode + "," + paramsData.encryptedBankCode : paramsData.encryptedBankCode;

    localStorage.setItem("DeleteBankDetailCodes", deleteBankDetailCodes);

    toast.success("Bank details deleted successfully", {
      theme: 'colored'
    });

    dispatch(bankDetailsAction(bankDetailData));

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);

    setModalShow(false);
  }

  return (
    <>
      {modalShow && paramsData &&
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure, you want to delete this bank detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteBankDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
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
        {
          bankDetailData && bankDetailData.length > 0 &&
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
              {rowData.map((bankDetailData, index) => (
                <tr key={index}>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtBankName"
                      name="bankName"
                      value={bankDetailData.bankName}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Bank Name"
                      className="form-control"
                      maxLength={40}
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtBankAddress"
                      name="bankAddress"
                      value={bankDetailData.bankAddress}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Bank Address"
                      className="form-control"
                      maxLength={60}
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtBranchName"
                      name="branchName"
                      value={bankDetailData.branchName}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Branch name"
                      className="form-control"
                      maxLength={45}
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="numAccountNumber"
                      name="accountNo"
                      value={bankDetailData.accountNo}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Account Number"
                      className="form-control"
                      maxLength={40}
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtAccountType"
                      name="accountType"
                      value={bankDetailData.accountType}
                      onChange={(e) => handleFieldChange(e, index)}
                      className="form-control"
                    >
                      <option value=''>Select account type</option>
                      <option value='Saving'>Saving</option>
                      <option value='Current'>Current</option>
                    </Form.Select>
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtBankIfscCode"
                      name="bankIfscCode"
                      value={bankDetailData.bankIfscCode}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="IFSC Code"
                      className="form-control"
                      maxLength={20}
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      value={bankDetailData.activeStatus}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value='Active'>Active</option>
                      <option value='Suspended'>Suspended</option>
                    </Form.Select>
                  </td>
                  <td>
                    <i className="fa fa-trash " onClick={() => { ModalPreview(bankDetailData.encryptedBankCode, bankDetailData.accountNo) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </Form>
    </>
  );
};

export default BankDetailsTable;
