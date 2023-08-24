import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { formChangedAction, oemMasterDetailsAction, oemMasterDetailsErrAction, oemProductDetailsAction } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import $ from "jquery";

const tabArray = ['OEM List', 'Add OEM'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'oemMasterCode', Header: 'OEM Code' },
    { accessor: 'oemName', Header: 'OEM Name' },
    { accessor: 'oemShortName', Header: 'OEM Short Name' },
    { accessor: 'oemAddress', Header: 'OEM Address' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'countryName', Header: 'Country' },
    { accessor: 'status', Header: 'Active Status' }
];

const OemMaster = () => {

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [activeTabName, setActiveTabName] = useState();

    const fetchOemMasterList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size
        };

        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/get-oem-master-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                } else {
                    setListData([])
                }
            });
    }

    useEffect(() => {
        fetchOemMasterList(1);
        $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', true);
    }, []);

    const oemMasterDetailsReducer = useSelector((state) => state.rootReducer.oemMasterDetailsReducer)
    var oemMasterData = oemMasterDetailsReducer.oemMasterDetails;

    let oemProductDetailsReducer = useSelector((state) => state.rootReducer.oemProductDetailsReducer)
    let oemProductList = oemProductDetailsReducer.oemProductDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    $('[data-rr-ui-event-key*="OEM List"]').off('click').on('click', function () {
        let isDiscard = $('#btnDiscard').attr('isDiscard');
        if (isDiscard != 'true' && isFormChanged) {
            setModalShow(true);
            setTimeout(function () {
                $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
            }, 50);
        }
        else {
            $("#btnNew").show();
            $("#btnSave").hide();
            $("#btnCancel").hide();
            $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', true);
            clearOemMasterReducers();
            dispatch(oemMasterDetailsAction(undefined));
            localStorage.removeItem("EncryptedOemMasterCode");
            localStorage.removeItem("DeleteOemProductCatalogueCodes");
        }
    })

    $('[data-rr-ui-event-key*="Add OEM"]').off('click').on('click', function () {
        setActiveTabName("Add OEM")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        if (oemProductList.length <= 0 &&
            !(localStorage.getItem("Delete"))) {
            getOemProductCatalogueDetails();
        }
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add OEM"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            $('[data-rr-ui-event-key*="OEM List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        } else {
            window.location.href = '/dashboard';
            clearOemMasterReducers();
            dispatch(oemMasterDetailsAction(undefined));
            localStorage.removeItem("EncryptedOemMastercode");
            localStorage.removeItem("DeleteOemProductCatalogueCodes");
        }

    }

    const discardChanges = () => {
        $('#btnDiscard').attr('isDiscard', 'true');
        if ($('#btnExit').attr('isExit') == 'true')
            window.location.href = '/dashboard';
        else
            $('[data-rr-ui-event-key*="OEM List"]').trigger('click');

        setModalShow(false);
    }

    const oemMasterValidation = () => {
        setModalShow(false);

        const oemNameErr = {};
        const oemAddressErr = {};
        const countryCodeErr = {};
        const stateCodeErr = {};
        const oemProductDetailsErr = {};

        let isValid = true;

        if (!oemMasterData.oemName) {
            oemNameErr.empty = "Enter oem name";
            isValid = false;
            setFormError(true);
        }

        if (!oemMasterData.oemAddress) {
            oemAddressErr.empty = "Enter oem address";
            isValid = false;
            setFormError(true);
        }

        if (!oemMasterData.countryCode) {
            countryCodeErr.empty = "Select country";
            isValid = false;
            setFormError(true);
        }

        if (!oemMasterData.stateCode) {
            stateCodeErr.empty = "Select state";
            isValid = false;
            setFormError(true);
        }

        if (oemProductList && oemProductList.length > 0) {
            oemProductList.forEach((row, index) => {
                if (!row.productCategoryCode || !row.productCode) {
                    oemProductDetailsErr.invalidOemProductDetail = "Fill the required fields"
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (!isValid) {
            var errorObject = {
                oemNameErr,
                oemAddressErr,
                countryCodeErr,
                stateCodeErr,
                oemProductDetailsErr
            }
            dispatch(oemMasterDetailsErrAction(errorObject))
        }

        return isValid;
    }

    const clearOemMasterReducers = () => {
        dispatch(oemMasterDetailsErrAction(undefined));
        dispatch(formChangedAction(undefined));
        dispatch(oemProductDetailsAction([]));
        localStorage.removeItem("DeleteOemProductCatalogueCodes");
    }

    const updateOemMasterCallback = (isAddOemMaster = false) => {
        setModalShow(false);

        if (!isAddOemMaster) {
            toast.success("OEM details updated successfully", {
                theme: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearOemMasterReducers();

        fetchOemMasterList(1);

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

    const addOemMasterDetails = () => {
        if (oemMasterValidation()) {
            const requestData = {
                oemName: oemMasterData.oemName,
                oemShortName: oemMasterData.oemShortName ? oemMasterData.oemShortName : "",
                oemAddress: oemMasterData.oemAddress,
                oemPincode: oemMasterData.oemPincode ? oemMasterData.oemPincode : "",
                oemEmail: oemMasterData.oemEmail ? oemMasterData.oemEmail : "",
                oemContactPerson: oemMasterData.oemContactPerson ? oemMasterData.oemContactPerson : "",
                oemContactMob: oemMasterData.oemContactMob ? oemMasterData.oemContactMob : "",
                oemContactLandline: oemMasterData.oemContactLandline ? oemMasterData.oemContactLandline : "",
                oemWebsite: oemMasterData.oemWebsite ? oemMasterData.oemWebsite : "",
                countryCode: oemMasterData.countryCode,
                stateCode: oemMasterData.stateCode,
                activeStatus: oemMasterData.status == null || oemMasterData.status == "Active" ? "A" : "S",
                oemProductCatalogueDetails: oemProductList,
                addUser: localStorage.getItem("LoginUserName")
            }

            const keys = ["oemName", "oemShortName", "oemAddress", "addUser"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
            }

            const oemProductCatalogueyKeys = ['productVarietyName', 'brandName', 'addUser']
            var index = 0;
            for (var obj in requestData.oemProductCatalogueDetails) {
                var oemProductCatalogueDetailObj = requestData.oemProductCatalogueDetails[obj];

                for (const key of Object.keys(oemProductCatalogueDetailObj).filter((key) => oemProductCatalogueyKeys.includes(key))) {
                    oemProductCatalogueDetailObj[key] = oemProductCatalogueDetailObj[key] ? oemProductCatalogueDetailObj[key].toUpperCase() : '';
                }
                requestData.oemProductCatalogueDetails[index] = oemProductCatalogueDetailObj;
                index++;
            }

            setIsLoading(true);
            axios.post(process.env.REACT_APP_API_URL + '/add-oem-master-detail', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })
                .then(res => {
                    if (res.data.status == 200) {
                        setIsLoading(false)
                        setTimeout(function () {
                            dispatch(oemMasterDetailsAction({
                                ...oemMasterData,
                                encryptedOemMasterCode: res.data.data.encryptedOemMasterCode,
                                oemMasterCode: res.data.data.oemMasterCode
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedOemMasterCode", res.data.data.encryptedOemMasterCode);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateOemMasterCallback(true);
                    } else {
                        setIsLoading(false)
                        toast.error(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        });
                    }
                })
        }
    }

    const updateOemMasterDetails = async () => {
        if (oemMasterValidation()) {
            if (!formChangedData.oemMasterDetailUpdate &&
                !(formChangedData.oemProductDetailDelete || formChangedData.oemProductDetailAdd || formChangedData.oemProductDetailUpdate)) {
                return;
            }

            var deleteOemProductCatalogueCodes = localStorage.getItem("DeleteOemProductCatalogueCodes");

            const updateRequestData = {
                encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
                oemName: oemMasterData.oemName,
                oemShortName: oemMasterData.oemShortName ? oemMasterData.oemShortName : "",
                oemAddress: oemMasterData.oemAddress,
                oemPincode: oemMasterData.oemPincode ? oemMasterData.oemPincode : "",
                oemEmail: oemMasterData.oemEmail ? oemMasterData.oemEmail : "",
                oemContactPerson: oemMasterData.oemContactPerson ? oemMasterData.oemContactPerson : "",
                oemContactMob: oemMasterData.oemContactMob ? oemMasterData.oemContactMob : "",
                oemContactLandline: oemMasterData.oemContactLandline ? oemMasterData.oemContactLandline : "",
                oemWebsite: oemMasterData.oemWebsite ? oemMasterData.oemWebsite : "",
                stateCode: oemMasterData.stateCode,
                countryCode: oemMasterData.countryCode,
                activeStatus: oemMasterData.status == null || oemMasterData.status == "Active" ? "A" : "S",
                modifyUser: localStorage.getItem("LoginUserName"),
            }

            const keys = ['oemName', 'oemShortName', 'oemAddress', 'modifyUser']
            for (const key of Object.keys(updateRequestData).filter((key) => keys.includes(key))) {
                updateRequestData[key] = updateRequestData[key] ? updateRequestData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.oemMasterDetailUpdate) {
                setIsLoading(true)
                await axios.post(process.env.REACT_APP_API_URL + '/update-oem-master-detail', updateRequestData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status !== 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                        }
                    })
            }

            var oemProductCatalogueDetailIndex = 1;

            //OemProductCatalogueDetail ADD, UPDATE, DELETE
            if (!hasError && (formChangedData.oemProductDetailDelete || formChangedData.oemProductDetailAdd || formChangedData.oemProductDetailUpdate)) {

                if (!hasError && formChangedData.oemProductDetailDelete) {
                    var deleteOemProductCatalogueDetailsList = deleteOemProductCatalogueCodes ? deleteOemProductCatalogueCodes.split(',') : null;
                    if (deleteOemProductCatalogueDetailsList) {
                        var deleteOemProductCatalogueDetailsIndex = 1;

                        for (let i = 0; i < deleteOemProductCatalogueDetailsList.length; i++) {
                            const deletePemProductCatalogueDetailCode = deleteOemProductCatalogueDetailsList[i];
                            const data = { encryptedProductVarietyCode: deletePemProductCatalogueDetailCode }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }

                            const deleteResponse = await axios.delete(process.env.REACT_APP_API_URL + '/delete-oem-product-catalogue-details', { headers, data });
                            if (deleteResponse.data.status != 200) {
                                toast.error(deleteResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                            deleteOemProductCatalogueDetailsIndex++
                        }
                    }
                }

                for (let i = 0; i < oemProductList.length; i++) {
                    const oemProductDetail = oemProductList[i];

                    const keys = ['productVarietyName', 'brandName', 'modifyUser', 'addUser']
                    for (const key of Object.keys(oemProductDetail).filter((key) => keys.includes(key))) {
                        oemProductDetail[key] = oemProductDetail[key] ? oemProductDetail[key].toUpperCase() : "";
                    }

                    if (!hasError && formChangedData.oemProductDetailUpdate && oemProductDetail.encryptedProductVarietyCode) {
                        const requestData = {
                            encryptedProductVarietyCode: oemProductDetail.encryptedProductVarietyCode,
                            encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
                            productLineCode: oemProductDetail.productLineCode,
                            productCategoryCode: oemProductDetail.productCategoryCode,
                            productCode: oemProductDetail.productCode,
                            productVarietyName: oemProductDetail.productVarietyName,
                            brandName: oemProductDetail.brandName,
                            productSeasonId: oemProductDetail.productSeasonId ? oemProductDetail.productSeasonId : "",
                            nFrom: oemProductDetail.nFrom ? oemProductDetail.nFrom : "",
                            nTo: oemProductDetail.nTo ? oemProductDetail.nTo : "",
                            pFrom: oemProductDetail.pFrom ? oemProductDetail.pFrom : "",
                            pTo: oemProductDetail.pTo ? oemProductDetail.pTo : "",
                            kFrom: oemProductDetail.kFrom ? oemProductDetail.kFrom : "",
                            kTo: oemProductDetail.kTo ? oemProductDetail.kTo : "",
                            tempFrom: oemProductDetail.tempFrom ? parseFloat(oemProductDetail.tempFrom) : 0,
                            tempTo: oemProductDetail.tempTo ? parseFloat(oemProductDetail.tempTo) : 0,
                            phFrom: oemProductDetail.phFrom ? oemProductDetail.phFrom : "",
                            phTo: oemProductDetail.phTo ? oemProductDetail.phTo : "",
                            maturityDays: oemProductDetail.maturityDays ? parseFloat(oemProductDetail.maturityDays) : 0,
                            maturityUnitCode: oemProductDetail.maturityUnitCode ? parseInt(oemProductDetail.maturityUnitCode) : 0,
                            seedQty: oemProductDetail.seedQty ? parseInt(oemProductDetail.seedQty) : 0,
                            seedUnitCode: oemProductDetail.seedUnitCode ? parseInt(oemProductDetail.seedUnitCode) : 0,
                            yieldLand: oemProductDetail.yieldLand ? parseFloat(oemProductDetail.yieldLand) : 0,
                            area: oemProductDetail.area && oemProductDetail.area == "Plain" ? "P" : oemProductDetail.area = "Hill" ? "H" : "",
                            sowing: oemProductDetail.sowing && oemProductDetail.sowing == "Early" ? "E" : oemProductDetail.sowing = "Late" ? "L" : "",
                            orgIng: oemProductDetail.orgIng && oemProductDetail.orgIng == "Organic" ? "O" : oemProductDetail.orgIng = "Inorganic" ? "I" : "",
                            desiHyb: oemProductDetail.desiHyb && oemProductDetail.desiHyb == "Desi" ? "D" : oemProductDetail.desiHyb = "Hybrid" ? "H" : "",
                            perishableDays: oemProductDetail.perishableDays ? parseInt(oemProductDetail.perishableDays) : 0,
                            landUnitCode: oemProductDetail.landUnitCode ? parseInt(oemProductDetail.landUnitCode) : 0,
                            yieldOutput: oemProductDetail.yieldOutput ? parseFloat(oemProductDetail.yieldOutput) : 0,
                            yieldUnitCode: oemProductDetail.yieldUnitCode ? parseInt(oemProductDetail.yieldUnitCode) : 0,
                            ecFrom: oemProductDetail.ecFrom ? oemProductDetail.ecFrom : "",
                            ecTo: oemProductDetail.ecTo ? oemProductDetail.ecTo : "",
                            organicCarbonFrom: oemProductDetail.organicCarbonFrom ? oemProductDetail.organicCarbonFrom : "",
                            organicCarbonTo: oemProductDetail.organicCarbonTo ? oemProductDetail.organicCarbonTo : "",
                            sulphurFrom: oemProductDetail.sulphurFrom ? oemProductDetail.sulphurFrom : "",
                            sulphurTo: oemProductDetail.sulphurTo ? oemProductDetail.sulphurTo : "",
                            ironFrom: oemProductDetail.ironFrom ? oemProductDetail.ironFrom : "",
                            ironTo: oemProductDetail.ironTo ? oemProductDetail.ironTo : "",
                            zincFrom: oemProductDetail.zincFrom ? oemProductDetail.zincFrom : "",
                            zincTo: oemProductDetail.zincTo ? oemProductDetail.zincTo : "",
                            copperFrom: oemProductDetail.copperFrom ? oemProductDetail.copperFrom : "",
                            copperTo: oemProductDetail.copperTo ? oemProductDetail.copperTo : "",
                            boronFrom: oemProductDetail.boronFrom ? oemProductDetail.boronFrom : "",
                            boronTo: oemProductDetail.boronTo ? oemProductDetail.boronTo : "",
                            manganeseFrom: oemProductDetail.manganeseFrom ? oemProductDetail.manganeseFrom : "",
                            manganeseTo: oemProductDetail.manganeseTo ? oemProductDetail.manganeseTo : "",
                            activeStatus: !oemProductDetail.activeStatus || oemProductDetail.activeStatus == "Active" ? "A" : "S",
                            modifyUser: localStorage.getItem("LoginUserName")
                        }
                        setIsLoading(true);
                        const updateResponse = await axios.post(process.env.REACT_APP_API_URL + '/update-oem-product-catalogue-details', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (updateResponse.data.status != 200) {
                            toast.error(updateResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    else if (!hasError && formChangedData.oemProductDetailAdd && !oemProductDetail.encryptedProductVarietyCode) {
                        const requestData = {
                            encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                            encryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode"),
                            productLineCode: oemProductDetail.productLineCode,
                            productCategoryCode: oemProductDetail.productCategoryCode,
                            productCode: oemProductDetail.productCode,
                            productVarietyName: oemProductDetail.productVarietyName,
                            brandName: oemProductDetail.brandName,
                            productSeasonId: oemProductDetail.productSeasonId ? oemProductDetail.productSeasonId : "",
                            nFrom: oemProductDetail.nFrom ? oemProductDetail.nFrom : "",
                            nTo: oemProductDetail.nTo ? oemProductDetail.nTo : "",
                            pFrom: oemProductDetail.pFrom ? oemProductDetail.pFrom : "",
                            pTo: oemProductDetail.pTo ? oemProductDetail.pTo : "",
                            kFrom: oemProductDetail.kFrom ? oemProductDetail.kFrom : "",
                            kTo: oemProductDetail.kTo ? oemProductDetail.kTo : "",
                            tempFrom: oemProductDetail.tempFrom ? oemProductDetail.tempFrom : "",
                            tempTo: oemProductDetail.tempTo ? oemProductDetail.tempTo : "",
                            phFrom: oemProductDetail.phFrom ? oemProductDetail.phFrom : "",
                            phTo: oemProductDetail.phTo ? oemProductDetail.phTo : "",
                            maturityDays: oemProductDetail.maturityDays ? oemProductDetail.maturityDays : "",
                            maturityUnitCode: oemProductDetail.maturityUnitCode ? oemProductDetail.maturityUnitCode : "",
                            seedQty: oemProductDetail.seedQty ? oemProductDetail.seedQty : "",
                            seedUnitCode: oemProductDetail.seedUnitCode ? oemProductDetail.seedUnitCode : "",
                            yieldLand: oemProductDetail.yieldLand ? oemProductDetail.yieldLand : "",
                            area: oemProductDetail.area ? oemProductDetail.area : "",
                            sowing: oemProductDetail.sowing ? oemProductDetail.sowing : "",
                            orgIng: oemProductDetail.orgIng ? oemProductDetail.orgIng : "",
                            desiHyb: oemProductDetail.desiHyb ? oemProductDetail.desiHyb : "",
                            perishableDays: oemProductDetail.perishableDays ? oemProductDetail.perishableDays : "",
                            landUnitCode: oemProductDetail.landUnitCode ? oemProductDetail.landUnitCode : "",
                            yieldOutput: oemProductDetail.yieldOutput ? oemProductDetail.yieldOutput : "",
                            yieldUnitCode: oemProductDetail.yieldUnitCode ? oemProductDetail.yieldUnitCode : "",
                            ecFrom: oemProductDetail.ecFrom ? oemProductDetail.ecFrom : "",
                            ecTo: oemProductDetail.ecTo ? oemProductDetail.ecTo : "",
                            organicCarbonFrom: oemProductDetail.organicCarbonFrom ? oemProductDetail.organicCarbonFrom : "",
                            organicCarbonTo: oemProductDetail.organicCarbonTo ? oemProductDetail.organicCarbonTo : "",
                            sulphurFrom: oemProductDetail.sulphurFrom ? oemProductDetail.sulphurFrom : "",
                            sulphurTo: oemProductDetail.sulphurTo ? oemProductDetail.sulphurTo : "",
                            ironFrom: oemProductDetail.ironFrom ? oemProductDetail.ironFrom : "",
                            ironTo: oemProductDetail.ironTo ? oemProductDetail.ironTo : "",
                            zincFrom: oemProductDetail.zincFrom ? oemProductDetail.zincFrom : "",
                            zincTo: oemProductDetail.zincTo ? oemProductDetail.zincTo : "",
                            copperFrom: oemProductDetail.copperFrom ? oemProductDetail.copperFrom : "",
                            copperTo: oemProductDetail.copperTo ? oemProductDetail.copperTo : "",
                            boronFrom: oemProductDetail.boronFrom ? oemProductDetail.boronFrom : "",
                            boronTo: oemProductDetail.boronTo ? oemProductDetail.boronTo : "",
                            manganeseFrom: oemProductDetail.manganeseFrom ? oemProductDetail.manganeseFrom : "",
                            manganeseTo: oemProductDetail.manganeseTo ? oemProductDetail.manganeseTo : "",
                            addUser: localStorage.getItem("LoginUserName"),
                            activeStatus: oemProductDetail.activeStatus
                        }
                        setIsLoading(true);
                        const addResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-oem-product-catalogue-details', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (addResponse.data.status != 200) {
                            toast.error(addResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    oemProductCatalogueDetailIndex++
                }
            }

            if (!hasError) {
                clearOemMasterReducers();
                updateOemMasterCallback();
            }
        }
    }

    const getOemProductCatalogueDetails = async () => {
        const request = {
            EncryptedOemMasterCode: localStorage.getItem("EncryptedOemMasterCode")
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-oem-product-catalogue-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (response.data.status == 200) {
            if (response.data.data && response.data.data.length > 0) {
                dispatch(oemProductDetailsAction(response.data.data));
            }
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

            {modalShow &&
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Do you want to save changes?</h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={oemMasterData.encryptedOemMasterCode ? updateOemMasterDetails : addOemMasterDetails}>Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="OemMaster"
                newDetails={newDetails}
                saveDetails={oemMasterData.encryptedOemMasterCode ? updateOemMasterDetails : addOemMasterDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default OemMaster