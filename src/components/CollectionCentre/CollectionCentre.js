import React, { useEffect, useState } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';

const tabArray = ['Collection Centre List', 'Add Collection Centre', 'Add FIGs'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'collectionCentreCode', Header: 'Collection Centre Code' },
    { accessor: 'collectionCentreName', Header: 'Collection Centre Name' },
    { accessor: 'fpcCode', Header: 'FPC Code' },
    { accessor: 'stateCode', Header: 'State Code' },
    { accessor: 'ccType', Header: 'CC Type' },
    { accessor: 'status', Header: 'Status' }
];

export const CollectionCentre = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', true);
        getCompany();
    }, []);

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Collection Centre"]').trigger('click');
        $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', false);
        $('#btnSave').attr('disabled', false);
    }

    $('[data-rr-ui-event-key*="Add Collection Centre"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    });

    $('[data-rr-ui-event-key*="Collection Centre List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Collection Centre"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Add FIGs"]').attr('disabled', true);
    })

    $('[data-rr-ui-event-key*="Add FIGs"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    });

    const getCompany = async () => {
        let companyData = [];
        const companyRequest = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (companyResponse.data.status == 200) {
            if (companyResponse.data && companyResponse.data.data.length > 0) {
                companyResponse.data.data.forEach(company => {
                    companyData.push({
                        key: company.companyName,
                        value: company.encryptedCompanyCode,
                        label: company.companyName
                    })
                })
            }
            setCompanyList(companyData)
        } else {
            setCompanyList([])
        }
    }

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

            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="CollectionCentre"
                // saveDetails={(clientData.encryptedClientCode || localStorage.getItem("EncryptedResponseClientCode")) ? updateClientDetails : addClientDetails}
                newDetails={newDetails}
                // cancelClick={cancelClick}
                // exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>
    )
}

export default CollectionCentre