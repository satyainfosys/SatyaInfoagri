import React, { useEffect } from 'react';
import { Tabs, Tab, Button, Modal } from 'react-bootstrap';
import TabPageMainMenu from 'components/navbar/top/TabPageMainMenu';

//Datatable Modules
import FalconComponentCard from 'components/common/FalconComponentCard';

import ClientDetails from '../Clients/ClientDetails';
import ContactDetails from '../Clients/ContactDetails';
import ContactDetailsList from '../Clients/ContactDetailsList';
import TransactionDetails from '../Clients/TransactionDetails';
import TransactionDetailList from '../Clients/TransactionDetailList';

import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
import AdvanceTableSearchBox from 'components/common/advance-table/AdvanceTableSearchBox';

import CommonContactDetailList from 'components/Company/CommonContactDetailList';
import CommonContactDetails from 'components/Company/CommonContactDetails';
import Maintenance from 'components/Company/Maintenance';

import UserDetails from 'components/User/UserDetails';

import ProductDetails from 'components/Product/ProductDetails';

import $ from 'jquery';
import AddFarmer from 'components/Farmers/AddFarmer';
import FarmersDocumentDetails from 'components/Farmers/FarmersDocumentDetails';
import FarmersEventDetails from 'components/Farmers/FarmersEventDetails';
import FarmersMktSmsDetails from 'components/Farmers/FarmersMktSmsDetails';
import FarmersLiveStockTable from 'components/Farmers/FarmersLiveStockTable';
import FarmersMachinaryDetailsTable from 'components/Farmers/FarmersMachinaryDetailsTable';
import FarmersLandTable from 'components/Farmers/FarmersLandTable';
import FarmersIrrigrationTable from 'components/Farmers/FarmersIrrigrationTable';
import BankDetailsTable from 'components/Farmers/BankDetailsTable';
import FarmersCardTable from 'components/Farmers/FarmersCardTable';
import FamilyTable from 'components/Farmers/FamilyTable';


const TabPage = ({
  listData,
  listColumnArray,
  tabArray,
  module,
  saveDetails,
  newDetails,
  cancelClick,
  exitModule
}) => {
  $.fn.extend({
    trackChanges: function () {
      $(':input', this).change(function () {
        $(this.form).data('changed', true);
        if ($('#btnSave').attr('disabled'))
          $('#btnSave').attr('disabled', false);
      });
    },
    isChanged: function () {
      return this.data('changed');
    }
  });

  useEffect(() => {
    $('[data-rr-ui-event-key*="Customer List"]').trigger('click');
    $('[data-rr-ui-event-key*="Details"]').attr('disabled', true);
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnSave').attr('disabled', true);
    $('#btnCancel').hide();

    $('.tab-page-list-card').removeClass('card');
    localStorage.removeItem('EncryptedResponseClientCode');
  }, []);

  const discardChanges = () => {
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else $('[data-rr-ui-event-key*="List"]').trigger('click');

    setModalShow(false);
  };

  const data = `const columns = ${JSON.stringify(listColumnArray)};
  
  const data = ${JSON.stringify(listData)};`;

  const searchableTableCode = `${data}

  function AdvanceTableExample() {
  
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
            <Row className="flex-end-center  mt-1 mb-1">
              <Col xs="auto" className="me-1" sm={6} lg={4}>
                <AdvanceTableSearchBox table/>
              </Col>
            </Row>
            </FalconComponentCard.Body>
        </FalconComponentCard>

        <FalconComponentCard className="list-card mb-1">
          <FalconComponentCard.Body>

            <AdvanceTable
              table
              headerClassName="bg-200 text-900 text-nowrap align-middle"
              style = "padding-top : 0px"
              rowClassName="align-middle white-space-nowrap"
              tableProps={{
                bordered: true,
                striped: true,
                className: 'mb-0 overflow-hidden',
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
  }
  
  render(<AdvanceTableExample />)`;

  const [modalShow, setModalShow] = React.useState(false);

  const save = () => {
    $('#btnSave').trigger('click');
    setModalShow(false);
  };

  return (
    <>
      {modalShow && (
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Do you want to save changes?</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={save}>
              Save
            </Button>
            <Button variant="danger" onClick={discardChanges}>
              Discard
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <TabPageMainMenu
        newClick={newDetails}
        saveClick={saveDetails}
        cancelClick={cancelClick}
        exitClick={exitModule}
      />

      <Tabs id="uncontrolled-tab-example" className="mb-2 mt-2">
        {Object.values(tabArray).map((tab, index) => {
          return (
            <Tab
              eventKey={tab}
              title={tab}
              className={
                index == 0
                  ? 'border p-1'
                  : tab != 'Transaction Details'
                  ? 'border p-1 tab-page-tab'
                  : ''
              }
            >
              {index == 0 && listData && (
                <>
                  <FalconComponentCard className="tab-page-list-card">
                    <FalconComponentCard.Body
                      code={searchableTableCode}
                      scope={{
                        AdvanceTableWrapper,
                        AdvanceTable,
                        AdvanceTableFooter,
                        AdvanceTableSearchBox,
                        FalconComponentCard
                      }}
                      language="jsx"
                      noInline
                      noLight
                    />
                  </FalconComponentCard>
                </>
              )}
              {index == 1 && module == 'Client' && (
                <>
                  <FalconComponentCard className="mb-2 no-pb">
                    <FalconComponentCard.Body language="jsx">
                      <ClientDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="AddContactDetailsForm">
                    <FalconComponentCard.Body language="jsx">
                      <ContactDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard
                    id="ContactDetailsTable"
                    className="tab-page-button-table-card no-pb"
                  >
                    <FalconComponentCard.Body language="jsx">
                      <ContactDetailsList />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 2 && module == 'Client' && (
                <>
                  <FalconComponentCard
                    id="TransactionDetailsListCard"
                    className="tab-page-table-card mb-2 no-pad"
                  >
                    <FalconComponentCard.Body language="jsx">
                      <TransactionDetailList />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard
                    id="AddTransactionDetailsForm"
                    className="mb-0 no-pb"
                  >
                    <FalconComponentCard.Body language="jsx">
                      <TransactionDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 1 && module == 'CompanyMaster' && (
                <>
                  <FalconComponentCard className="no-pb mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <Maintenance />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="CommonContactDetailsForm">
                    <FalconComponentCard.Body language="jsx">
                      <CommonContactDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard
                    id="CommonContactDetailsCard"
                    className="tab-page-button-table-card no-pb"
                  >
                    <FalconComponentCard.Body language="jsx">
                      <CommonContactDetailList />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 1 && module == 'User' && (
                <>
                  <FalconComponentCard className="no-pb mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <UserDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 1 && module == 'Product' && (
                <>
                  <FalconComponentCard>
                    <FalconComponentCard.Body language="jsx">
                      <ProductDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 1 && module == 'Farmers' && (
                <>
                  <FalconComponentCard>
                    <FalconComponentCard.Body language="jsx">
                      <AddFarmer />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 2 && module == 'Farmers' && (
                <>
                 
                  <FalconComponentCard id="FamilyMemberTableDetails">
                    <FalconComponentCard.Body language="jsx">
                      <FamilyTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 3 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="BankDetailsTable">
                    <FalconComponentCard.Body language="jsx">
                      <BankDetailsTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                  <FalconComponentCard id="FarmerCardDetailsTable">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersCardTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>      
                </>
              )}

              {index == 4 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersLandDetailsTable">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersLandTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                  <FalconComponentCard id="FarmersIrrigrationDetailsTable">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersIrrigrationTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 5 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersLiveStockTable">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersLiveStockTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="FarmersMachinaryTable">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersMachinaryDetailsTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 6 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersDocumentDetailsFrom">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersDocumentDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 7 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersEventDetailsFrom">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersEventDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 8 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersMktSmsDetailsFrom">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersMktSmsDetails />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default TabPage;
