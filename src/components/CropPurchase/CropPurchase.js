import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { formChangedAction, materialReceiptDetailsAction, tabInfoAction, vendorMasterDetailsAction, vendorMasterDetailsListAction } from 'actions';
import { toast } from 'react-toastify';
import materialReceiptErrorReducer from 'reducers/materialReceiptErrorReducer';

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
                getVendorMasterList(companyResponse.data.data[0].encryptedCompanyCode)
                localStorage.setItem("CompanyName", companyResponse.data.data[0].companyName)
                localStorage.setItem("EncryptedCompanyCode", companyResponse.data.data[0].encryptedCompanyCode);
            }
        } else {
            setCompanyList([])
        }
    }

    const getVendorMasterList = async () => {
        const requestData = {
            pageNumber: 1,
            pageSize: 1,
            EncryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-vendor-master-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                dispatch(vendorMasterDetailsListAction(response.data.data))
            }
        } else {
            dispatch(vendorMasterDetailsListAction([]))
        }
    }

    const handleFieldChange = e => {
        localStorage.setItem("EncryptedCompanyCode", e.target.value);
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedKey = selectedOption.dataset.key || selectedOption.label;
        localStorage.setItem("CompanyName", selectedKey)
        fetchMaterialReceiptHeaderList(1, perPage, e.target.value);
        getVendorMasterList(e.target.value);
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

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            dispatch(materialReceiptHeaderDetailsAction(undefined));
            dispatch(vendorMasterDetailsListAction([]));
            // localStorage.removeItem("EncryptedMaterialReceiptId");
            // localStorage.removeItem("EncryptedCompanyCode");
            // localStorage.removeItem("CompanyName");
            // localStorage.removeItem("DeleteMaterialReceiptDetailIds");
        }
    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else {
            $('[data-rr-ui-event-key*="Crop Purchase List"]').trigger('click');
        }

        // setModalShow(false);
    }

    // const getMaterialReceiptDetailList = async () => {
    //     const request = {
    //         encryptedMaterialReceiptId: localStorage.getItem("EncryptedMaterialReceiptId")
    //     }

    //     let response = await axios.post(process.env.REACT_APP_API_URL + '/get-material-receipt-detail-list', request, {
    //         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
    //     })

    //     if (response.data.status == 200) {
    //         if (response.data.data && response.data.data.length > 0) {
    //             dispatch(materialReceiptDetailsAction(response.data.data));
    //         }
    //     }
    // }

    const clearMaterialReceiptReducers = () => {
        dispatch(formChangedAction(undefined));
        dispatch(materialReceiptDetailsAction([]));
        // dispatch(materialReceiptErrorAction(undefined));
        localStorage.removeItem("DeleteMaterialReceiptDetailIds");
    }

    const cropPurchaseValidation = () => {
        // setModalShow(false);

        const vendorErr = {};
        const materialReceiptDetailErr = {};

        let isValid = true;

        if (!materialReceiptHeaderData.farmerCode) {
            toast.error("Select Farmer", {
                theme: 'colored'
            });

            isValid = false;
        }

        if (!materialReceiptHeaderData.vendorCode) {
            vendorErr.empty = "Select vendor";
            isValid = false;
        }

        if (materialReceiptList.length < 1) {
            materialReceiptDetailErr.materialReceiptDetailEmpty = "At least one material details required";
            setTimeout(() => {
                toast.error(materialReceiptDetailErr.materialReceiptDetailEmpty, {
                    theme: 'colored'
                });
            }, 1000);
            isValid = false;
        }
        else if (materialReceiptList && materialReceiptList.length > 0) {
            materialReceiptList.forEach((row, index) => {
                if (!row.productLineCode || !row.productCategoryCode || !row.productCode || !row.receivedQuantity) {
                    materialReceiptDetailErr.invalidMaterialReceiptDetail = "Fill the required fields"
                    isValid = false;
                } else if (!row.poDetailId) {
                    if (!row.rate || !row.amount) {
                        materialReceiptDetailErr.invalidMaterialReceiptDetail = "Fill the required fields"
                        isValid = false;
                    }
                }
            })
        }

        if (!isValid) {
            var errorObject = {
                vendorErr,
                materialReceiptDetailErr
            }

            dispatch(materialReceiptErrorReducer(errorObject))
        }

        return isValid;
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