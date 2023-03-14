import { farmerFamilyDetailsAction, farmerFamilyDetailsListAction } from 'actions';
import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

export const FamilyTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([{
    id: 1, familyMemberName: '', memberAge: 0, memberSex: '', farmerMemberRelation: '', memberEducation: '', activeStatus: '',
    encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
  },]);
  const columnsArray = [
    'Name',
    'Age',
    'Sex',
    'Relation',
    'Education',
    'Action'
  ];
  const [familyMemberNameErr, setFamilyMemberNameErr] = useState({});

  const handleAddRow = () => {
    setRowData([...rowData, {
      id: rowData.length + 1, familyMemberName: '', memberAge: 0, memberSex: '', farmerMemberRelation: '', memberEducation: '',
      activeStatus: '', encryptedClientCode: localStorage.getItem("EncryptedClientCode"), addUser: localStorage.getItem("LoginUserName")
    },]);
  };

  const farmerFamilyDetailsReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailsReducer)
  var familyDetailData = farmerFamilyDetailsReducer.farmerFamilyDetails;


  const validateFarmerFamilyDetailsForm = () => {
    const familyMemberNameErr = {};

    let isValid = true;

    if (!familyDetailData.familyMemberName) {
      familyMemberNameErr.empty = "Enter name";
      isValid = false;
      setFormError(true);
    }

    if (!isValid) {
      setFamilyMemberNameErr(familyMemberNameErr);
    }

    return isValid;
  }

  const handleFieldChange = (e, index) => {
    const { name, value } = e.target;
    var farmerFamilyDetails = [...rowData];
    farmerFamilyDetails[index][name] = value;
    farmerFamilyDetails = Object.keys(rowData).map(key => {
      return rowData[key];
    })
    dispatch(farmerFamilyDetailsAction(farmerFamilyDetails))
  }


  return (
    <>
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
                  <i className="fa fa-pencil me-2" />
                  <i className="fa fa-trash" />
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
