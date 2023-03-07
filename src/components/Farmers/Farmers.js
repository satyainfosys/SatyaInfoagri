import React, { useState, useEffect } from 'react';
import TabPage from 'components/common/TabPage';
import axios from 'axios';

const tabArray = ['Farmers', 'Add Farmer', 'Family', 'Bank', 'Land', 'Cattle', 'Documents', 'Events', 'Mkt SMS'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'cardNo', Header: 'Card No' },
    { accessor: 'farmerName', Header: 'Farmer Name' },
    { accessor: 'farmerFatherName', Header: 'Father Name' },
    { accessor: 'village', Header: 'Village' },
    { accessor: 'districtCode', Header: 'District Code' },
    { accessor: 'figCode', Header: 'FIG Code' },
    { accessor: 'mobile', Header: 'Mobile' },
    { accessor: 'user', Header: 'User' },
    { accessor: 'approvalStatus', Header: 'Approval Status' }
];

export const Farmers = () => {

    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFarmersList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size
        };

        setIsLoading(true);
        await axios
            .post(process.env.REACT_APP_API_URL + '/farmer-list', listFilter, {
                headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
            })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                }
            });
    };

    useEffect(() => {
        fetchFarmersList(1);
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', true);
    }, []);

    $('[data-rr-ui-event-key*="Add Farmer"]').click(function () {
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Farmer"]').trigger('click');
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', false);
        $('#btnSave').attr('disabled', false);        
    }

    $('[data-rr-ui-event-key*="Farmers"]').click(function () {
        $('#btnExit').attr('isExit', 'false');
        

        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Farmer"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Family"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Bank"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Land"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Cattle"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Documents"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Events"]').attr('disabled', true);
        $('[data-rr-ui-event-key*="Mkt SMS"]').attr('disabled', true);  
    })

    return (
        <>
            <TabPage
                listData={listData}
                listColumnArray={listColumnArray}
                tabArray={tabArray}
                module="Farmers"
                newDetails={newDetails}
            />
        </>
    )
}

export default Farmers
