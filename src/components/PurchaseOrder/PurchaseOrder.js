import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";

const tabArray = ['PO List', 'Add PO']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'poNo', Header: 'PO No.' },
    { accessor: 'poDate', Header: 'PO Date' },
    { accessor: 'poAmount', Header: 'PO Amount' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'poStatus', Header: 'PO Status' }
]

const PurchaseOrder = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', true);
        getCompany();
    }, [])

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
            if (companyResponse.data.data.length == 1) {
                fetchPurchaseOrderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchPurchaseOrderList(1, perPage, e.target.value);
    }

    const fetchPurchaseOrderList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        // setIsLoading(true);
        // let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', listFilter, {
        //     headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        // })

        // if (response.data.status == 200) {
        //     setIsLoading(false);
        //     setListData(response.data.data);
        // } else {
        //     setIsLoading(false);
        //     setListData([])
        // }
    }

    $('[data-rr-ui-event-key*="PO List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', true);
    })

    $('[data-rr-ui-event-key*="Add PO"]').off('click').on('click', function () {

        setActiveTabName("Add Vendor")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add PO"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add PO"]').trigger('click');
        $('#btnSave').attr('disabled', false);
        // dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
    }

    const cancelClick = () => {
        $('[data-rr-ui-event-key*="PO List"]').trigger('click');
    }

    const exitModule = () => {
        window.location.href = '/dashboard';
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
                module="PurchaseOrder"
                // saveDetails={vendorMasterData.encryptedVendorCode ? updateVendorMasterDetails : addVendorMasterDetails}
                newDetails={newDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>

    )
}

export default PurchaseOrder