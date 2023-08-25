import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { tabInfoAction, vendorProductCatalogueDetailsAction } from 'actions';

const tabArray = ['Vendor List', 'Add Vendor']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'vendorName', Header: 'Name' },
    { accessor: 'vendorType', Header: 'Type' },
    { accessor: 'vendorRating', Header: 'Rating' },
    { accessor: 'vendorAddress', Header: 'Address' },
    { accessor: 'vendorPincode', Header: 'Pincode' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'countryName', Header: 'Country' },
    { accessor: 'status', Header: 'Status' }
]

const VendorMaster = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', true);
        getCompany();
    }, [])

    const vendorMasterDetailsReducer = useSelector((state) => state.rootReducer.vendorMasterDetailsReducer)
    var vendorMasterData = vendorMasterDetailsReducer.vendorMasterDetails;

    let vendorProductCatalogueDetailsReducer = useSelector((state) => state.rootReducer.vendorProductCatalogueDetailsReducer)
    let vendorProductCatalogueList = vendorProductCatalogueDetailsReducer.vendorProductCatalogueDetails;

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
                fetchDistributionCentreList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
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
        fetchVendorMasterList(1, perPage, e.target.value);
    }

    const fetchVendorMasterList = async (page, size = perPage, encryptedCompanyCode) => {

        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })

        if (response.data.status == 200) {
            setIsLoading(false);
            setListData(response.data.data);
        } else {
            setIsLoading(false);
            setListData([])
        }
    }

    $('[data-rr-ui-event-key*="Vendor List"]').off('click').on('click', function () {        
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', true);
        dispatch(vendorProductCatalogueDetailsAction([]));
    })

    $('[data-rr-ui-event-key*="Add Vendor"]').off('click').on('click', function () {
        setActiveTabName("Add Vendor")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (vendorProductCatalogueList.length <= 0) {
            getVendorProductCatalogueList();
        }
    })  

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Vendor"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Vendor"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        $('[data-rr-ui-event-key*="Vendor List"]').trigger('click');
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        window.location.href = '/dashboard';
    }

    // const discardChanges = () => {
    //     $('#btnDiscard').attr('isDiscard', 'true');
    //     if ($('#btnExit').attr('isExit') == 'true')
    //         window.location.href = '/dashboard';
    //     else {
    //         $('[data-rr-ui-event-key*="Vendor List"]').trigger('click');
    //     }

    //     setModalShow(false);
    // }

    const getVendorProductCatalogueList = async () => {
        const request = {
            EncryptedVendorCode: localStorage.getItem("EncryptedVendorCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-product-catalogue-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(vendorProductCatalogueDetailsAction(response.data.data));
            }
        }
    }

    return (
        <TabPage
            listData={listData}
            listColumnArray={listColumnArray}
            tabArray={tabArray}
            module="VendorMaster"
            // saveDetails={distirbutionCentreData.encryptedDistributionCentreCode ? updateDistributionCentreDetails : addDistributionCentreDetails}
            newDetails={newDetails}
            cancelClick={cancelClick}
            exitModule={exitModule}
            tableFilterOptions={companyList}
            tableFilterName={'Company'}
            supportingMethod1={handleFieldChange}
        />
    )
}

export default VendorMaster