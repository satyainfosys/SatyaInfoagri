import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';

const tabArray = ['Distribution List', 'Add New Distribution'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'distributionCode', Header: 'Distribution Code' },
    { accessor: 'distributionName', Header: 'Distribution Name' },
    { accessor: 'fpcCode', Header: 'FPC Code' },
    { accessor: 'stateCode', Header: 'State Code' },
    { accessor: 'processingUnit', Header: 'Processing Unit' },
    { accessor: 'coldStorage', Header: 'Cold Storage' },
    { accessor: 'status', Header: 'Status' }
];

export const DistributionCentre = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', true);
        getCompany();
    }, []);

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add New Distribution"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    $('[data-rr-ui-event-key*="Add New Distribution"]').off('click').on('click', function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    });

    $('[data-rr-ui-event-key*="Distribution List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add New Distribution"]').attr('disabled', true);
    })

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
        fetchDistributionCentreList(e.target.value);
    }

    const fetchDistributionCentreList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            EncryptedCompanyCode: encryptedCompanyCode
        };

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })

        if (response.data.status == 200) {
            setIsLoading(false);
            setListData(res.data.data);
        } else {
            setIsLoading(false);
            setListData([])
        }
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
                module="DistributionCentre"
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

export default DistributionCentre