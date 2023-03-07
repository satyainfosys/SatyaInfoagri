import React from 'react';
import { Button, Table, Form, Col, Row } from 'react-bootstrap';
import { useState } from 'react';

export const FarmersLandTable = () => {
  const [formHasError, setFormError] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [data, setdata] = useState([]);
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

  const handleAddRow = () => {
    const item = {
      longitude: '',
      latitude: '',
      khasraNo: '',
      landMark: '',
      ownerShip: '',
      usages: '',
      orgInorg: '',
      cultivatedLand: '',
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
            <tr>
              <td>
                <Form.Control
                  type="text"
                  id="textLongitude"
                  name="longitude"
                  value={rowData.longitude}
                  onChange={changeHandle}
                  placeholder="Longitude"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  id="textLatitude"
                  name="latitude"
                  value={rowData.latitude}
                  onChange={changeHandle}
                  placeholder="Latitude"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  id="numKhasraNo"
                  name="khasraNo"
                  min={0}
                  value={rowData.khasraNo}
                  onChange={changeHandle}
                  placeholder="Khasra No"
                  className="form-control"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  id="txtLandMark"
                  name="landMark"
                  min={0}
                  value={rowData.landMark}
                  onChange={changeHandle}
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
                  value={rowData.ownerShip}
                  onChange={changeHandle}
                >
                  <option>Select</option>
                  <option>Birla</option>
                </Form.Select>
              </td>

              <td>
                <Form.Select
                  type="text"
                  id="txtUsages"
                  name="usages"
                  className="form-control"
                  value={rowData.usages}
                  onChange={changeHandle}
                >
                  <option>Select</option>
                  <option>4</option>
                </Form.Select>
              </td>

              <td>
                <Form.Select
                  type="text"
                  id="txtOrgInorg"
                  name="orgInorg"
                  value={rowData.orgInorg}
                  onChange={changeHandle}
                  className="form-control"
                >
                  <option>Select</option>
                  <option>india</option>
                </Form.Select>
              </td>

              <td>
                <Form.Control
                  type="text"
                  min={0}
                  id="txtCultivatedLand"
                  name="cultivatedLand"
                  value={rowData.cultivatedLand}
                  onChange={changeHandle}
                  placeholder="Cultivated Land"
                />
              </td>

              <td>
                <Form.Select
                  id="txtStatus"
                  name="activeStatus"
                  className="form-control"
                  value={rowData.activeStatus}
                  onChange={changeHandle}
                >
                  <option>Active</option>
                  <option value="Suspended">Suspended</option>
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
                <td key={idx}>{data.longitude}</td>
                <td key={idx}>{data.latitude}</td>
                <td key={idx}>{data.khasraNo}</td>
                <td key={idx}>{data.landMark}</td>
                <td key={idx}>{data.ownerShip}</td>
                <td key={idx}>{data.usages}</td>
                <td key={idx}>{data.orgInorg}</td>
                <td key={idx}>{data.cultivatedLand}</td>
                <td key={idx}>{data.activeStatus}</td>
                <td key={idx}> </td>
              </tr>
            ))}
          </thead>
        </Table>
      </Form>
    </>
  );
};

export default FarmersLandTable;
