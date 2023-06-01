/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col} from 'react-bootstrap';
import AdvanceTableWrapper from './AdvanceTableWrapper';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import AdvanceTableSearchBox from './AdvanceTableSearchBox';
import AdvanceTableFilter from './AdvanceTableFilter';
import FalconComponentCard from '../FalconComponentCard';

const AdvanceTableComponent = ({
  columns,
  data,
  moduleName,
  filterOptions,
  filterName,
  handleFilterChange
}) => {
  
  return (
    <AdvanceTableWrapper
        columns={columns}
        data={data}
        sortable
        pagination
        perPage={10}
      >

        <FalconComponentCard id='TableSearchPanelCard' className="no-pad mb-1">
            <FalconComponentCard.Body>
            <Row className="mt-1 mb-1 space-between-row">
              <Col xs="auto" className="ms-1 flex-col" sm={6} lg={4}>
                <div className="text-left">
                  <AdvanceTableFilter options={filterOptions} filterName={filterName} handleFilterChange={handleFilterChange}/>
                </div>
              </Col>
              <Col xs="auto" className="me-1 flex-col" sm={6} lg={4}>
                <div className="text-right">
                  <AdvanceTableSearchBox table/>
                </div>
              </Col>
            </Row>
            </FalconComponentCard.Body>
        </FalconComponentCard>

        <FalconComponentCard className={moduleName == 'Farmers' ? "list-card mb-1" : "list-tab-card mb-1" }>
          <FalconComponentCard.Body>

            <AdvanceTable
              table
              headerClassName="custom-bg-200 text-900 text-nowrap align-middle"
              style = "padding-top : 0px"
              rowClassName="align-middle white-space-nowrap"
              tableProps={{
                bordered: true,
                striped: true,
                className: 'mb-0 overflow-hidden tab-page-table',
                responsive: true
              }}
            />

          </FalconComponentCard.Body>
        </FalconComponentCard>

        <FalconComponentCard id='TableFooterPanel'>
          <FalconComponentCard.Body className="footer-pagination">
            <div className="mt-3 advance-table-footer">
              <AdvanceTableFooter
                rowCount={data.length}
                table
                rowInfo
                navButtons
                rowsPerPageSelection
              />
            </div>
          </FalconComponentCard.Body>
        </FalconComponentCard>
      </AdvanceTableWrapper>
  );
};

export default AdvanceTableComponent;