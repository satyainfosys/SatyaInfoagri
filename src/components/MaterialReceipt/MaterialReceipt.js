import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import $ from "jquery";
import { toast } from 'react-toastify';
import Moment from "moment";

const tabArray = ["Material List", "Add Material"]

const listColumnArray = [
    { accessor: 's1', Header: 'S.No' },
    { accessor: 'materialReceiptId', Header: 'Material Receipt No' },
    { accessor: 'vendorName', Header: 'Vendor Name' },
    { accessor: 'materialReceiptDate', Header: 'Delivery Date' },
    { accessor: 'personName', Header: 'Person Name' },
]

const MaterialReceipt = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [activeTabName, setActiveTabName] = useState();
    const [formHasError, setFormError] = useState(false);

    useEffect(() => {
        $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
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
    }

    const fetchMaterialReceiptHeaderList = async (page, size = perPage, encryptedCompanyCode) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size,
            EncryptedCompanyCode: encryptedCompanyCode
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

    $('[data-rr-ui-event-key*="PO List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Material"]').attr('disabled', true);
    })

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
                module="MaterialReceipt"
                // saveDetails={purchaseOrderData.encryptedPoNo ? updatePurchaseOrderDetails : addPurchaseOrderDetails}
                // newDetails={newDetails}
                // cancelClick={cancelClick}
                // exitModule={exitModule}
                tableFilterOptions={companyList}
                tableFilterName={'Company'}
                supportingMethod1={handleFieldChange}
            />
        </>
    )
}

export default MaterialReceipt