import React, { useEffect, useState, useCallback } from "react";
import withAuthorization from "../Session/withAuthorization";
import AddNewCustomer from "../components/AddNewCustomer";
import CustomersTable from "../components/CustomersTable";

import emailjs from "emailjs-com";
import * as CONFIG from "../constants/emailConfig";

const ChargePage = (props) => {
	const [customers, setCustomers] = useState([]);
	const [options, setOptions] = useState([]);
	const [farms, setFarms] = useState([]);
	const [sell, setSell] = useState(0);
	const [collect, setCollect] = useState(0);

	const getOptions = useCallback(() => {
		let list = [];
		props.firebase
			.plans()
			.once("value", (snapshot) => {
				snapshot.forEach(function(childSnapshot) {
					// let Key = childSnapshot.key;
					let Data = childSnapshot.val();
					list.push({
						name: Data.name,
						cost: Data.cost,
					});
				});
			})
			.then(() => {
				setOptions(list);
			});
	}, [props.firebase]);

	const getFarms = useCallback(() => {
		let list = [];
		props.firebase
			.farms()
			.once("value", (snapshot) => {
				snapshot.forEach(function(childSnapshot) {
					// let Key = childSnapshot.key;
					let Data = childSnapshot.val();
					list.push({
						name: Data.name,
					});
				});
			})
			.then(() => {
				setFarms(list);
			});
	}, [props.firebase]);

	const getSell = useCallback(() => {
		let data = 0;
		props.firebase
			.user(props.firebase.getUserKey())
			.once("value", (snapshot) => {
				data = snapshot.val();
			})
			.then(() => setSell(data.sell));
	}, [props.firebase]);

	const getCollect = useCallback(() => {
		let data = 0;
		props.firebase
			.user(props.firebase.getUserKey())
			.once("value", (snapshot) => {
				data = snapshot.val();
			})
			.then(() => setCollect(data.collect));
	}, [props.firebase]);

	const getCustomers = () => {
		let list = [];
		props.firebase.customers().once("value", (snapshot) => {
			snapshot.forEach(function(childSnapshot) {
				let Key = childSnapshot.key;
				let Data = childSnapshot.val();
				list.push({
					key: Key,
					uid: Data.uid,
					firstName: Data.firstName,
					lastName: Data.lastName,
					phoneNumber: Data.phoneNumber,
					farm: Data.farm,
					debt: Data.debt,
				});
			});
			setCustomers(list);
		});
	};

	useEffect(() => {
		getOptions();
		getFarms();
		getSell();
		getCollect();
		getCustomers();
	}, [props.firebase, collect, sell]);

	// Add New Customer
	const [showNewModal, setShowNew] = useState(false);
	const handleCloseNew = () => setShowNew(false);
	const handleShowNew = () => setShowNew(true);
	const [addError, setAddError] = useState(null);

	const maxId = () => {
		let ids = [...customers];
		ids = ids.map((c) => (c.uid !== undefined ? c.uid : 0));
		return ids.length === 0 ? 0 : Math.max(...ids) + 1;
	};

	const onSubmitNewCustomer = (values) => {
		// let updates = {};
		const newCustomer = {
			uid: maxId(),
			firstName: values.firstName,
			lastName: values.lastName,
			phoneNumber: values.phoneNumber,
			farm: values.farm,
			debt: 0,
		};
		props.firebase
			.customers()
			.push(newCustomer)
			.then(() => {
				// addCustomer(newCustomer);
				handleCloseNew();
				getCustomers();
			})
			.catch((error) => {
				setAddError(error);
			});
	};

	// Format Dates
	const formatDate = () => {
		let d = new Date(),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear(),
			hour = d.getHours(),
			min = d.getMinutes();

		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;
		if (min < 10) min = "0" + min;

		const time = [hour, min].join(":");
		const date = [day, month, year].join("/");
		return date.concat(", ", time);
	};

	// Edit Customer
	const [showEditModal, setShowEdit] = useState(false);
	const handleCloseEdit = () => setShowEdit(false);
	const handleShowEdit = () => setShowEdit(true);
	const [editError, setEditError] = useState(null);

	const onSubmitEditCustomer = (customerKey, values) => {
		let updates = {};
		updates[`/customers/${customerKey}/firstName`] = values.firstName;
		updates[`/customers/${customerKey}/lastName`] = values.lastName;
		updates[`/customers/${customerKey}/phoneNumber`] = values.phoneNumber;
		updates[`/customers/${customerKey}/farm`] = values.farm;

		props.firebase
			.database()
			.update(updates)
			.then(() => {
				// updateCustomer(editCustomer);
				handleCloseEdit();
				getCustomers();
			})
			.catch((error) => {
				setEditError(error);
			});
	};

	// Buy
	const [showBuyModal, setShowBuy] = useState(false);

	let params = {};

	const handleCloseBuy = () => setShowBuy(false);
	const handleShowBuy = () => setShowBuy(true);

	const sendEmail = async () => {
		try {
			const result = await emailjs.send(
				CONFIG.SERVICE_ID,
				CONFIG.TEMPLATE_ID,
				params,
				CONFIG.USER_ID
			);
			console.log(result.text);
		} catch (e) {
			console.log(e);
		}
	};

	const emailParams = (customerKey, planName) => {
		const customer = customers.filter(
			(customer) => customer.key === customerKey
		);
		let name = props.firebase.getUser();
		name = name.substring(0, name.lastIndexOf("@"));
		return (params = {
			authUser: name,
			plan: planName,
			phone: customer[0].phoneNumber,
			customerName: customer[0].firstName + " " + customer[0].lastName,
		});
	};

	const onSubmitBuy = (amount, planName, customerKey, debt) => {
		let updates = {};
		const customerInfo = customers.filter((c) => c.key === customerKey);
		const newDebt = parseInt(debt, 10) + parseInt(amount, 10);
		let newTransaction = {
			type: "Buy",
			planName: planName,
			amount: amount,
			agent: props.firebase.getUserKey(),
			customerKey: customerKey,
			date: formatDate(),
			...customerInfo[0],
		};
		const transactionKey = props.firebase.transactions().push().key;
		const userKey = props.firebase.getUserKey();

		updates[`/customers/${customerKey}/debt`] = newDebt;
		updates[`/transactions/${transactionKey}`] = newTransaction;
		updates[`/users/${userKey}/sell`] = sell + amount;

		props.firebase
			.database()
			.update(updates)
			.then(() => {
				params = emailParams(customerKey, planName);
				console.table(params);
				// sendEmail();
				// updateCustomer(customerKey, amount, false);
				handleCloseBuy();
				getSell();
			})
			.catch((error) => {
				console.log("error ", error);
			});
	};

	//Pay
	const [showPayModal, setShowPay] = useState(false);

	const handleClosePay = () => setShowPay(false);
	const handleShowPay = () => setShowPay(true);

	const onSubmitPay = (amount, customerKey, debt) => {
		let updates = {};
		let customerInfo = customers.filter((c) => c.key === customerKey);
		let newDebt = parseInt(debt, 10) - parseInt(amount, 10);
		let newTransaction = {
			type: "Pay",
			amount: amount,
			agent: props.firebase.getUserKey(),
			customerKey: customerKey,
			date: formatDate(),
			...customerInfo[0],
		};
		let transactionKey = props.firebase.transactions().push().key;
		const userKey = props.firebase.getUserKey();

		updates[`/customers/${customerKey}/debt`] = newDebt;
		updates[`/transactions/${transactionKey}`] = newTransaction;
		updates[`/users/${userKey}/collect`] = collect + amount;

		props.firebase
			.database()
			.update(updates)
			.then(() => {
				// updateCustomer(customerKey, amount, true);
				handleClosePay();
				getCollect();
			})
			.catch((error) => {
				console.log("error ", error);
			});
	};

	// Delete Customer
	const [showDeleteModal, setShowDelete] = useState(false);

	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

	const onSubmitDelete = (customerKey) => {
		props.firebase
			.customers()
			.child(customerKey)
			.remove()
			.then(function() {
				// deleteCustomer(customerKey);
				handleCloseDelete();
				getCustomers();
			})
			.catch(function(error) {
				console.log("Remove failed: " + error.message);
			});
	};

	return (
		<div style={{ margin: "2% 60% 0 0" }}>
			<h1>Charge</h1>
			<h4>
				<b>Total Sell: </b>
				{sell}
				<br />
				<b>Total Collect: </b>
				{collect}
				<br />
				<b>My Profit: </b>
				{sell * 0.1}
				<br />
			</h4>
			<br />
			<AddNewCustomer
				onSubmit={onSubmitNewCustomer}
				show={showNewModal}
				handleShow={handleShowNew}
				handleClose={handleCloseNew}
				farms={farms}
				error={addError}
			/>
			<br />
			<CustomersTable
				customers={customers}
				farms={farms}
				//buy
				showBuyModal={showBuyModal}
				handleCloseBuy={handleCloseBuy}
				handleShowBuy={handleShowBuy}
				onSubmitBuy={onSubmitBuy}
				options={options}
				//pay
				showPayModal={showPayModal}
				handleClosePay={handleClosePay}
				handleShowPay={handleShowPay}
				onSubmitPay={onSubmitPay}
				//Edit
				onSubmitEdit={onSubmitEditCustomer}
				showEdit={showEditModal}
				handleShowEdit={handleShowEdit}
				handleCloseEdit={handleCloseEdit}
				editError={editError}
				//Delete
				showDeleteModal={showDeleteModal}
				handleCloseDelete={handleCloseDelete}
				handleShowDelete={handleShowDelete}
				onSubmitDelete={onSubmitDelete}
			/>
		</div>
	);
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(ChargePage);
