import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FalconComponentCard from 'components/common/FalconComponentCard';
import { useSelector } from 'react-redux';

export const TabInfoRow = () => {

  const tabInfoReducer = useSelector((state) => state.rootReducer.tabInfoReducer)
  var tabInfoData = tabInfoReducer.tabInfo;

  return (
    <>
      <Row className="g-3">
        <Col sm={tabInfoData.title2 ? 10 : 12} lg={tabInfoData.title2 ? 8 : 12} className="no-pd-card">
          <FalconComponentCard className="mb-2">
            <FalconComponentCard.Header title={tabInfoData.title1} light={false} />
          </FalconComponentCard>
        </Col>
        {tabInfoData.title2 &&
          <Col sm={6} lg={4} className="no-pd-card">
            <FalconComponentCard className="mb-2">
              <FalconComponentCard.Header className="info-card-header" title={tabInfoData.title2} light={false} />
            </FalconComponentCard>
          </Col>}
      </Row>
    </>
  )
}

export default TabInfoRow