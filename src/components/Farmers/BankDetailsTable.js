import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { bankDetailsAction } from 'actions';
import { toast } from 'react-toastify';
import axios from 'axios';

export const BankDetailsTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});
  const [bankList, setBankList] = useState([]);

  const columnsArray = [
    'S. No',
    'Bank Name',
    'Bank Address',
    'Branch Name',
    'Account Number',
    'Account Type',
    'IFSC Code',
    'Active Status',
    'Action'
  ];

  const emptyRow = {
    id: rowData.length + 1,
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode"),
    bankCode: 0,
    bankAddress: '',
    bankBranch: '',
    bankAccount: '',
    accountType: '',
    bankIfscCode: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const bankDetailsReducer = useSelector((state) => state.rootReducer.bankDetailsReducer)
  var bankDetailData = bankDetailsReducer.bankDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    getBankDetailList();
    setRowDataValue(bankDetailsReducer, bankDetailData);
  }, [bankDetailData, bankDetailsReducer]);

  const setRowDataValue = (bankDetailsReducer, bankDetailData) => {
    setRowData(bankDetailsReducer.bankDetails.length > 0 ? bankDetailData : []);
  };

  const getBankDetailList = async () => {
    const request = {
      EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
    }

    let response = await axios.post(process.env.REACT_APP_API_URL + '/get-bank-details-list', request, {
      headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    })
    let bankListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(bank => {
          bankListData.push({
            key: bank.bankName,
            value: bank.bankCode
          });
        });
      }
      setBankList(bankListData);
    }
  }

  if (bankDetailData.bankCode &&
    !$('#txtBankName').val()) {
    getBankDetailList();
  }

  const validateBankDetailsForm = () => {

    let isValid = true;

    if (bankDetailData && bankDetailData.length > 0) {
      bankDetailData.forEach((row, index) => {
        if (!row.bankCode || !row.bankAddress || !row.bankBranch || !row.bankAccount || !row.accountType || !row.bankIfscCode) {
          isValid = false;
          setFormError(true);
        }
      });
    }

    if (isValid) {
      setFormError(false)
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

  const ModalPreview = (encryptedFarmerBankId, accountNoToBeDelete) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerBankId, accountNoToBeDelete });
  }

  const deleteBankDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = bankDetailsReducer.bankDetails.findIndex(x => x.bankAccount == paramsData.accountNoToBeDelete);
    bankDetailsReducer.bankDetails.splice(objectIndex, 1);

    var deleteFarmerBankDetailId = localStorage.getItem("DeleteFarmerBankDetailIds");

    var deleteFarmerBankDetailIds = deleteFarmerBankDetailId ? deleteFarmerBankDetailId + "," + paramsData.encryptedFarmerBankId : paramsData.encryptedFarmerBankId;

    if (deleteFarmerBankDetailIds) {
      localStorage.setItem("DeleteFarmerBankDetailIds", deleteFarmerBankDetailIds);
    }

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
        validated={formHasError || (farmerError.bankDetailErr.invalidBankDetail)}
        className="details-form"
        id="AddFarmersBankTableDetailsForm"
      >
        {
          bankDetailData && bankDetailData.length > 0 &&
          <Table striped bordered responsive id="TableList" className="no-pb text-nowrap">
            <thead className='custom-bg-200'>
              <tr>
                {columnsArray.map((column, index) => (
                  <th className="text-left" key={index}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody id="tbody" className="details-form">
              {rowData.map((bankDetailData, index) => (
                <tr key={index}>
                  <td>
                    {index + 1}
                  </td>
                  <td key={index}>
                    <Form.Select id="txtBankName" name="bankCode" value={bankDetailData.bankCode} onChange={(e) => handleFieldChange(e, index)} required>
                      <option value=''>Select Bank</option>
                      {bankList.map((option, index) => (
                        <option key={index} value={option.value}>{option.key}</option>
                      ))}
                    </Form.Select>
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
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="txtbankBranch"
                      name="bankBranch"
                      value={bankDetailData.bankBranch}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Branch Name"
                      className="form-control"
                      maxLength={45}
                      required
                    />
                  </td>
                  <td key={index}>
                    <Form.Control
                      type="text"
                      id="numAccountNumber"
                      name="bankAccount"
                      value={bankDetailData.bankAccount}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Account Number"
                      className="form-control"
                      maxLength={16}
                      onKeyPress={(e) => {
                        const regex = /[0-9]|\./;
                        const key = String.fromCharCode(e.charCode);
                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
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
                      required
                    >
                      <option value=''>Select Account Type</option>
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
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(bankDetailData.encryptedFarmerBankId, bankDetailData.bankAccount) }} />
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
