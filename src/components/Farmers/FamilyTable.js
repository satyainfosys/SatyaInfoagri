import { farmerFamilyDetailsAction } from 'actions';
import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export const FamilyTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, familyMemberName: '', memberAge: 0, memberSex: '', farmerMemberRelation: '', memberEducation: '', activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LooginUserName")
  },]);
  const [familyAPICalled1, setFamilyAPICalled1] = useState(false);
  const [familyMemberNameErr, setFamilyMemberNameErr] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [paramsData, setParamsData] = useState({});

  const dispatch = useDispatch();
  const emptyRow = {
    id: rowData.length + 1,
    encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : '', 
    encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
    familyMemberName: '',
    memberAge: 0,
    memberSex: '',
    farmerMemberRelation: '',
    memberEducation: '',
    activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
    addUser: localStorage.getItem("LoginUserName"),
    modifyUser: localStorage.getItem("LooginUserName")
  };

  let farmerFamilyDetailsReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailsReducer)
  let familyDetailData = farmerFamilyDetailsReducer.farmerFamilyDetails;

  useEffect(() => {
    setRowDataValue(farmerFamilyDetailsReducer, familyDetailData, emptyRow);
  }, [familyDetailData, farmerFamilyDetailsReducer]);

  const setRowDataValue = (farmerFamilyDetailsReducer, familyDetailData, emptyRow) => {
    setRowData(farmerFamilyDetailsReducer.farmerFamilyDetails.length > 0 ? familyDetailData : [emptyRow]);
  };

  const columnsArray = [
    'Name',
    'Age',
    'Sex',
    'Relation',
    'Education',
    'Action'
  ];

  const handleAddRow = () => {
    const newId = rowData.length + 1;
    const newRow = {
      id: newId,
      encryptedFarmerCode: localStorage.getItem("EncryptedFarmerCode") ? localStorage.getItem("EncryptedFarmerCode") : "",
      encryptedFarmerFamilyCode: familyDetailData.encryptedFarmerFamilyCode ? familyDetailData.encryptedFarmerFamilyCode : "",
      familyMemberName: '',
      memberAge: 0,
      memberSex: '',
      farmerMemberRelation: '',
      memberEducation: '',
      activeStatus: '',
      encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
      encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode"),
      addUser: localStorage.getItem("LoginUserName"),
      modifyUser: localStorage.getItem("LoginUserName")
    };
    let newArray = familyDetailData.push(newRow);
    dispatch(farmerFamilyDetailsAction(familyDetailData));
  };

  // const validateFarmerFamilyDetailsForm = () => {
  //   const familyMemberNameErr = {};

  //   let isValid = true;

  //   if (!familyDetailData.familyMemberName) {
  //     familyMemberNameErr.empty = "Enter name";
  //     isValid = false;
  //     setFormError(true);
  //   }

  //   if (!isValid) {
  //     setFamilyMemberNameErr(familyMemberNameErr);
  //   }

  //   return isValid;
  // }

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerFamilyDetails = [...rowData];
    farmerFamilyDetails[index][name] = value;
    farmerFamilyDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerFamilyDetailsAction(farmerFamilyDetails))
    // const familyDetailsChanged = {
    //   farmerDetailsChanged: true
    // }
    // dispatch(farmerFamilyDetailChangedAction(familyDetailsChanged))

    if ($("#btnSave").attr('disabled'))
      $("#btnSave").attr('disabled', false);
  }

  const ModalPreview = (encryptedFarmerFamilyCode, familyMemberToDelete) => {
    setModalShow(true);
    setParamsData({ encryptedFarmerFamilyCode, familyMemberToDelete });
  }

  const deleteFamilyDetails = () => {
    if (!paramsData)
      return false;

    var objectIndex = farmerFamilyDetailsReducer.farmerFamilyDetails.findIndex(x => x.familyMemberName == paramsData.familyMemberToDelete);
    farmerFamilyDetailsReducer.farmerFamilyDetails.splice(objectIndex, 1)

    var deleteFarmerFamilyCode = localStorage.getItem("DeleteFarmerFamilyCodes");

    var deleteFarmerDetail = deleteFarmerFamilyCode ? deleteFarmerFamilyCode + "," + paramsData.encryptedFarmerFamilyCode : paramsData.encryptedFarmerFamilyCode;

    localStorage.setItem("DeleteFarmerFamilyCodes", deleteFarmerDetail);

    toast.success("Family member deleted successfully", {
      theme: 'colored'
    });

    dispatch(farmerFamilyDetailsAction(familyDetailData));

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
            <Button variant="danger" onClick={() => deleteFamilyDetails()}>Delete</Button>
          </Modal.Footer>
        </Modal>
      }

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersFamilyTable"
          className="mb-2"
          onClick={handleAddRow}
        >
          Add Family Details
        </Button>
      </div>

      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFarmersFamilyTableDetailsForm"
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
            {rowData.map((familyDetailData, index) => (
              <tr key={index}>
                <td key={index}>
                  <Form.Control
                    type="text"
                    id="txtFamilyMemberName"
                    name="familyMemberName"
                    value={familyDetailData.familyMemberName}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Name"
                    className="form-control"
                    maxLength={30}
                    required
                  />
                  {Object.keys(familyMemberNameErr).map((key) => {
                    return <span className="error-message">{familyMemberNameErr[key]}</span>
                  })}
                </td>

                <td key={index}>
                  <Form.Control
                    type="number"
                    min={0}
                    id="numAge"
                    name="memberAge"
                    value={familyDetailData.memberAge}
                    onChange={(e) => handleFieldChange(e, index)}
                    placeholder="Age"
                    className="form-control"
                  />
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtSex"
                    name="memberSex"
                    onChange={(e) => handleFieldChange(e, index)}
                    value={familyDetailData.memberSex}
                    className="form-control"
                  >
                    <option value=''>Select</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Others'>Others</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtRelation"
                    name="farmerMemberRelation"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, index)}
                    value={familyDetailData.farmerMemberRelation}
                  >
                    <option value=''>Select relation</option>
                    <option value='Father'>Father</option>
                    <option value='Mother'>Mother</option>
                  </Form.Select>
                </td>

                <td key={index}>
                  <Form.Select
                    type="text"
                    id="txtEducation"
                    name="memberEducation"
                    className="form-control"
                    onChange={(e) => handleFieldChange(e, index)}
                    value={familyDetailData.memberEducation}
                  >
                    <option value=''>Select education</option>
                    <option value="Primary School">Primary School</option>
                    <option value="High School">High School</option>
                    <option value="Inter">Inter</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="Illiterate">Illiterate</option>
                    <option value="Doctrate">Doctrate</option>
                  </Form.Select>
                </td>
                <td>
                  {/* <i className="fa fa-pencil me-2" /> */}
                  <i className="fa fa-trash" onClick={() => { ModalPreview(familyDetailData.encryptedFarmerFamilyCode, familyDetailData.familyMemberName) }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Form>
    </>
  );
};

export default FamilyTable;
