import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerMachineryDetailsAction } from '../../actions/index';
import { toast } from 'react-toastify';

export const FarmersMachinaryDetailsTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);

  const columnsArray = [
    'S.No',
    'Equipment Category',
    'Equipment Type',
    'Quantity',
    'Active Status',
    'Action'
  ];

  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});

  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '',
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode") ? localStorage.getItem("EncryptedClientCode") : '',
    machineryCategory: '',
    machineryType: '',
    machineryQty: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerMachineryDetailsReducer = useSelector((state) => state.rootReducer.farmerMachineryDetailsReducer)
  var farmerMachineryDetailsData = farmerMachineryDetailsReducer.farmerMachineryDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    setRowDataValue(farmerMachineryDetailsReducer, farmerMachineryDetailsData);
  }, [farmerMachineryDetailsData, farmerMachineryDetailsReducer]);

  const setRowDataValue = (farmerMachineryDetailsReducer, farmerMachineryDetailsData) => {
    setRowData(farmerMachineryDetailsReducer.farmerMachineryDetails.length > 0 ? farmerMachineryDetailsData : []);
  };

  const validateFarmerMachineryDetailsForm = () => {
    let isValid = true;

    if (farmerMachineryDetailsData && farmerMachineryDetailsData.length > 0) {
      farmerMachineryDetailsData.forEach((row, index) => {
        if (!row.machineryCategory || !row.machineryType || !row.machineryQty) {
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

    if (validateFarmerMachineryDetailsForm()) {
      farmerMachineryDetailsData.push(emptyRow);
      dispatch(farmerMachineryDetailsAction(farmerMachineryDetailsData));
    }
  };

  const handleFieldChange = (e, idx) => {
    const { name, value } = e.target;
    var farmerMachineryDetails = [...rowData];
    farmerMachineryDetails[idx][name] = value;
    farmerMachineryDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerMachineryDetailsAction(farmerMachineryDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerMachineryCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerMachineryCode });
  }

  const deleteFarmerMachineryDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerMachineryDetailsReducer.farmerMachineryDetails.findIndex(x => x.encryptedFarmerMachineryCode == paramsData.encryptedFarmerMachineryCode);
    farmerMachineryDetailsReducer.farmerMachineryDetails.splice(objectIndex, 1)

    var deleteFarmerMachineryDetailCode = localStorage.getItem("DeleteFarmerMachineryDetailCodes");

    var deleteFarmerMachineryDetails = deleteFarmerMachineryDetailCode ? deleteFarmerMachineryDetailCode + "," + paramsData.encryptedFarmerMachineryCode : paramsData.encryptedFarmerMachineryCode;

    if (deleteFarmerMachineryDetails) {
      localStorage.setItem("DeleteFarmerMachineryDetailCodes", deleteFarmerMachineryDetails);
    }

    toast.success("Equipment details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerMachineryDetailsAction(farmerMachineryDetailsData));

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
            <h4>Are you sure, you want to delete this livestock cattle detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerMachineryDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button id="btnAddFarmersMachinaryTable" className="mb-2" onClick={handleAddRow}>
          Add Machinery Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError || (farmerError.machineryDetailErr && farmerError.machineryDetailErr.invalidMachineryDetail)}
        className="details-form"
        id="AddFarmersMachinaryTableDetailsForm"
      >
        {
          farmerMachineryDetailsData && farmerMachineryDetailsData.length > 0 &&
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
              {rowData.map((farmerMachineryDetailsData, idx) => (
                <tr key={idx}>
                  <td>
                    {idx + 1}
                  </td>
                  <td key={idx}>
                    <Form.Select
                      type="text"
                      id="txtEquipment"
                      name="machineryCategory"
                      className="form-control"
                      onChange={(e) => handleFieldChange(e, idx)}
                      value={farmerMachineryDetailsData.machineryCategory}
                      required
                    >
                      <option value=''>Select</option>
                      <option value="HIRED">HIRED</option>
                      <option value="OWNED">OWNED</option>
                    </Form.Select>
                  </td>

                  <td key={idx}>
                    <Form.Select
                      type="text"
                      id="txtequipmentType"
                      name="machineryType"
                      value={farmerMachineryDetailsData.machineryType}
                      placeholder="Equipment Type"
                      className="form-control"
                      onChange={(e) => handleFieldChange(e, idx)}
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Tractor'>Tractor</option>
                      <option value='Leveller'>Leveller</option>
                      <option value='Biogas'>Biogas</option>
                      <option value='Vermi Compost'>Vermi Compost</option>
                      <option value='Polyhouse'>Polyhouse</option>
                      <option value='NetHouse'>NetHouse</option>
                      <option value='Solar Light'>Solar Light</option>
                      <option value='Spray Pump'>Spray Pump</option>
                      <option value='Vegetable Crates'>Vegetable Crates</option>
                      <option value='Tillerweeder'>Tillerweeder</option>
                      <option value='Irregation Pump'>Irregation Pump</option>
                      <option value='Weeder'>Weeder</option>
                      <option value='Tiller'>Tiller</option>
                    </Form.Select>
                  </td>

                  <td key={idx}>
                    <Form.Control
                      type="text"
                      id="txtQuantity"
                      name="machineryQty"
                      value={farmerMachineryDetailsData.machineryQty}
                      placeholder="Quantity"
                      onChange={(e) => handleFieldChange(e, idx)}
                      onKeyPress={(e) => {
                        const regex = /[0-9]|\./;
                        const key = String.fromCharCode(e.charCode);
                        if (!regex.test(key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={3}
                      required
                    />
                  </td>

                  <td key={idx}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      onChange={(e) => handleFieldChange(e, idx)}
                      value={farmerMachineryDetailsData.activeStatus}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </td>
                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerMachineryDetailsData.encryptedFarmerMachineryCode) }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </Form>
    </>
  )
}

export default FarmersMachinaryDetailsTable