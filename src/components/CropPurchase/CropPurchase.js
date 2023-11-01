import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { tabInfoAction } from 'actions';
import { toast } from 'react-toastify';

const tabArray = ['Crop Purchase List', 'Add Crop Purchase']

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'materialReceiptId', Header: 'Material Receipt No' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'materialReceiptDate', Header: 'Delivery Date' },
    { accessor: 'personName', Header: 'Person Name' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Farmer Father Name' },
    { accessor: 'farmerPhoneNumber', Header: 'Farmer Phone Name' },
]

const CropPurchase = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
        localStorage.removeItem("EncryptedMaterialReceiptId");
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
                fetchMaterialReceiptHeaderList(1, perPage, companyResponse.data.data[0].encryptedCompanyCode);
                // getVendorMasterList(companyResponse.data.data[0].encryptedCompanyCode)
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
        fetchMaterialReceiptHeaderList(1, perPage, e.target.value);
        // getVendorMasterList(e.target.value);
    }

    const fetchMaterialReceiptHeaderList = async (page, size = perPage, encryptedCompanyCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode,
            IsCropPurchase: true
        }

        setIsLoading(true);
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-header-list', listFilter, {
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

    $('[data-rr-ui-event-key*="Crop Purchase List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', true);
    })

    $('[data-rr-ui-event-key*="Add Crop Purchase"]').off('click').on('click', function () {
        setActiveTabName("Add Crop Purchase")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        if (localStorage.getItem("EncryptedCompanyCode")) {
            $('[data-rr-ui-event-key*="Add Crop Purchase"]').attr('disabled', false);
            $('[data-rr-ui-event-key*="Add Crop Purchase"]').trigger('click');
            $('#btnSave').attr('disabled', false);
            dispatch(tabInfoAction({ title1: `${localStorage.getItem("CompanyName")}` }))
        } else {
            toast.error("Please select company first", {
                theme: 'colored',
                autoClose: 5000
            });
        }
    }


    return (
        <>
            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="CropPurchase"
                // saveDetails={materialReceiptHeaderData.encryptedMaterialReceiptId ? updateMaterialReceiptDetails : addMaterialReceiptDetails}
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

export default CropPurchase