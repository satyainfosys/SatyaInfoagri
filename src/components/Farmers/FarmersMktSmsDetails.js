import React from 'react';
import {
  Col,
  Row,
  Form,
  Button,
  InputGroup,
  FormControl,
  Table
} from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';

export const FarmersMktSmsDetails = () => {
  return (
    <>
      <Form>
        <Row>
          <Col className="me-3 ms-3">
            <div style={{ display: 'flex', justifyContent: 'end' }}></div>
            <FalconComponentCard>
              <FalconComponentCard.Header title="Market Crop" light={false} />
              <FalconComponentCard.Body language="jsx">
                <Row className="mb-3">
                  <InputGroup className="mb-3">
                    <Form.Select id="txtMarketCorp" name="marketCorp">
                      <option value="">Select</option>
                      <option value="Org">Org</option>
                      <option value="Inorg">Current</option>
                    </Form.Select>

                    <Button className="ms-1">ADD</Button>
                  </InputGroup>
                </Row>
                <Row className="mb-3">
                  <Table
                    striped
                    responsive
                    id="FarmersMarketCropDetailsListTable"
                    className="no-pb"
                  >
                    <thead>
                      <tr>
                        <th>Crop Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Doda Mandi-Baby corn</td>
                        <td>
                          <i className="fa fa-pencil me-2" />
                          <i className="fa fa-trash" />
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              </FalconComponentCard.Body>
            </FalconComponentCard>
          </Col>

          <Col>
            <div style={{ display: 'flex', justifyContent: 'end' }}></div>
            <FalconComponentCard>
              <FalconComponentCard.Header title="SMS Alert" light={false} />
              <FalconComponentCard.Body language="jsx">
                <Form.Label className="me-2">ACTIVE</Form.Label>
                <Form.Check
                  inline
                  className="me-5"
                  type="radio"
                  id="defaultRadio"
                  label="Yes"
                  name="radio"
                />

                <Form.Check
                  inline
                  type="radio"
                  id="defaultRadio"
                  label="No"
                  name="radio"
                />
                <Row className="mb-3">
                  <Form.Label>SMS Service Start Date</Form.Label>
                  <Form.Control
                    type="Date"
                    id="dateSMSServiceStartDate"
                    name="smsServiceStartDate"
                    placeholder="Start Date"
                   
                  />
                </Row>
                <Row className="mb-3">
                  <Form.Label>SMS Service End Date</Form.Label>
                  <Form.Control
                    type="Date"
                    id="dateSMSServiceEndDate"
                    name="smsServiceEndDate"
                    placeholder="End Date"
             
                  />
                </Row>
              </FalconComponentCard.Body>
            </FalconComponentCard>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FarmersMktSmsDetails;
