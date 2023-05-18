import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { farmerIrrigationDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export const FarmersIrrigrationTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const columnsArray = [
    'S.No',
    'Irrigation Detail',
    'Irrigation Type',
    'Source Of Water',
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
    irrigationOwner: '',
    irrigationType: '',
    irrigationSource: '',
    activeStatus: '',
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LoginUserName")
  }

  const farmerIrrigationDetailsReducer = useSelector((state) => state.rootReducer.farmerIrrigationDetailsReducer)
  var farmerIrrigationDetailData = farmerIrrigationDetailsReducer.farmerIrrigationDetails;

  const farmerDetailsErrorReducer = useSelector((state) => state.rootReducer.farmerDetailsErrorReducer)
  const farmerError = farmerDetailsErrorReducer.farmerDetailsError;

  useEffect(() => {
    setRowDataValue(farmerIrrigationDetailsReducer, farmerIrrigationDetailData);
  }, [farmerIrrigationDetailData, farmerIrrigationDetailsReducer]);

  const setRowDataValue = (farmerIrrigationDetailsReducer, farmerIrrigationDetailData) => {
    setRowData(farmerIrrigationDetailsReducer.farmerIrrigationDetails.length > 0 ? farmerIrrigationDetailData : []);
  };

  const validateFarmerIrrigationForm = () => {
    let isValid = true;

    if (farmerIrrigationDetailData && farmerIrrigationDetailData.length > 0) {
      farmerIrrigationDetailData.forEach((row, index) => {
        if (!row.irrigationOwner || !row.irrigationType || !row.irrigationSource) {
          isValid = false;
          setFormError(true);
        }
      });
    }
    return isValid;
  }

  const handleAddRow = () => {
    if (validateFarmerIrrigationForm()) {
      farmerIrrigationDetailData.unshift(emptyRow);
      dispatch(farmerIrrigationDetailsAction(farmerIrrigationDetailData));
    }
  };

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerIrrigationDetails = [...rowData];
    farmerIrrigationDetails[index][name] = value;
    farmerIrrigationDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerIrrigationDetailsAction(farmerIrrigationDetails))
    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerIrrigationCode) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerIrrigationCode });
  }

  const deleteFarmerIrrigationDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerIrrigationDetailsReducer.farmerIrrigationDetails.findIndex(x => x.encryptedFarmerIrrigationCode == paramsData.encryptedFarmerIrrigationCode);
    farmerIrrigationDetailsReducer.farmerIrrigationDetails.splice(objectIndex, 1)

    var deleteFarmerIrrigationCode = localStorage.getItem("DeleteFarmerIrrigationCodes");

    if (paramsData.encryptedFarmerIrrigationCode) {
      var deleteFarmerIrrigationDetail = deleteFarmerIrrigationCode ? deleteFarmerIrrigationCode + "," + paramsData.encryptedFarmerIrrigationCode : paramsData.encryptedFarmerIrrigationCode;
      localStorage.setItem("DeleteFarmerIrrigationCodes", deleteFarmerIrrigationDetail);
    }

    toast.success("Irrigation details deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerIrrigationDetailsAction(farmerIrrigationDetailData));

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
            <h4>Are you sure, you want to delete this irrigation detail?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteFarmerIrrigationDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmerIrrigationTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Irrigation Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError || (farmerError.irrigationDetailErr.invalidIrrigationDetail)}
        className="details-form"
        id="AddFarmersIrrigationTableDetailsForm"
      >
        {
          farmerIrrigationDetailData && farmerIrrigationDetailData.length > 0 &&
          <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
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
              {rowData.map((farmerIrrigationDetailData, index) => (
                <tr key={index}>
                  <td>
                    {index + 1}
                  </td>
                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtIrrigationOwner"
                      name="irrigationOwner"
                      value={farmerIrrigationDetailData.irrigationOwner}
                      onChange={(e) => handleFieldChange(e, index)}
                      className="form-control"
                      required
                    >
                      <option value=''>Select</option>
                      <option value='OWNED'>OWNED</option>
                      <option value='HIRED'>HIRED</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtIrrigationDetails"
                      name="irrigationType"
                      value={farmerIrrigationDetailData.irrigationType}
                      onChange={(e) => handleFieldChange(e, index)}
                      className="form-control"
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Bore Well'>Bore Well</option>
                      <option value='Canal'>Canal</option>
                      <option value='Disel Engine'>Disel Engine</option>
                      <option value='Drip'>Drip</option>
                      <option value='Flood'>Flood</option>
                      <option value='Jharna'>Jharna</option>
                      <option value='Pump'>Pump</option>
                      <option value='River'>River</option>
                      <option value='Shallow'>Shallow</option>
                      <option value='Sprinkle'>Sprinkle</option>
                      <option value='TubeWell'>TubeWell</option>

                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      type="text"
                      id="txtSourceOfWater"
                      name="irrigationSource"
                      className="form-control"
                      value={farmerIrrigationDetailData.irrigationSource}
                      onChange={(e) => handleFieldChange(e, index)}
                      required
                    >
                      <option value=''>Select</option>
                      <option value='Bore Well'>Bore Well</option>
                      <option value='Bhada'>Bhada</option>
                      <option value='Canal'>Canal</option>
                      <option value='Electric Motor'>Electric Motor</option>
                      <option value='Ground Water'>Ground Water</option>
                      <option value='Nalkup'>Nalkup</option>
                      <option value='Pump'>Pump</option>
                      <option value='Pond'>Pond</option>
                      <option value='River'>River</option>
                      <option value='Shallow'>Shallow</option>
                      <option value='Tubewell'>Tubewell</option>
                      <option value='Well'>Well</option>
                    </Form.Select>
                  </td>

                  <td key={index}>
                    <Form.Select
                      id="txtStatus"
                      name="activeStatus"
                      className="form-control"
                      value={farmerIrrigationDetailData.activeStatus}
                      onChange={(e) => handleFieldChange(e, index)}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </td>
                  <td>
                    <i className="fa fa-trash fa-2x" onClick={() => { ModalPreview(farmerIrrigationDetailData.encryptedFarmerIrrigationCode) }} />
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

export default FarmersIrrigrationTable;
