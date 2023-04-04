import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { bankDetailsAction } from 'actions';
import { toast } from 'react-toastify';

export const BankDetailsTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, bankName: '', bankAddress: '', branchName: '', accountNo: '', accountType: '', bankIfscCode: '', activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  },]);
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
    setRowDataValue(bankDetailsReducer, bankDetailData, emptyRow);
  }, [bankDetailData, bankDetailsReducer]);

  const setRowDataValue = (bankDetailsReducer, bankDetailData, emptyRow) => {
    setRowData(bankDetailsReducer.bankDetails.length > 0 ? bankDetailData : [emptyRow]);
  };

  const [bankNameErr, setBankNameErr] = useState({});
  const [accountNoErr, setAccountNoErr] = useState({});
  const [accountTypeErr, setAccountTypeErr] = useState({});
  const [bankIfscCodeErr, setBankIfscCodeErr] = useState({});

  const handleAddRow = () => {
    const newId = rowData.length + 1;
    const newRow = {
      id: newId,
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      encryptedBankCode: bankDetailData.encryptedBankCode ? bankDetailData.encryptedBankCode : '',
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
    let newArray = bankDetailData.push(newRow);
    dispatch(bankDetailsAction(bankDetailData));
  };

  const validateBankDetailsForm = () => {
    const bankNameErr = {};
    const accountNoErr = {};
    const accountTypeErr = {};
    const bankIfscCodeErr = {};

    let isValid = true;

    if (!bankDetailData.bankName) {
      bankNameErr.empty = "Enter bank name";
      isValid = false;
      setFormError(true);
    }

    if (!bankDetailData.accountNo) {
      accountNoErr.empty = "Enter account number";
      isValid = false;
      setFormError(true);
    }

    if (!bankDetailData.accountType) {
      accountTypeErr.empty = "Select account type";
      isValid = false;
      setFormError(true);
    }

    if (!bankDetailData.bankIfscCode) {
      bankIfscCodeErr.empty = "Enter IFSC code";
      isValid = false;
      setFormError(true);
    }

    if (!isValid) {
      setBankNameErr(bankNameErr);
      setAccountNoErr(accountNoErr);
      setAccountTypeErr(accountTypeErr);
      setBankIfscCodeErr(bankIfscCodeErr);
    }

    return isValid;
  }

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
                  {Object.keys(bankNameErr).map((key) => {
                    return <span className="error-message">{bankNameErr[key]}</span>
                  })}
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
                  {Object.keys(accountNoErr).map((key) => {
                    return <span className="error-message">{accountNoErr[key]}</span>
                  })}
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
                  {Object.keys(accountTypeErr).map((key) => {
                    return <span className="error-message">{accountTypeErr[key]}</span>
                  })}
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
                  {Object.keys(bankIfscCodeErr).map((key) => {
                    return <span className="error-message">{bankIfscCodeErr[key]}</span>
                  })}
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
      </Form>
    </>
  );
};

export default BankDetailsTable;
