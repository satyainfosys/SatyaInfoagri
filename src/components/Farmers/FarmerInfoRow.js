import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useSelector } from 'react-redux';

export const FarmerInfoRow = () => {

  const farmerDetailsReducer = useSelector((state) => state.rootReducer.farmerDetailsReducer)
  var farmerData = farmerDetailsReducer.farmerDetails;

  return (
    <>
      <Row className="g-3">
          <Col sm={farmerData.encryptedFarmerCode ? 10 : 12} lg={farmerData.encryptedFarmerCode ? 8 : 12} className="no-pd-card">
              <FalconComponentCard className="mb-2">
                  <FalconComponentCard.Header title={`Company : ${localStorage.getItem("CompanyName")}`} light={false} />
              </FalconComponentCard>
          </Col>
          {farmerData.encryptedFarmerCode && 
          <Col sm={6} lg={4} className="no-pd-card">
              <FalconComponentCard className="mb-2">
                  <FalconComponentCard.Header className="info-card-header" title={farmerData.farmerName} light={false} />
              </FalconComponentCard>
          </Col>}
      </Row>
    </>
  )
}

export default FarmerInfoRow