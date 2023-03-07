import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

export const Family = () => {
  const [formHasError, setFormError] = useState(false);

  useEffect(() => {
    $('#FamilyMembersForm').hide();
  }, []);

  const hideForm = () => {
    $('#FamilyMembersForm').hide();
    $('#FamilyMembersListCard').show();
  };
  return (
    <>
      <Form
        noValidate
        validated={formHasError}
        className="details-form"
        id="AddFamilyMembersForm"
      >
        <Row>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label className="details-form">Name</Form.Label>
              <Form.Control
                id="txtMemberName"
                name="memberName"
                placeholder="Name"
              />
            </Row>
          </Col>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                id="txtAge"
                name="age"
                min={0}
                placeholder="Age"
              />
            </Row>
          </Col>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Sex</Form.Label>
              <Form.Select id="txtSex" name="sex">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Relation</Form.Label>
              <Form.Select id="txtRelation" name="relation">
                <option value="">Select</option>
              </Form.Select>
            </Row>
          </Col>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Education</Form.Label>
              <Form.Select id="txtEducation" name="education">
                <option value="">Select</option>
              </Form.Select>
            </Row>
          </Col>
          <Col className="me-3 ms-3">
            <Row className="mb-3">
              <Form.Label>Active Status</Form.Label>
              <Form.Select id="txtStatus" name="status">
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </Form.Select>
            </Row>
            <Row className="mb-2" id="btnFamilyMember">
              <Button variant="primary" type="button">
                Add
              </Button>
            </Row>
            {/* <Row className="mb-2" id='btnUpdateFamilyMembers'>
                            <Button variant="primary">
                                Update
                            </Button>
                        </Row> */}
            <Row className="mb-2">
              <Button variant="danger" onClick={() => hideForm()}>
                Cancel
              </Button>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Family;
