import React from 'react';
import { Col, Row, Table, Form } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';


export const FarmersEventDetails = () => {
  return (
    <>
      <Form>
        <Row>
          <Col>
            <div style={{ display: 'flex', justifyContent: 'end' }}></div>
            <FalconComponentCard>
              <FalconComponentCard.Header
                title="Invitation"
                light={false}
              />
              <FalconComponentCard.Body language="jsx">
                <Table
                  striped
                  responsive
                  id="FarmersInvitationListTable"
                  className="no-pb"
                >
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Event Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                </Table>
              </FalconComponentCard.Body>
            </FalconComponentCard>
          </Col>

          <Col>
            <div style={{ display: 'flex', justifyContent: 'end' }}></div>
            <FalconComponentCard>
              <FalconComponentCard.Header
                title="Attended"
                light={false}
              />
              <FalconComponentCard.Body language="jsx">
                <Table
                  striped
                  responsive
                  id="FarmersAttendedListTable"
                  className="no-pb"
                >
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Event Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Venue</th>
                    </tr>
                  </thead>
                </Table>
              </FalconComponentCard.Body>
            </FalconComponentCard>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FarmersEventDetails;
