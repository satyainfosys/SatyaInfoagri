import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const tabArray = ['OEM List', 'Add OEM'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'oemCode', Header: 'OEM Code' },
    { accessor: 'oemName', Header: 'OEM Name' },
    { accessor: 'oemShortName', Header: 'OEM Short Name' },
    { accessor: 'oemAddress', Header: 'OEM Address' },
    { accessor: 'stateName', Header: 'State' },
    { accessor: 'countryName', Header: 'Country' },
    { accessor: 'status', Header: 'Active Status' }
];

const OemMaster = () => {

    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);

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


    $('[data-rr-ui-event-key*="OEM List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', true);
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add OEM"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add OEM"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        $('[data-rr-ui-event-key*="OEM List"]').trigger('click');
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
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
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="OemMaster"
                newDetails={newDetails}
                // saveDetails={productMasterData.encryptedProductMasterCode ? updateProductMasterDetails : addProductMasterDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default OemMaster