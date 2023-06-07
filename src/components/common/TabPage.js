import React, { useEffect } from 'react';
import { Tabs, Tab, Button, Modal } from 'react-bootstrap';
import TabPageMainMenu from 'components/navbar/top/TabPageMainMenu';
import { useSelector } from 'react-redux';
import $ from 'jquery';

//Datatable Modules
import FalconComponentCard from 'components/common/FalconComponentCard';

import ClientDetails from '../Clients/ClientDetails';
import ContactDetails from '../Clients/ContactDetails';
import TransactionDetails from '../Clients/TransactionDetails';
import TransactionDetailList from '../Clients/TransactionDetailList';

import AdvanceTableComponent from 'components/common/advance-table/AdvanceTableComponent';

import CommonContactDetailsTable from 'components/Company/CommonContactDetailsTable';
import Maintenance from 'components/Company/Maintenance';

import UserDetails from 'components/User/UserDetails';

import ProductDetails from 'components/Product/ProductDetails';

import AddFarmer from 'components/Farmers/AddFarmer';
import FarmersDocumentDetails from 'components/Farmers/FarmersDocumentDetails';
import FarmersLiveStockTable from 'components/Farmers/FarmersLiveStockTable';
import FarmersMachinaryDetailsTable from 'components/Farmers/FarmersMachinaryDetailsTable';
import FarmersLandTable from 'components/Farmers/FarmersLandTable';
import FarmersIrrigrationTable from 'components/Farmers/FarmersIrrigrationTable';
import BankDetailsTable from 'components/Farmers/BankDetailsTable';
import FamilyTable from 'components/Farmers/FamilyTable';

import AddCollectionCentre from 'components/CollectionCentre/AddCollectionCentre';
import AddFig from 'components/CollectionCentre/AddFig';

import AddDistributionCentre from 'components/DistributionCentre/AddDistributionCentre';
import CommonContactTable from './CommonContactTable';
import TabInfoRow from './TabInfoRow';

const TabPage = ({
  listData,
  listColumnArray,
  tabArray,
  module,
  saveDetails,
  newDetails,
  cancelClick,
  exitModule,
  tableFilterOptions,
  tableFilterName,
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
                  : tab == 'Customer Details' || tab == 'Maintenance' || tab == 'Product Detail' || tab == 'Add Farmer' || tab == 'Add Collection Centre' || tab == 'Add New Distribution'
                    ? 'border p-1 tab-page-tab'
                    : ''
              }
            >
              {index == 0 && listData && (
                <>

                  <FalconComponentCard className="tab-page-list-card">
                    <FalconComponentCard.Body>
                      <AdvanceTableComponent
                        columns={listColumnArray}
                        data={listData}
                        filterOptions={tableFilterOptions}
                        filterName={tableFilterName}
                        handleFilterChange={supportingMethod1} />
                    </FalconComponentCard.Body>
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

                  <ContactDetails />
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

                  <CommonContactDetailsTable />
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
                      <TabInfoRow />
                      <AddFarmer />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>
                </>
              )}
              {index == 2 && module == 'Farmers' && (
                <>
                  <TabInfoRow />
                  <FamilyTable />
                  <CommonContactTable />
                </>
              )}
              {index == 3 && module == 'Farmers' && (
                <>
                  <TabInfoRow />
                  <BankDetailsTable />
                </>
              )}

              {index == 4 && module == 'Farmers' && (
                <>
                  <TabInfoRow />
                  <FarmersLandTable />
                  <FarmersIrrigrationTable />
                </>
              )}

              {index == 5 && module == 'Farmers' && (
                <>
                  <TabInfoRow />
                  <FarmersLiveStockTable />
                  <FarmersMachinaryDetailsTable />
                </>
              )}

              {index == 6 && module == 'Farmers' && (
                <>
                  <TabInfoRow />
                  <FarmersDocumentDetails />
                </>
              )}

              {index == 1 && module == 'CollectionCentre' && (
                <>
                  <TabInfoRow />

                  <FalconComponentCard className="no-pb mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <AddCollectionCentre />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <CommonContactTable />
                </>
              )}

              {index == 2 && module == 'CollectionCentre' && (
                <>
                  <TabInfoRow />

                  <AddFig />
                </>
              )}

              {index == 1 && module == 'DistributionCentre' && (
                <>
                  <TabInfoRow />

                  <FalconComponentCard className="no-pb mb-2">
                    <FalconComponentCard.Body language="jsx">
                      <AddDistributionCentre />
                    </FalconComponentCard.Body>
                  </FalconComponentCard>

                  <CommonContactTable />
                </>
              )}
            </Tab>
          );
        })}
      </Tabs >
    </>
  );
};

export default TabPage;
