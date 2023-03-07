import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FamilyTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState({});
  const columnsArray = [
    'Name',
    'Age',
    'Sex',
    'Relation',
    'Education',
    '	Action'
  ];

  const handleAddRow = () => {
    const item = {
      name: '',
      age: '',
      sex: '',
      relation: '',
      education: '',
      activeStatus: ''
    };
    setRowData([...rowData, item]);
  };
  const changeHandle = e => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

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
            <tr>
              <td>
                <Form.Control
                  type="text"
                  id="txtFamilyName"
                  name="name"
                  value={rowData.name}
                  onChange={changeHandle}
                  placeholder="Name"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  min={0}
                  id="numAge"
                  name="age"
                  value={rowData.age}
                  onChange={changeHandle}
                  placeholder="Age"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtSex"
                  name="sex"
                  onChange={changeHandle}
                  value={rowData.sex}
                  className="form-control"
                >
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtRelation"
                  name="relation"
                  className="form-control"
                  onChange={changeHandle}
                  value={rowData.relation}
                >
                  <option>Select</option>
                  <option>Father</option>
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  type="text"
                  id="txtEducation"
                  name="education"
                  className="form-control"
                  onChange={changeHandle}
                  value={rowData.education}
                >
                  <option>Select</option>
                  <option>12</option>
                </Form.Select>
              </td>
              <td>
                <i className="fa fa-pencil me-2" />
                <i className="fa fa-trash" />
              </td>
            </tr>
          </tbody>
          <thead>
            {rowData.map((item, idx) => (
              <tr key={idx}>
                <td key={idx}>{data.name}</td>
                <td key={idx}>{data.age}</td>
                <td key={idx}>{data.sex}</td>
                <td key={idx}>{data.relation}</td>
                <td key={idx}>{data.education}</td>
                <td key={idx}>{data.activeStatus}</td>
              </tr>
            ))}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FamilyTable;
