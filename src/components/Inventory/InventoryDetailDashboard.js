import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Row, Button, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import Moment from "moment";
import { toast } from 'react-toastify';
import TablePagination from 'components/common/TablePagination';

export const InventoryDetailDashboard = () => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [inventoryDetailList, setInventoryDetailList] = useState([]);
    const [productCategoryList, setProductCategoryList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [distributionCentreList, setDistributionCentreList] = useState([]);
    const [companyMasterList, setCompanyMasterList] = useState([]);
    const [collectionCentreList, setCollectionCentreList] = useState([]);
    const [companyName, setCompanyName] = useState();
    const [distributionMasterList, setDistributionMasterList] = useState([]);
    let pageCount = Math.ceil(inventoryCount / pageSize);

    const [mergedInventoryDetailList, setMergedInventoryDetailList] = useState([]);
    let isSearch = false;

    const [formData, setFormData] = useState({
        companyCode: localStorage.getItem('CompanyCode') ? localStorage.getItem('CompanyCode') : "",
        startDate: null,
        endDate: null,
        productCategoryCode: "",
        searchText: ""
    });
    const isPreviousDisabled = pageNumber === 1;
    const isNextDisabled = pageNumber === pageCount;

    useEffect(() => {
        if (companyList.length <= 0)
            getCompany();
        if (productCategoryList.length <= 0)
            fetchProductCategoryList();

        if (inventoryDetailList && inventoryDetailList.length > 0) {
            const mergedList = mergeRowsByProductLineName(inventoryDetailList);
            setMergedInventoryDetailList(mergedList);
        }
        if (localStorage.getItem("CompanyCode")) {
            fetchDistributionCentreList(localStorage.getItem("CompanyCode"))
        }
        if (localStorage.getItem("DistributionCenterCode")) {
            fetchCollectionCentreList(localStorage.getItem("DistributionCenterCode"))
        }
    }, [inventoryDetailList])

    const getCompany = async () => {
        let companyData = [];
        const companyRequest = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
        }

        let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        });

        if (companyResponse.data.status == 200) {
            setCompanyMasterList(companyResponse.data.data);
            if (companyResponse.data && companyResponse.data.data.length > 0) {
                if (localStorage.getItem('CompanyCode')) {
                    var companyDetail = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
                    setCompanyName(companyDetail.companyName);
                }
                if (localStorage.getItem('CompanyCode')) {
                    var companyDetails = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'));
                    companyData.push({
                        key: companyDetails.companyName,
                        value: companyDetails.encryptedCompanyCode,
                        label: companyDetails.companyName
                    })
                    setCompanyList(companyData);
                }
                else {
                    companyResponse.data.data.forEach(company => {
                        companyData.push({
                            key: company.companyName,
                            value: company.encryptedCompanyCode,
                            label: company.companyName
                        })
                    })
                    setCompanyList(companyData)
                }
            }
        } else {
            setCompanyList([])
        }
    }

    const fetchDistributionCentreList = async (CompanyCode) => {
        const request = {
            EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
            CompanyCode: CompanyCode
        }
        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-distribution-centre-list', request, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let distributionCentreListData = [];
        if (response.data.status == 200) {
            setDistributionMasterList(response.data.data);
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(distributionCentre => {
                    distributionCentreListData.push({
                        key: distributionCentre.distributionName,
                        value: distributionCentre.distributionCentreCode
                    })
                })
            }
            setDistributionCentreList(distributionCentreListData)
        }
        else {
            setDistributionCentreList([]);
        }
    }

    const fetchCollectionCentreList = async (distributionCentreCode) => {
        const requestData = {
            CompanyCode: formData.companyCode ? formData.companyCode : localStorage.getItem("CompanyCode"),
            DistributionCode: distributionCentreCode
        }

        let response = await axios.post(process.env.REACT_APP_API_URL + '/get-collection-centre-list', requestData, {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })
        let collectionCentreData = [];
        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(collectionCentre => {
                    collectionCentreData.push({
                        key: collectionCentre.collectionCentreName,
                        value: collectionCentre.collectionCentreCode
                    })
                })
            }
            setCollectionCentreList(collectionCentreData);
        }
        else {
            setCollectionCentreList([]);
        }
    }

    const fetchProductCategoryList = async () => {

        let productCategoryData = [];
        let productCategoryResponse = await axios.get(process.env.REACT_APP_API_URL + '/product-category-master-list', {
            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
        })

        if (productCategoryResponse.data.status == 200) {
            if (productCategoryResponse.data && productCategoryResponse.data.data.length > 0) {
                productCategoryResponse.data.data.forEach(productCategory => {
                    productCategoryData.push({
                        key: productCategory.productCategoryName,
                        value: productCategory.productCategoryCode
                    })
                })
            }
            setProductCategoryList(productCategoryData);
        } else {
            setProductCategoryList([]);
        }
    }

    const handleFieldChange = e => {
        if (e.target.name === 'companyCode' && e.target.value) {
            var companyDetail = companyMasterList.find(company => company.encryptedCompanyCode == e.target.value);
            setCollectionCentreList([]);
            setFormData({
                ...formData,
                [e.target.name]: companyDetail.companyCode,
                encryptedCompanyCode: companyDetail.encryptedCompanyCode,
                distributionCentreCode: null,
                collectionCentreCode: null,
            })
            setDistributionCentreList([]);
            setCollectionCentreList([]);
            e.target.value && fetchDistributionCentreList(companyDetail.companyCode);
        }
        else if (e.target.name === 'distributionCentreCode' && e.target.value) {
            var distributionDetail = distributionMasterList.find(distribution => distribution.distributionCentreCode == e.target.value);
            setCollectionCentreList([]);
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
                collectionCentreCode: null
            })
            e.target.value && fetchCollectionCentreList(distributionDetail.distributionCentreCode);
        }
        else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            })
        }
        if (e.target.value) {
            isSearch = true;
            setPageNumber(1);
        }
    }

    const validateSearchClick = () => {
        let isValid = true

        if (!formData.companyCode) {
            toast.error("Select company", {
                theme: 'colored'
            });
            isValid = false;
            setInventoryDetailList([]);
            setMergedInventoryDetailList([]);
            setInventoryCount(0);
        }

        if (formData.startDate && !formData.endDate) {
            toast.error("Select To Date", {
                theme: 'colored'
            });
            isValid = false;
        }
        else if (formData.endDate && !formData.startDate) {
            toast.error("Select From Date", {
                theme: 'colored'
            });
            isValid = false;
        }
        else if (formData.startDate > formData.endDate || formData.endDate < formData.startDate) {
            toast.error("From Date cannot be greater than To Date", {
                theme: 'colored'
            });
            isValid = false;
        }

        return isValid;
    }

    const fetchInventoryDetailList = async (companyCode, isNull = false, newPageNumber, newPageSize) => {
        if (validateSearchClick(isNull, companyCode)) {
            let requestData = {
                EncryptedClientCode: localStorage.getItem("EncryptedClientCode"),
                CompanyCode: companyCode ? companyCode : formData.companyCode ? formData.companyCode : localStorage.getItem("CompanyCode"),
                StartDate: formData.startDate ? Moment(formData.startDate).format("YYYY-MM-DD") : null,
                EndDate: formData.endDate ? Moment(formData.endDate).format("YYYY-MM-DD") : null,
                ProductCategoryCode: formData.productCategoryCode ? formData.productCategoryCode : "",
                DistributionCenterCode: localStorage.getItem('DistributionCenterCode') ? localStorage.getItem('DistributionCenterCode') : formData.distributionCentreCode,
                CollectionCenterCode: localStorage.getItem('CollectionCentreCode') ? localStorage.getItem('CollectionCentreCode') :  formData.collectionCentreCode,
                SearchText: formData.searchText,
                PageNumber: isSearch || newPageSize ? 1 : newPageNumber ? newPageNumber : pageNumber,
                PageSize: newPageSize ? newPageSize : pageSize
            }

            let response = await axios.post(process.env.REACT_APP_API_URL + '/get-inventory-detail-list', requestData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
            })

            if (response.data.status == 200) {
                if (response.data && response.data.data.inventoryList.length > 0) {
                    setInventoryDetailList(response.data.data.inventoryList)
                    setInventoryCount(response.data.data.inventoryCount)
                }
            }
            else {
                setInventoryDetailList([]);
                setMergedInventoryDetailList([]);
                setTimeout(function () {
                    $('#no-inventory-message').html('No records found!');
                }, 500)
            }
        }
        else {
            setInventoryDetailList([]);
            setMergedInventoryDetailList([]);
        }
    }

    const mergeRowsByProductLineName = (list) => {
        const groupedByProductLineAndCategory = {};

        list.forEach((item) => {
            const key = `${item.productLineName}_${item.productCategoryName}`;

            if (!groupedByProductLineAndCategory[key]) {
                groupedByProductLineAndCategory[key] = [item];
            } else {
                groupedByProductLineAndCategory[key].push(item);
            }
        });

        const mergedList = Object.values(groupedByProductLineAndCategory);

        return mergedList;
    };

    const onPageClick = async ({ selected }) => {
        setPageNumber(selected + 1);
        isSearch = false;
        fetchInventoryDetailList(formData.companyCode, false, selected + 1)
    }

    const handlePageSize = async (e) => {
        setPageSize(e.target.value);
        setPageNumber(1);
        isSearch = false;
        fetchInventoryDetailList(formData.companyCode, false, 1, e.target.value)
    }

    const handlePreviousClick = async () => {
        setPageNumber(pageNumber - 1);
        isSearch = false;
        fetchInventoryDetailList(formData.companyCode, false, pageNumber - 1)
    }

    const handleNextClick = async () => {
        setPageNumber(pageNumber + 1);
        isSearch = false;
        fetchInventoryDetailList(formData.companyCode, false, pageNumber + 1)
    }

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            <Form className="details-form" id="InventoryDetailDashboard">
                <Row className='mb-1 ms-2 justify-content-left'>
                    <Form.Label column className='col-auto'>
                        Company<span className="text-danger">*</span>
                    </Form.Label>
                    <Col className='col-auto'>
                        {
                            localStorage.getItem('CompanyCode') ?
                                <Form.Control id="txtCompanyCode" name="companyCode" value={companyName} disabled />
                                :
                                <Form.Select id="txtCompanyCode" name="companyCode" onChange={handleFieldChange} value={formData.encryptedCompanyCode}>
                                    <option value=''>Select</option>
                                    {companyList.map((option, index) => (
                                        <option key={index} value={option.value}>{option.key}</option>
                                    ))}
                                </Form.Select>
                        }
                    </Col>
                    <Form.Label column className='col-auto'>Distribution Centre</Form.Label>
                    <Col className='col-2'>
                        <Form.Select id="txtDistributionCentreCode" name="distributionCentreCode" value={localStorage.getItem("DistributionCenterCode") ? localStorage.getItem("DistributionCenterCode") : formData.distributionCentreCode} onChange={handleFieldChange} disabled={localStorage.getItem("DistributionCenterCode")}
                        >
                            <option value=''>Select</option>
                            {distributionCentreList.map((option, index) => (
                                <option key={index} value={option.value}>{option.key}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Form.Label column className='col-auto'>Collection Centre</Form.Label>
                    <Col className='col-3'>
                        <Form.Select id="txtCollectionCentreCode" name="collectionCentreCode" value={localStorage.getItem("CollectionCentreCode") ? localStorage.getItem("CollectionCentreCode") : formData.collCentreCode} onChange={handleFieldChange} disabled={localStorage.getItem("CollectionCentreCode")}
                        >
                            <option value=''>Select</option>
                            {collectionCentreList.map((option, index) => (
                                <option key={index} value={option.value}>{option.key}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>

                <Row className='justify-content-left ms-2'>
                    <Form.Label column className='col-auto'>
                        From Date
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Control type='date' id="dtStartDate" name="startDate" onChange={handleFieldChange} value={formData.startDate} max={Moment().format("YYYY-MM-DD")} />
                    </Col>
                    <Form.Label column className='col-auto'>
                        To Date
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Control type='date' id="dtEndDate" name="endDate" onChange={handleFieldChange} value={formData.endDate} max={Moment().format("YYYY-MM-DD")} />
                    </Col>
                    <Form.Label column className='col-auto no-right-pad'>
                        Category
                    </Form.Label>
                    <Col className='col-auto'>
                        <Form.Select id="txtCategoryCode" name="productCategoryCode" onChange={handleFieldChange} value={formData.productCategoryCode} >
                            <option value=''>Select</option>
                            {productCategoryList.map((option, index) => (
                                <option key={index} value={option.value}>{option.key}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col className='col-auto'>
                        <Form.Control id="txtSearch" name="searchText" placeholder="Search" onChange={handleFieldChange} value={formData.searchText} maxLength={45} />
                    </Col>
                    <Col className='col-auto'>
                        <Button variant="success" onClick={() => fetchInventoryDetailList()} >Search</Button>
                    </Col>
                </Row>

                {
                    mergedInventoryDetailList && mergedInventoryDetailList.length > 0 ?
                        <Row className="no-padding">
                            <Table striped bordered responsive className="table-md overflow-hidden">
                                <thead className='custom-bg-200'>
                                    <tr>
                                        <th>S. No</th>
                                        <th>Product Line</th>
                                        <th>Product Category</th>
                                        <th>Product</th>
                                        <th>Grade</th>
                                        <th>O/I</th>
                                        <th>Available Qty.</th>
                                        <th>Unit</th>
                                        <th>AVG Price</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mergedInventoryDetailList.map((group, groupIndex) => (
                                        <React.Fragment key={groupIndex}>
                                            {group.map((item, index) => (
                                                <tr key={`${groupIndex}_${index}`}>
                                                    {index === 0 && (
                                                        <>
                                                            <td rowSpan={group.length}>{groupIndex + 1}</td>
                                                            <td rowSpan={group.length}>{item.productLineName}</td>
                                                            <td rowSpan={group.length}>{item.productCategoryName}</td>
                                                        </>
                                                    )}
                                                    <td className='pl-5'>{item.productName}</td>
                                                    <td>{item.grade ? item.grade : "-"}</td>
                                                    <td>{item.orgIng ? item.orgIng : "-"}</td>
                                                    <td>{item.availableQty}</td>
                                                    <td>{item.unitName}</td>
                                                    <td>{item.avgPrice}</td>
                                                    <td>{item.totalAmount}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                        :
                        <Row className='justify-content-center mt-2'>
                            <Col className='col-auto'>
                                <h4 id="no-inventory-message"></h4>
                            </Col>
                        </Row>
                }
            </Form>
            <Row style={{ position: 'absolute', bottom: '30px', align: 'centre' }}>
                <TablePagination
                    pageCount={pageCount}
                    handlePageClick={onPageClick}
                    pageSize={pageSize}
                    handlePageSizeChange={handlePageSize}
                    isDisablePrevious={isPreviousDisabled}
                    isDisableNext={isNextDisabled}
                    previousClick={handlePreviousClick}
                    nextClick={handleNextClick}
                    pageIndex={pageNumber - 1}
                />
            </Row>
        </>
    )
}