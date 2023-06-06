import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';

export const DistributionCentreInfo = () => {

  return (
    <>
      <Row className="g-3">
        <Col sm={12} lg={12} className="no-pd-card">
          <FalconComponentCard className="mb-2">
            {/* <FalconComponentCard.Header title={`Company : ${localStorage.getItem("CompanyName")}`} light={false} /> */}
            <FalconComponentCard.Header title={`Company : Company Name`} light={false} />
          </FalconComponentCard>
        </Col>
        {/* {farmerData.encryptedFarmerCode && 
          <Col sm={6} lg={4} className="no-pd-card">
              <FalconComponentCard className="mb-2">
                  <FalconComponentCard.Header className="info-card-header" title={farmerData.farmerName} light={false} />
              </FalconComponentCard>
          </Col>} */}
      </Row>
    </>
  )
}

export default DistributionCentreInfo