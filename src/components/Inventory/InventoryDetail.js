import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TabPage from 'components/common/TabPage';
import { Spinner, Modal, Button } from 'react-bootstrap';

const tabArray = ['Inventory Dashboard'];

export const InventoryDetail = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        $("#btnNew").hide();
    }, [])

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
                tabArray={tabArray}
                module='InventoryDetail'
                exitModule={exitModule}
            />
        </>
    )
}

export default InventoryDetail;