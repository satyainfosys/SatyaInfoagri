import React, { useEffect } from 'react';
import { Tabs, Row, Col, Form, Tab, Button, Modal } from 'react-bootstrap';
import TabPageMainMenu from 'components/navbar/top/TabPageMainMenu';
import { useSelector } from 'react-redux';

//Datatable Modules
import FalconComponentCard from 'components/common/FalconComponentCard';

import ClientDetails from '../Clients/ClientDetails';
import ContactDetails from '../Clients/ContactDetails';
import TransactionDetails from '../Clients/TransactionDetails';
import TransactionDetailList from '../Clients/TransactionDetailList';

import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableFooter from 'components/common/advance-table/AdvanceTableFooter';
import AdvanceTableSearchBox from 'components/common/advance-table/AdvanceTableSearchBox';

import CommonContactDetailsTable from 'components/Company/CommonContactDetailsTable';
import Maintenance from 'components/Company/Maintenance';

import UserDetails from 'components/User/UserDetails';

import ProductDetails from 'components/Product/ProductDetails';

import $ from 'jquery';
import AddFarmer from 'components/Farmers/AddFarmer';
import FarmersDocumentDetails from 'components/Farmers/FarmersDocumentDetails';
import FarmersLiveStockTable from 'components/Farmers/FarmersLiveStockTable';
import FarmersMachinaryDetailsTable from 'components/Farmers/FarmersMachinaryDetailsTable';
import FarmersLandTable from 'components/Farmers/FarmersLandTable';
import FarmersIrrigrationTable from 'components/Farmers/FarmersIrrigrationTable';
import BankDetailsTable from 'components/Farmers/BankDetailsTable';
import FamilyTable from 'components/Farmers/FamilyTable';
import FarmerContactInformationTable from 'components/Farmers/FarmerContactInformationTable';


const TabPage = ({
  listData,
  listColumnArray,
  tabArray,
  module,
  saveDetails,
  newDetails,
  cancelClick,
  exitModule,
  companyList,
  supportingMethod1
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

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  const isAnyFormDirty = Object.values(formChangedData).some(value => value === true);

  if (isAnyFormDirty) {
    document.getElementById("btnSave").disabled = false;
  }

  useEffect(() => {
    $('[data-rr-ui-event-key*="Customer List"]').trigger('click');
    $('[data-rr-ui-event-key*="Details"]').attr('disabled', true);
    $('#btnNew').show();
    $('#btnSave').hide();
    $('#btnSave').attr('disabled', true);
    $('#btnCancel').hide();
    $('.tab-page-list-card').removeClass('card');
    $('.add-farmer-card').removeClass('card');
    $('.add-farmer-card-body').removeClass('bg-light');
    localStorage.removeItem('EncryptedResponseClientCode');
    localStorage.removeItem("EncryptedCompanyCode");
  }, []);

  const discardChanges = () => {
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else $('[data-rr-ui-event-key*="List"]').trigger('click');

    setModalShow(false);
  };

  const data = `const columns = 
  ${JSON.stringify(listColumnArray)};
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
                  {module === "Farmers" &&
                    <FalconComponentCard className="mb-1">
                      <FalconComponentCard.Body language="jsx" className="no-padding mt-1 mb-1 ms-1">
                        <Row>
                          <Col sm={6} lg={4}>
                            {companyList.length > 1 ?
                              <>
                                {<Form.Select id="txtCompany" name="encryptedCompanyCode" onChange={supportingMethod1}>
                                  <option value=''>Select Company</option>
                                  {companyList.map((option, index) => (
                                    <option key={index} value={option.value}>{option.key}</option>
                                  ))}
                                </Form.Select>}
                              </> :
                              <>
                                <Form.Select id="txtCompany" name="encryptedCompanyCode" onChange={supportingMethod1} disabled>
                                  {companyList.map((option, index) => (
                                    <option key={index} value={option.value}>{option.key}</option>
                                  ))}
                                </Form.Select>
                              </>}

                          </Col>
                        </Row>
                      </FalconComponentCard.Body>
                    </FalconComponentCard>
                  }

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

                  <FalconComponentCard id="ContactDetailsTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <ContactDetails />
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

                  <FalconComponentCard id="ContactDetailsTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <CommonContactDetailsTable />
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
                  <FalconComponentCard className="add-farmer-card">
                    <FalconComponentCard.Body language="jsx" className="add-farmer-card-body">
                      <AddFarmer />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 2 && module == 'Farmers' && (
                <>

                  <FalconComponentCard id="FamilyMemberTableDetails" className="tab-page-button-table-card mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <FamilyTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="ContactDetailsTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <FarmerContactInformationTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 3 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="BankDetailsTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <BankDetailsTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 4 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersLandDetailsTable" className="tab-page-button-table-card mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersLandTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="FarmersIrrigrationDetailsTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersIrrigrationTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 5 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersLiveStockTable" className="tab-page-button-table-card mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersLiveStockTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <FalconComponentCard id="FarmersMachinaryTable" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersMachinaryDetailsTable />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}

              {index == 6 && module == 'Farmers' && (
                <>
                  <FalconComponentCard id="FarmersDocumentDetailsFrom" className="tab-page-button-table-card">
                    <FalconComponentCard.Body language="jsx">
                      <FarmersDocumentDetails />
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
