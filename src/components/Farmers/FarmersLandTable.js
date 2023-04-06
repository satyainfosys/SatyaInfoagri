import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { farmerLandDetailsAction } from 'actions';

export const FarmersLandTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1,
    longitude: '',
    latitude: '',
    khasraNo: '',
    landMark: '',
    ownerShip: '',
    usages: '',
    orgInorg: '',
    cultivatedLand: '',
    activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }]);

  const columnsArray = [
    'Longitude',
    'Latitude',
    'Khasra No',
    'Land Mark',
    'Ownership',
    'Usages',
    'Org/Inorg',
    'Cultivated Land',
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
    usages: '',
    orgInorg: '',
    cultivatedLand: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerLandDetailsReducer = useSelector((state) => state.rootReducer.farmerLandDetailsReducer)
  let farmerLandDetailsData = farmerLandDetailsReducer.farmerLandDetails

  useEffect(() => {
    setRowDataValue(farmerLandDetailsReducer, farmerLandDetailsData, emptyRow);
  }, [farmerLandDetailsData, farmerLandDetailsReducer]);

  const setRowDataValue = (farmerLandDetailsReducer, farmerLandDetailsData, emptyRow) => {
    setRowData(farmerLandDetailsReducer.farmerLandDetails.length > 0 ? farmerLandDetailsData : [emptyRow]);
  };

  const handleAddRow = () => {
    farmerLandDetailsData.push(emptyRow);
    dispatch(farmerLandDetailsAction(farmerLandDetailsData))
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
                    id="txtUsages"
                    name="usages"
                    className="form-control"
                    value={farmerLandDetailsData.usages}
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
                    id="txtOrgInorg"
                    name="orgInorg"
                    value={farmerLandDetailsData.orgInorg}
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
                    type="text"
                    id="txtCultivatedLand"
                    name="cultivatedLand"
                    value={farmerLandDetailsData.cultivatedLand}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Cultivated Land"
                  />
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
