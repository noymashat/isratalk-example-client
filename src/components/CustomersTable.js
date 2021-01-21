import React, { useState, useRef } from "react";
import { withFirebase } from "../Firebase/context";
import { Table, Row, Col } from "antd";
import { getColumnSearchProps } from "./getColumnSearchProps";
import Buy from "./Buy";
import BuyModal from "./BuyModal";
import Pay from "./Pay";
import PayModal from "./PayModal";
import DeleteCustomer from "./DeleteCustomer";
import DeleteCustomerModal from "./DeleteCustomerModal";
import EditCustomer from "./EditCustomer";

const CustomersTable = (props) => {
	const {
		customers,
		farms,
		showBuyModal,
		handleCloseBuy,
		handleShowBuy,
		onSubmitBuy,
		options,
		showPayModal,
		handleClosePay,
		handleShowPay,
		onSubmitPay,
		showDeleteModal,
		handleCloseDelete,
		handleShowDelete,
		onSubmitDelete,
		onSubmitEdit,
		showEdit,
		handleShowEdit,
		handleCloseEdit,
		editError,
	} = props;

	const [currentCustomer, setCurrentCustomer] = useState(null);
	const [currentDebt, setCurrentDebt] = useState(0);
	let name = customers.filter((customer) => customer.key === currentCustomer);
	if (name[0] !== undefined) {
		name = name[0].firstName + " " + name[0].lastName;
	}
	const farmsFilter = farms.map((farm) =>
		Object.assign({ text: farm, value: farm })
	);

	const [searchText, setText] = useState("");
	const [searchedColumn, setColumn] = useState("");
	const searchInput = useRef(null);

	const uid = props.firebase.getUserKey();
	const isAdmin = props.firebase
		.users()
		.orderByKey()
		.endAt(uid)
		.once("value")
		.then((snapshot) => {
			const roles = snapshot.child("roles").val();
			if (roles) return roles.length > 0 ? true : false;
			else return false;
		});

	// Buy
	//onClick "Buy" button
	const onClickBuy = (customerId, debt) => {
		setCurrentCustomer(customerId);
		setCurrentDebt(debt);
		handleShowBuy();
	};

	const onSubmitBuyModal = (planName, amount) => {
		onSubmitBuy(amount, planName, currentCustomer, currentDebt, false);
	};

	//Pay
	//onClick "Pay" button
	const onClickPay = (customerId, debt) => {
		setCurrentCustomer(customerId);
		setCurrentDebt(debt);
		handleShowPay();
	};

	const onSubmitPayModal = (amount) => {
		onSubmitPay(amount, currentCustomer, currentDebt);
	};

	//Delete
	//onClick "Delete" button
	const onClickDelete = (customerId) => {
		setCurrentCustomer(customerId);
		handleShowDelete();
	};

	const onSubmitDeleteModal = () => {
		onSubmitDelete(currentCustomer);
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "uid",
			key: "id",
			width: "5%",
			...getColumnSearchProps(
				"uid",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
			width: "10%",
			...getColumnSearchProps(
				"firstName",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
			width: "10%",
			...getColumnSearchProps(
				"lastName",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "Phone Number",
			dataIndex: "phoneNumber",
			key: "phoneNumber",
			width: "10%",
			...getColumnSearchProps(
				"phoneNumber",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "Farm",
			dataIndex: "farm",
			key: "farm",
			width: "10%",
			filters: farmsFilter,
			onFilter: (value, record) => record.farm.indexOf(value) === 0,
		},
		{
			title: "Debt",
			dataIndex: "debt",
			key: "debt",
			width: "10%",
			sorter: (a, b) => a.debt - b.debt,
		},
	];

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<div style={{ margin: "2% 60% 0 0" }}>
			<DeleteCustomerModal
				show={showDeleteModal}
				customerKey={currentCustomer}
				name={name}
				onSubmit={onSubmitDeleteModal}
				handleClose={handleCloseDelete}
			/>
			<PayModal
				show={showPayModal}
				customerKey={currentCustomer}
				name={name}
				onSubmit={onSubmitPayModal}
				handleClose={handleClosePay}
			/>
			<BuyModal
				show={showBuyModal}
				customerKey={currentCustomer}
				name={name}
				onSubmit={onSubmitBuyModal}
				handleClose={handleCloseBuy}
				options={options}
			/>
			<Table
				columns={columns}
				dataSource={customers}
				onChange={onChange}
				expandable={{
					expandedRowRender: (record) => (
						<div>
							<Row>
								<Col span={4}>
									<Buy
										key={record.key}
										customerKey={record.key}
										debt={record.debt}
										onClickBuy={onClickBuy}
									/>
								</Col>
								<Col span={4}>
									<Pay
										key={record.key}
										customerKey={record.key}
										debt={record.debt}
										onClickPay={onClickPay}
									/>
								</Col>
								{isAdmin && (
									<Col span={4}>
										<EditCustomer
											key={record.key}
											customer={customers.filter((c) => record.key === c.key)}
											onSubmitEdit={onSubmitEdit}
											show={showEdit}
											handleShow={handleShowEdit}
											handleClose={handleCloseEdit}
											farms={farms}
											editError={editError}
										/>
									</Col>
								)}
								<Col span={4}>
									<DeleteCustomer
										key={record.key}
										customerKey={record.key}
										onClickDelete={onClickDelete}
									/>
								</Col>
							</Row>
						</div>
					),
				}}
			/>
		</div>
	);
};

export default withFirebase(CustomersTable);
