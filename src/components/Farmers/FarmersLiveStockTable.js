import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLiveStockCattleDetailsAction, formChangedAction } from '../../actions/index';
import { toast } from 'react-toastify';
import axios from 'axios';
import EnlargableTextbox from 'components/common/EnlargableTextbox';

export const FarmersLiveStockTable = () => {

  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [cattleTypeList, setCattleTypeList] = useState([]);

  const columnsArray = [
    'S.No',
    'Cattle Type',
    'No Of Cattle',
    'Production',
    'Rate Per Liter',
    'Age',
    'Milk Type',
    'Active Status',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});

  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    cattleCode: '',
    noOfCattle: '',
    production: '',
    rate: '',
    cattleAge: '',
    milkType: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerLiveStockCattleDetailsReducer = useSelector((state) => state.rootReducer.farmerLiveStockCattleDetailsReducer)
  var farmerLiveStockCattleData = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  useEffect(() => {
    if (cattleTypeList.length <= 0) {
      getCattleTypeList();
    }

    setRowDataValue(farmerLiveStockCattleDetailsReducer, farmerLiveStockCattleData);
  }, [farmerLiveStockCattleData, farmerLiveStockCattleDetailsReducer]);

  const setRowDataValue = (farmerLiveStockCattleDetailsReducer, farmerLiveStockCattleData) => {
    setRowData(farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.length > 0 ? farmerLiveStockCattleData : []);
  };

  const getCattleTypeList = async () => {
    let response = await axios.get(process.env.REACT_APP_API_URL + "/cattle-type-list")
    let cattleListData = [];

    if (response.data.status == 200) {
      if (response.data && response.data.data.length > 0) {
        response.data.data.forEach(cattleTypes => {
          cattleListData.push({
            key: cattleTypes.cattleName,
            value: cattleTypes.cattleCode
          })
        })
        setCattleTypeList(cattleListData);
      }
    }
    else {
      setCattleTypeList([]);
    }
  }

  if (farmerLiveStockCattleData.cattleCode &&
    !$('#txtCattleCode').val()) {
    getCattleTypeList();
  }

  const validateFarmersLiveStockCattleDetailForm = () => {
    let isValid = true;

    if (farmerLiveStockCattleData && farmerLiveStockCattleData.length > 0) {
      farmerLiveStockCattleData.forEach((row, index) => {
        if (!row.cattleCode || !row.noOfCattle) {
          isValid = false;
          setFormError(true);
        }
      });
    }

    if (isValid) {
      setFormError(false);
    }

    return isValid;
  }

  const handleAddRow = () => {
    if (validateFarmersLiveStockCattleDetailForm()) {
      farmerLiveStockCattleData.unshift(emptyRow);
      dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleData));
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerLiveStockCattleDetails = [...rowData];
    farmerLiveStockCattleDetails[index][name] = value;
    farmerLiveStockCattleDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleDetails))

    if (farmerLiveStockCattleDetails[index].encryptedFarmerCattleCode) {
      dispatch(formChangedAction({
        ...formChangedData,
        cattleDetailUpdate: true
      }))
    } else {
      dispatch(formChangedAction({
        ...formChangedData,
        cattleDetailAdd: true
      }))
    }
  }

  const ModalPreview = (encryptedFarmerCattleCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerCattleCode });
  }

  const deleteFarmerCattleLiveStockDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.findIndex(x => x.encryptedFarmerCattleCode == paramsData.encryptedFarmerCattleCode);
    farmerLiveStockCattleDetailsReducer.farmerLiveStockCattleDetails.splice(objectIndex, 1)

    var deleteFarmerLiveStockDetailCode = localStorage.getItem("DeleteFarmerLiveStockCattleDetailIds");

    if (paramsData.encryptedFarmerCattleCode) {
      var deleteFarmerCattleLiveStockDetail = deleteFarmerLiveStockDetailCode ? deleteFarmerLiveStockDetailCode + "," + paramsData.encryptedFarmerCattleCode : paramsData.encryptedFarmerCattleCode;
      localStorage.setItem("DeleteFarmerLiveStockCattleDetailIds", deleteFarmerCattleLiveStockDetail);
    }

    toast.success("Cattle details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLiveStockCattleDetailsAction(farmerLiveStockCattleData));

    dispatch(formChangedAction({
      ...formChangedData,
      cattleDetailDelete: true
    }))

    setModalShow(false);
  }

  const handleKeyPress = (e) => {
    const regex = /[0-9]|\./;
    const key = String.fromCharCode(e.charCode);
    if (!regex.test(key)) {
      e.preventDefault();
    }
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
            <h4>Are you sure, you want to delete this live stock detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerCattleLiveStockDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
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
        validated={formHasError || (farmerError.cattleStockErr && farmerError.cattleStockErr.invalidCattleDetail)}
        className="details-form"
        id="AddFarmersLiveStockTableDetailsForm"
      >
        {
          farmerLiveStockCattleData && farmerLiveStockCattleData.length > 0 &&
          <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table many-column-table">
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
              {rowData.map((farmerLiveStockCattleData, index) => (
                <tr key={index}>
                  <td>
                    {index + 1}
                  </td>
                  <td key={index}>
                    <Form.Select id="txtCattleCode" name="cattleCode" value={farmerLiveStockCattleData.cattleCode} onChange={(e) => handleFieldChange(e, index)} required>
                      <option value=''>Select Cattle</option>
                      {cattleTypeList.map((option, index) => (
                        <option key={index} value={option.value}>{option.key}</option>
                      ))}
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <EnlargableTextbox
                      id="numNoOfCattle"
                      name="noOfCattle"
                      value={farmerLiveStockCattleData.noOfCattle}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="No Of Cattle"
                      className="form-control"
                      onKeyPress={handleKeyPress}
                      maxLength={5}
                      required={true}
                    />
                  </td>

                  <td key={index}>
                    <EnlargableTextbox
                      id="numProduction"
                      name="production"
                      value={farmerLiveStockCattleData.production}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Production"
                      onKeyPress={handleKeyPress}
                      maxLength={5}
                      className="form-control"
                    />
                  </td>

                  <td key={index}>
                    <EnlargableTextbox
                      id="numRatePerLiter"
                      name="rate"
                      value={farmerLiveStockCattleData.rate}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Rate Per Liter"
                      onKeyPress={handleKeyPress}
                      maxLength={7}
                    />
                  </td>

                  <td key={index}>
                    <EnlargableTextbox
                      id="numAge"
                      name="cattleAge"
                      value={farmerLiveStockCattleData.cattleAge}
                      onChange={(e) => handleFieldChange(e, index)}
                      placeholder="Age"
                      onKeyPress={handleKeyPress}
                      maxLength={2}
                    />
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtMilkType"
                      name="milkType"
                      className="form-control"
                      value={farmerLiveStockCattleData.milkType}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      value={farmerLiveStockCattleData.activeStatus}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </td>

                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerLiveStockCattleData.encryptedFarmerCattleCode) }} />
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

export default FarmersLiveStockTable;
