import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from 'jquery';
import { tabInfoAction } from 'actions';

const tabArray = ['Demand List', 'Add Demand'];

const listColumnArray = [
  { accessor: 'sl', Header: 'S. No' },
  { accessor: 'demandNo', Header: 'Demand No.' },
  { accessor: 'demandDate', Header: 'Demand Date' },
  { accessor: 'productCode', Header: 'Product Code' },
  { accessor: 'farmerName', Header: 'Farmer Name' },
  { accessor: 'demandStatus', Header: 'Demand Status' },
  { accessor: 'receiveStatus', Header: 'Receive Status' },
  { accessor: 'demandPrintStatus', Header: 'Print' }
];

const Demand = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [listData, setListData] = useState([]);
  const [activeTabName, setActiveTabName] = useState();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
    getCompany();
  }, []);

  const getCompany = async () => {
    let companyData = [];
    const companyRequest = {
      EncryptedClientCode: localStorage.getItem('EncryptedClientCode')
    };

    let companyResponse = await axios.post(
      process.env.REACT_APP_API_URL + '/get-client-companies',
      companyRequest,
      {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem('Token')).value
          }`
        }
      }
    );

    if (companyResponse.data.status == 200) {
      if (companyResponse.data && companyResponse.data.data.length > 0) {
        if (companyResponse.data && companyResponse.data.data.length > 0) {
          if (localStorage.getItem('CompanyCode')) {
            var companyDetail = companyResponse.data.data.find(
              company =>
                company.companyCode == localStorage.getItem('CompanyCode')
            );
            companyData.push({
              key: companyDetail.companyName,
              value: companyDetail.encryptedCompanyCode,
              label: companyDetail.companyName
            });
            localStorage.setItem(
              'EncryptedCompanyCode',
              companyDetail.encryptedCompanyCode
            );
            localStorage.setItem('CompanyName', companyDetail.companyName);
            setCompanyList(companyData);
          } else {
            companyResponse.data.data.forEach(company => {
              companyData.push({
                key: company.companyName,
                value: company.encryptedCompanyCode,
                label: company.companyName
              });
            });
            setCompanyList(companyData);
          }
        }
      }
      if (companyResponse.data.data.length == 1) {
        localStorage.setItem(
          'CompanyName',
          companyResponse.data.data[0].companyName
        );
        localStorage.setItem(
          'EncryptedCompanyCode',
          companyResponse.data.data[0].encryptedCompanyCode
        );
      }
    } else {
      setCompanyList([]);
    }
  };

  $('[data-rr-ui-event-key*="Demand List"]')
    .off('click')
    .on('click', function () {
      let isDiscard = $('#btnDiscard').attr('isDiscard');
      if (isDiscard != 'true') {
        setModalShow(true);
        setTimeout(function () {
          $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
        }, 50);
      } else {
        $('#btnNew').show();
        $('#btnSave').hide();
        $('#btnCancel').hide();
        $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
      }
    });

  $('[data-rr-ui-event-key*="Add Demand"]')
    .off('click')
    .on('click', function () {
      setActiveTabName('Add Demand');
      $('#btnNew').hide();
      $('#btnSave').show();
      $('#btnCancel').show();
    });

  const newDetails = () => {
    $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', false);
    $('[data-rr-ui-event-key*="Add Demand"]').trigger('click');
    $('#btnSave').attr('disabled', false);
		dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
  };

  const cancelClick = () => {
    $('#btnExit').attr('isExit', 'false');
    setModalShow(true);
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#btnNew').show();
    $('[data-rr-ui-event-key*="Add Demand"]').attr('disabled', true);
    $('[data-rr-ui-event-key*="Demand List"]').trigger('click');
  };

  const exitModule = () => {
    $('#btnExit').attr('isExit', 'true');
    setModalShow(true);
    window.location.href = '/dashboard';
  };

  const discardChanges = () => {
    $('#btnDiscard').attr('isDiscard', 'true');
    if ($('#btnExit').attr('isExit') == 'true')
      window.location.href = '/dashboard';
    else {
      $('[data-rr-ui-event-key*="Demand List"]').trigger('click');
    }
    setModalShow(false);
  };

	const handleFieldChange = e => {
		localStorage.setItem("EncryptedCompanyCode", e.target.value);
		const selectedOption = e.target.options[e.target.selectedIndex];
		const selectedKey = selectedOption.dataset.key || selectedOption.label;
		localStorage.setItem("CompanyName", selectedKey)
}

  return (
    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

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
            <h5>Do you want to save changes?</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success">Save</Button>
            <Button variant="danger" id="btnDiscard" onClick={discardChanges}>
              Discard
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <TabPage
        listData={listData}
        listColumnArray={listColumnArray}
        tabArray={tabArray}
        module="DemandCollection"
        newDetails={newDetails}
        cancelClick={cancelClick}
        exitModule={exitModule}
        tableFilterOptions={companyList}
        tableFilterName={'Company'}
        supportingMethod1={handleFieldChange}
      />
    </>
  );
};

export default Demand;