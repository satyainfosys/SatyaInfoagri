import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLandDetailsAction } from 'actions';
import { toast } from 'react-toastify';

export const FarmersLandTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);

  const columnsArray = [
    'Longitude',
    'Latitude',
    'Khasra No',
    'Land Mark',
    'Ownership',
    'Usage',
    'Org/Inorg',
    'Cultivated Land',
    'Land Unit',
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
    longitude: '',
    latitude: '',
    khasraNo: '',
    landMark: '',
    ownerShip: '',
    usage: '',
    croppingType: '',
    landArea: '',
    cultivatedLandUnit: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerLandDetailsReducer = useSelector((state) => state.rootReducer.farmerLandDetailsReducer)
  let farmerLandDetailsData = farmerLandDetailsReducer.farmerLandDetails

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    setRowDataValue(farmerLandDetailsReducer, farmerLandDetailsData);
  }, [farmerLandDetailsData, farmerLandDetailsReducer]);

  const setRowDataValue = (farmerLandDetailsReducer, farmerLandDetailsData) => {
    setRowData(farmerLandDetailsReducer.farmerLandDetails.length > 0 ? farmerLandDetailsData : []);
  };

  const validateFarmerLandDetailsForm = () => {
    let isValid = true;

    if (farmerLandDetailsData && farmerLandDetailsData.length > 0) {
      farmerLandDetailsData.forEach((row, index) => {
        if (!row.longitude || !row.latitude) {
          isValid = false;
          setFormError(true);
        }

      });
    }
    return isValid;
  }

  const handleAddRow = () => {
    if (validateFarmerLandDetailsForm()) {
      farmerLandDetailsData.push(emptyRow);
      dispatch(farmerLandDetailsAction(farmerLandDetailsData))
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerLandDetails = [...rowData];
    farmerLandDetails[index][name] = value;
    farmerLandDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerLandDetailsAction(farmerLandDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerLandCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerLandCode });
  }

  const deleteFarmerLandDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerLandDetailsReducer.farmerLandDetails.findIndex(x => x.encryptedFarmerLandCode == paramsData.encryptedFarmerLandCode);
    farmerLandDetailsReducer.farmerLandDetails.splice(objectIndex, 1)

    var deleteFarmerLandCode = localStorage.getItem("DeleteFarmerLandCodes");

    var deleteFarmerLandDetail = deleteFarmerLandCode ? deleteFarmerLandCode + "," + paramsData.encryptedFarmerLandCode : paramsData.encryptedFarmerLandCode;

    localStorage.setItem("DeleteFarmerLandCodes", deleteFarmerLandDetail);

    toast.success("Land details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerLandDetailsAction(farmerLandDetailsData));

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
            <h4>Are you sure, you want to delete this family member?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerLandDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersLandTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Land Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersLiveStockTableDetailsForm"
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
            {rowData.map((farmerLandDetailsData, index) => (
              <tr>
                <td>
                  <Form.Control
                    type="text"
                    id="textLongitude"
                    name="longitude"
                    value={farmerLandDetailsData.longitude}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Longitude"
                    className="form-control"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="textLatitude"
                    name="latitude"
                    value={farmerLandDetailsData.latitude}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Latitude"
                    className="form-control"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="txtKhasraNo"
                    name="khasraNo"
                    value={farmerLandDetailsData.khasraNo}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Khasra No"
                    className="form-control"
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    id="txtLandMark"
                    name="landMark"
                    value={farmerLandDetailsData.landMark}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Land Mark"
                    className="form-control"
                  />
                </td>

                <td>
                  <Form.Select
                    type="text"
                    id="txtOwnerShip"
                    name="ownerShip"
                    className="form-control"
                    value={farmerLandDetailsData.ownerShip}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value=''>Select</option>
                    <option value='Owned'>Owned</option>
                    <option value='Leased'>Leased</option>
                  </Form.Select>
                </td>

                <td>
                  <Form.Select
                    type="text"
                    id="txtUsage"
                    name="usage"
                    className="form-control"
                    value={farmerLandDetailsData.usage}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value=''>Select</option>
                    <option value='Irrigated'>Irrigated</option>
                    <option value='Unirrigated'>Unirrigated</option>
                  </Form.Select>
                </td>

                <td>
                  <Form.Select
                    type="text"
                    id="txtCroppingType"
                    name="croppingType"
                    value={farmerLandDetailsData.croppingType}
                    onChange={(e) => handleFieldChange(e, index)}
                    className="form-control"
                  >
                    <option value=''>Select</option>
                    <option value="Organic">Organic</option>
                    <option value="Inorganic">Inorganic</option>
                  </Form.Select>
                </td>

                <td>
                  <Form.Control
                    type="num"
                    id="txtLandArea"
                    name="landArea"
                    value={farmerLandDetailsData.landArea}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Cultivated Land"
                  />
                </td>
                <td>
                  <Form.Select
                    type="text"
                    id="txtCultivatedLandUnit"
                    name="cultivatedLandUnit"
                    value={farmerLandDetailsData.cultivatedLandUnit}
                    onChange={(e) => handleFieldChange(e, index)}
                    className="form-control"
                  >
                    <option value=''>Select</option>
                    <option value="Hectare">Hectare</option>
                    <option value="Bhiga">Bhiga</option>
                    <option value="Kila">Kila</option>
                  </Form.Select>
                </td>

                <td>
                  <Form.Select
                    id="txtStatus"
                    name="activeStatus"
                    className="form-control"
                    value={farmerLandDetailsData.activeStatus}
                    onChange={(e) => handleFieldChange(e, index)}
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </Form.Select>
                </td>

                <td>
                  <i className="fa fa-trash" onClick={() => { ModalPreview(farmerLandDetailsData.encryptedFarmerLandCode) }} />
                </td>
              </tr>
            ))
            }

          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default FarmersLandTable;
