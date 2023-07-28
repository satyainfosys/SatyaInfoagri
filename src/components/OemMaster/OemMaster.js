import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { formChangedAction, oemMasterDetailsAction, oemMasterDetailsErrAction } from 'actions';
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
        }
    })

    $('[data-rr-ui-event-key*="Add OEM"]').off('click').on('click', function () {
        setActiveTabName("Add OEM")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
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
            localStorage.removeItem("EncryptedOemMastercode")
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

        if (!isValid) {
            var errorObject = {
                oemNameErr,
                oemAddressErr,
                countryCodeErr,
                stateCodeErr
            }
            dispatch(oemMasterDetailsErrAction(errorObject))
        }

        return isValid;
    }

    const clearOemMasterReducers = () => {
        dispatch(oemMasterDetailsErrAction(undefined));
        dispatch(formChangedAction(undefined));
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
                countryCode: oemMasterData.countryCode,
                stateCode: oemMasterData.stateCode,
                activeStatus: oemMasterData.status == null || oemMasterData.status == "Active" ? "A" : "S",
                addUser: localStorage.getItem("LoginUserName")
            }

            const keys = ["oemName", "oemShortName", "oemAddress", "addUser"]
            for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
                requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
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
                        {/* <Button variant="success" onClick={productMasterData.encryptedProductMasterCode ? updateProductMasterDetails : addProductMasterDetails}>Save</Button> */}
                        <Button variant="success" onClick={addOemMasterDetails}>Save</Button>
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
                saveDetails={addOemMasterDetails}
                // saveDetails={productMasterData.encryptedProductMasterCode ? updateProductMasterDetails : addProductMasterDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default OemMaster