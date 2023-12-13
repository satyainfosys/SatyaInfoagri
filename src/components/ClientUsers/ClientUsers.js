import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { userDetailsErrorAction, userDetailsAction, formChangedAction, selectedProductsAction } from '../../actions/index';

const tabArray = ['Client Users List', 'Add Client User'];

const listColumnArray = [
	{ accessor: 'sl', Header: 'S. No' },
	{ accessor: 'companyName', Header: 'Company Name' },
	{ accessor: 'loginName', Header: 'User Name' },
	{ accessor: 'loginUserName', Header: 'Login User Id' },
	{ accessor: 'loginUserEmailId', Header: 'Email Id' },
	{ accessor: 'loginUserMobileNumber', Header: 'Mobile Number' },
	{ accessor: 'lastLoginDate', Header: 'Last Login Date' },
	{ accessor: 'status', Header: 'Active Status ' }
];

export const ClientUsers = () => {

	const [listData, setListData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [modalShow, setModalShow] = useState(false);
	const [perPage, setPerPage] = useState(15);
	const [formHasError, setFormError] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		$('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', true);
		fetchClientUsersList(1)
	}, []);

	const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
	var formChangedData = formChangedReducer.formChanged;

	const userDetailsReducer = useSelector((state) => state.rootReducer.userDetailsReducer)
	const userData = userDetailsReducer.userDetails;

	let isFormChanged = Object.values(formChangedData).some(value => value === true);

	const selectedProductsReducer = useSelector((state) => state.rootReducer.selectedProductsReducer)
    var selectedProductItems = selectedProductsReducer.selectedProducts;

	const [activeTabName, setActiveTabName] = useState();

	const clearUserDetailsReducer = () => {
		dispatch(userDetailsAction(undefined));
		dispatch(userDetailsErrorAction(undefined));
		dispatch(formChangedAction(undefined));
		dispatch(selectedProductsAction([]));
}

	$('[data-rr-ui-event-key*="Add Client User"]').off('click').on('click', function () {
		setActiveTabName("Add Client User")
		$("#btnNew").hide();
		$("#btnSave").show();
		$("#btnCancel").show();
		$('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', false);
	})

	const newDetails = () => {
		$('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', false);
		$('[data-rr-ui-event-key*="Add Client User"]').trigger('click');
		$('#btnSave').attr('disabled', false);
		if(localStorage.getItem('CompanyCode')){
			fetchCompanyList()
		}
	}

	const cancelClick = () => {
		$('#btnExit').attr('isExit', 'false');
		if (isFormChanged) {
			setModalShow(true);
		}
		else {
			$('[data-rr-ui-event-key*="Client Users List"]').trigger('click');
		}
	}

	const exitModule = () => {
		$('#btnExit').attr('isExit', 'true');
		if (isFormChanged) {
			setModalShow(true);
		}
		else {
			window.location.href = '/dashboard';
		}
	}

	const discardChanges = () => {
		$('#btnDiscard').attr('isDiscard', 'true');
		if ($('#btnExit').attr('isExit') == 'true')
			window.location.href = '/dashboard';
		else
			$('[data-rr-ui-event-key*="Client Users List"]').trigger('click');
		setModalShow(false);
	}

	$('[data-rr-ui-event-key*="Client Users List"]').off('click').on('click', function () {
		let isDiscard = $('#btnDiscard').attr('isDiscard');
		if (isDiscard != 'true' && isFormChanged) {
			setModalShow(true);
			setTimeout(function () {
				$('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
			}, 50);
		} else {
			$("#btnNew").show();
			$("#btnSave").hide();
			$("#btnCancel").hide();
			$('[data-rr-ui-event-key*="Add Client User"]').attr('disabled', true);
			$('#ClientUserDetailsForm').get(0).reset();
			localStorage.removeItem("EncryptedClientSecurityUserId");
			$("#btnDiscard").attr("isDiscard", false)
			dispatch(userDetailsAction(undefined));
			clearUserDetailsReducer();
		}
	})

	const fetchClientUsersList = async (page, size = perPage) => {
		let token = localStorage.getItem('Token');
		const listFilter = {
			EncryptedClientCode: localStorage.getItem('EncryptedClientCode'),
			pageNumber: page,
			pageSize: size,
		};
		const response =
			setIsLoading(true);
		await axios
			.post(process.env.REACT_APP_API_URL + '/security-user-list', listFilter, {
				headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
			})
			.then(res => {
				setIsLoading(false);
				if (res.data.status == 200) {
					setListData(res.data.data);
				}
			});
	};

	const fetchCompanyList = async () => {
		const companyRequest = {
			EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
		}
		let companyResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client-companies', companyRequest, {
			headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
		});
		if (companyResponse.data.status == 200) {
			if (localStorage.getItem('CompanyCode')) {
				var companyDetail = companyResponse.data.data.find(company => company.companyCode == localStorage.getItem('CompanyCode'))
				dispatch(userDetailsAction({
					...userData,
					companyCode: localStorage.getItem('CompanyCode'),
					encryptedCompanyCode: companyDetail ? companyDetail.encryptedCompanyCode : "",
					companyName: companyDetail ? companyDetail.companyName : "",
					encryptedClientCode: localStorage.getItem("EncryptedClientCode"),
				}))
				fetchClientDetail();
			}
		}
	}

	const fetchClientDetail = async () => {
		const clientRequest = {
			EncryptedClientCode: localStorage.getItem("EncryptedClientCode")
		}
		let clientResponse = await axios.post(process.env.REACT_APP_API_URL + '/get-client', clientRequest, {
			headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
		});
		if (clientResponse.data.status == 200) {
			dispatch(userDetailsAction({
				...userData,
				clientName: clientResponse.data.data.customerName,
			}))
		}
	}

	const userValidation = () => {
		const companyErr = {};
		const distributionCentreErr = {};
		const collectionCentreNameErr = {};
		const loginNameErr = {};
		const userNameErr = {};
		const mobileNumberErr = {};
		const emailErr = {};
		const countryErr = {};
		const stateErr = {};

		let isValid = true;
		if (!userData.companyCode || !userData.encryptedCompanyCode) {
			companyErr.empty = "Select company";
			isValid = false;
			setFormError(true);
		}
		if (!userData.distributionCentreCode) {
			distributionCentreErr.distributionCentreEmpty = "Select distribution centre"
			isValid = false;
			setFormError(true);
		}
		if (!userData.collCentreCode) {
			collectionCentreNameErr.collectionCentreNameEmpty = "Select collection centre"
			isValid = false;
			setFormError(true);
		}
		if (!userData.loginName) {
			loginNameErr.loginNameEmpty = "Enter user name"
			isValid = false;
			setFormError(true);
		}
		if (!userData.loginUserName) {
			userNameErr.userNameEmpty = "Enter login user id"
			isValid = false;
			setFormError(true);
		}
		if (!userData.loginUserMobileNumber) {
			mobileNumberErr.mobileNumberEmpty = "Enter mobile number"
			isValid = false;
			setFormError(true);
		}
		if (!userData.loginUserEmailId) {
			emailErr.emailEmpty = "Enter email"
			isValid = false;
			setFormError(true);
		}
		else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.loginUserEmailId))){
            emailErr.invalid = "Please enter valid email address";
            isValid = false;
        }
		if (!userData.countryCode) {
			countryErr.empty = "Select country";
			isValid = false;
			setFormError(true);
		}
		if (!userData.stateCode) {
			stateErr.empty = "Select state";
			isValid = false;
			setFormError(true);
		}
		if (!isValid) {
			var errorObject = {
				companyErr,
				distributionCentreErr,
				collectionCentreNameErr,
				loginNameErr,
				userNameErr,
				mobileNumberErr,
				emailErr,
				countryErr,
				stateErr,
			}
			dispatch(userDetailsErrorAction(errorObject))
		}
		return isValid;
	}

	const updateClientUserCallback = (clientUserDetailAdd = false) => {
        setModalShow(false);

        if (!clientUserDetailAdd) {
            toast.success("Client user details updated successfully", {
                time: 'colored'
            })
        }

        $('#btnSave').attr('disabled', true)

        clearUserDetailsReducer();

        fetchClientUsersList(1, perPage);

        $('[data-rr-ui-event-key*="' + activeTabName + '"]').trigger('click');
    }

	const addClientUserDetails = () => {
		if (userValidation()) {
			const requestData = {
				encryptedClientCode: userData.encryptedClientCode,
				encryptedCompanyCode: userData.encryptedCompanyCode,
				clientName: userData.clientName,
				loginName: userData.loginName,
				loginUserEmailId: userData.loginUserEmailId,
				loginUserMobileNumber: userData.loginUserMobileNumber,
				loginUserName: userData.loginUserName,
				moduleCode: localStorage.getItem("ModuleCode"),
				distributionCentreCode: userData.distributionCentreCode,
				collCentreCode: userData.collCentreCode,
				treeIds: selectedProductItems,
				activeStatus: userData.status == null || userData.status == "Active" ? "A" : "S",
				addUser: localStorage.getItem("LoginUserName"),
				countryCode: userData.countryCode,
				stateCode: userData.stateCode
			} 

			const keys = ['loginUserName', 'addUser','clientName','loginName']
			for (const key of Object.keys(requestData).filter((key) => keys.includes(key))) {
				requestData[key] = requestData[key] ? requestData[key].toUpperCase() : '';
			}

			setIsLoading(true);
			axios.post(process.env.REACT_APP_API_URL + '/add-user', requestData, {
				headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
			})
				.then(res => {
					if (res.data.status == 200) {
						setIsLoading(false);
						setTimeout(function () {
                            dispatch(userDetailsAction({
                                ...userData,
                                encryptedSecurityUserId: res.data.data.encryptedSecurityUserId
                            }))
                        }, 50);
                        localStorage.setItem("EncryptedClientSecurityUserId", res.data.data.encryptedSecurityUserId);
                        toast.success(res.data.message, {
                            theme: 'colored',
                            autoClose: 10000
                        })
                        updateClientUserCallback(true);
					} else {
						setIsLoading(false);
						toast.error(res.data.message, {
							theme: 'colored',
							autoClose: 10000
						});
					}
				})
		}
	}

	const updateClientUserDetails = async () => {
        let addUserAccessRights = [];
        let deleteUserAccessRights = [];

        if (userValidation()) {
            let uniqueTreeIds = [...new Set(selectedProductItems)]

            if (userData.treeIds && userData.treeIds.length > 0) {
                for (let i = 0; i < uniqueTreeIds.length; i++) {
                    if (!userData.treeIds.includes(uniqueTreeIds[i])) {
                        addUserAccessRights.push(uniqueTreeIds[i]);
                    }
                }

                for (let i = 0; i < userData.treeIds.length; i++) {
                    if (!uniqueTreeIds.includes(userData.treeIds[i])) {
                        deleteUserAccessRights.push(userData.treeIds[i]);
                    }
                }
            } else if (uniqueTreeIds.length > 0) {
                addUserAccessRights = uniqueTreeIds;
            }

            const updatedUserData = {
                encryptedClientCode: userData.encryptedClientCode,
                encryptedSecurityUserId: userData.encryptedSecurityUserId,
                loginName : userData.loginName,
                loginUserEmailId: userData.loginUserEmailId,
                loginUserMobileNumber: userData.loginUserMobileNumber,
                loginUserName: userData.loginUserName,
                ActiveStatus: !userData.status || userData.status == "Active" ? "A" : "S",
                ModifyUser: localStorage.getItem("LoginUserName"),
				countryCode: userData.countryCode,
				stateCode: userData.stateCode,
				distributionCentreCode: userData.distributionCentreCode,
				collCentreCode: userData.collCentreCode,
				encryptedCompanyCode: userData.encryptedCompanyCode,
            }

            const keys = ['loginUserName', 'ModifyUser', 'loginName']
            for (const key of Object.keys(updatedUserData).filter((key) => keys.includes(key))) {
                updatedUserData[key] = updatedUserData[key] ? updatedUserData[key].toUpperCase() : '';
            }

            var hasError = false;

            if (formChangedData.clientUserDetailUpdate) {
                setIsLoading(true);
                await axios.post(process.env.REACT_APP_API_URL + '/update-user', updatedUserData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                })
                    .then(res => {
                        setIsLoading(false);
                        if (res.data.status != 200) {
                            toast.error(res.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                        }
                    })
            }

            if (!hasError && (formChangedData.moduleDetailAdd || formChangedData.moduleDetailDelete)) {
                if (!hasError && formChangedData.moduleDetailDelete) {
                    if (deleteUserAccessRights) {
                        var deleteUserAccessRightsIndex = 1;

                        for (let i = 0; i < deleteUserAccessRights.length; i++) {
                            const deleteUserAccessRightsId = deleteUserAccessRights[i]
                            const data = {
                                securityUserId: userData.securityUserId,
                                treeId: deleteUserAccessRightsId
                            }
                            const headers = { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                            const deleteUserAccessRightsResponse =
                                await axios.delete(process.env.REACT_APP_API_URL + '/delete-security-user-access-rights', { headers, data });
                            if (deleteUserAccessRightsResponse.data.status != 200) {
                                toast.error(deleteUserAccessRightsResponse.data.message, {
                                    theme: 'colored',
                                    autoClose: 10000
                                });
                                hasError = true;
                                break;
                            }
                        }
                        deleteUserAccessRightsIndex++
                    }
                }

                var moduleDetailIndex = 1;
                for (let i = 0; i < addUserAccessRights.length; i++) {

                    const treeId = addUserAccessRights[i];

                    if (formChangedData.moduleDetailAdd) {
                        const requestData = {
                            securityUserId: userData.securityUserId,
                            clientCode: userData.clientCode,
                            treeId: treeId,
                            addUser: localStorage.getItem("LoginUserName").toUpperCase()
                        }

                        setIsLoading(true);
                        const addModuleDetailResponse = await axios.post(process.env.REACT_APP_API_URL + '/add-security-user-access-rights', requestData, {
                            headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('Token')).value}` }
                        });
                        setIsLoading(false);
                        if (addModuleDetailResponse.data.status != 200) {
                            toast.error(addModuleDetailResponse.data.message, {
                                theme: 'colored',
                                autoClose: 10000
                            });
                            hasError = true;
                            break;
                        }
                    }
                    moduleDetailIndex++
                }
            }
            if (!hasError) {
                updateClientUserCallback();
                dispatch(userDetailsAction({
                    ...userData,
                    treeIds: uniqueTreeIds
                }))
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
                        <h4>Do you want to save changes?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={addClientUserDetails} >Save</Button>
                        <Button variant="danger" id='btnDiscard' onClick={discardChanges}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            }

			<TabPage
				listData={listData}
				tabArray={tabArray}
				listColumnArray={listColumnArray}
				module="ClientUsers"
				newDetails={newDetails}
				cancelClick={cancelClick}
				exitModule={exitModule}
				saveDetails={!userData.encryptedSecurityUserId ? addClientUserDetails : updateClientUserDetails}
			/>
		</>
	)
}

export default ClientUsers;