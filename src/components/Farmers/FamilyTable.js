import { farmerFamilyDetailsAction, farmerFamilyDetailsListAction } from 'actions';
import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

export const FamilyTable = () => {
  const dispatch = useDispatch();
  const [formHasError, setFormError] = useState(false);  
  const columnsArray = [
    'Name',
    'Age',
    'Sex',
    'Relation',
    'Education',
    'Action'
  ];
  const [familyMemberNameErr, setFamilyMemberNameErr] = useState({});

  const resetFamilyDetailData = () => {
    familyDetailData = {
      familyMemberName: '',
      memberAge: '',
      memberSex: '',
      farmerMemberRelation: '',
      memberEducation: '',
      activeStatus: ''
    };
  };

  const farmerFamilyDetailsReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailsReducer)
  var familyDetailData = farmerFamilyDetailsReducer.farmerFamilyDetails;

  const farmerFamilyDetailsListReducer = useSelector((state) => state.rootReducer.farmerFamilyDetailsListReducer)

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

  const changeHandle = e => {
    dispatch(farmerFamilyDetailsAction({
      ...familyDetailData,
      [e.target.name]: e.target.value
    }));
  };

  const clearStates = () => {
    setFormError(false);
    setFamilyMemberNameErr({});
    dispatch(farmerFamilyDetailsAction(undefined));
  }

  const addFarmerFamilyDetailsInList = () => {    
    if (validateFarmerFamilyDetailsForm()) {
      const familyData = {
        encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
        familyMemberName: familyDetailData.familyMemberName,
        memberAge: familyDetailData.memberAge,
        memberSex: familyDetailData.memberSex == "Male" ? "M" : familyDetailData.memberSex == "Female" ? "F" : familyDetailData.memberSex == "Others" ? "O" : "",
        memberEducation: familyDetailData.memberEducation == "Primary School" ? "PRS" : familyDetailData.memberEducation == "High School" ? "HGS" : familyDetailData.memberEducation == "Inter" ? "INS" : familyDetailData.memberEducation == "Graduate" ? "GRD" : familyDetailData.memberEducation == "Illiterate" ? "ILT" : familyDetailData.memberEducation == "Post Graduate" ? "PSG" : familyDetailData.memberEducation == "Doctrate" ? "DOC" : "",
        farmerMemberRelation: familyDetailData.farmerMemberRelation == "Father" ? "F" : familyDetailData.farmerMemberRelation == "Mother" ? "M" : "",
        activeStatus: familyDetailData.activeStatus == null || familyDetailData.activeStatus == "Ative" ? "A" : "S",
        addUser: localStorage.getItem("LoginUserName")
      }

      dispatch(farmerFamilyDetailsListAction(familyData));      
      resetFamilyDetailData();
      clearStates();
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          id="btnAddFarmersFamilyTable"
          className="mb-2"
          onClick={addFarmerFamilyDetailsInList}
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
            <tr>
              <td>
                <Form.Control
                  type="text"
                  id="txtFamilyMemberName"
                  name="familyMemberName"
                  value={familyDetailData.familyMemberName}
                  onChange={changeHandle}
                  placeholder="Name"
                  className="form-control"
                  maxLength={30}
                  required
                />
                {Object.keys(familyMemberNameErr).map((key) => {
                  return <span className="error-message">{familyMemberNameErr[key]}</span>
                })}
              </td>
              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numAge"
                  name="memberAge"
                  value={familyDetailData.memberAge}
                  onChange={changeHandle}
                  placeholder="Age"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtSex"
                  name="memberSex"
                  onChange={changeHandle}
                  value={familyDetailData.memberSex}
                  className="form-control"
                >
                  <option value=''>Select</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Others'>Others</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtRelation"
                  name="farmerMemberRelation"
                  className="form-control"
                  onChange={changeHandle}
                  value={familyDetailData.farmerMemberRelation}
                >
                  <option value=''>Select relation</option>
                  <option value='Father'>Father</option>
                  <option value='Mother'>Mother</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtEducation"
                  name="memberEducation"
                  className="form-control"
                  onChange={changeHandle}
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
          </tbody>
          <thead>
            {farmerFamilyDetailsListReducer.farmerFamilyDetailsList.length > 0 ?

              farmerFamilyDetailsListReducer.farmerFamilyDetailsList.map((data, idx) => (
                data &&
                <tr key={idx}>
                  <td key={idx}>{data.familyMemberName}</td>
                  <td key={idx}>{data.memberAge ? data.memberAge : 0}</td>
                  <td key={idx}>{data.memberSex == "M" ? "Male" : data.memberSex == "Female" ? "F" : data.memberSex == "Others" ? "O" : ""}</td>
                  <td key={idx}>{data.farmerMemberRelation == "F" ? "Father" : data.relation == "Mother" ? "M" : ""}</td>
                  <td key={idx}>{data.memberEducation == "PRS" ? "Primary School" :
                    data.memberEducation == "HGS" ? "High School" :
                      data.memberEducation == "GRD" ? "Graduate" :
                        data.memberEducation == "PSG" ? "Post Graduate" :
                          data.memberEducation == "ILT" ? "Illiterate" :
                            data.memberEducation == "DOC" ? "Doctrate" :
                              data.memberEducation == "INS" ? "Inter" : ""}</td>
                  <td>
                    <i className="fa fa-pencil me-2" />
                    <i className="fa fa-trash" />
                  </td>
                </tr>
              )) : null}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FamilyTable;
