import React, { useState, useRef } from "react";
import { Menu, Dropdown, Input, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import withAuthorization from "../Session/withAuthorization";
import HistoryTable from "../components/HistoryTable";
import { getColumnSearchProps } from "../components/getColumnSearchProps";

const CustomerHistoryPage = (props) => {
	// search info
	const { Search } = Input;
	const [searchResult, setSearchResult] = useState([]);
	const [searchBy, setSearchBy] = useState("phoneNumber");
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);

	// for filtering data
	const [searchText, setText] = useState("");
	const [searchedColumn, setColumn] = useState("");
	const searchInput = useRef(null);

	const clickSearchBy = (e) => {
		setSearchBy(e.key);
	};

	const onSearch = (value) => {
		if (value !== "") {
			setLoading(true);
			findCustomerKey(value);
		}
	};

	const findCustomerKey = (searchValue) => {
		// reset search result when starting a new search
		setSearchResult([]);
		setNotFound(false);

		const value = searchBy === "uid" ? parseInt(searchValue) : searchValue;
		props.firebase
			.customers()
			.orderByChild(searchBy)
			.equalTo(value)
			.once("value", (snapshot) => {
				if (!snapshot.exists()) {
					console.log("No customer found");
					setLoading(false);
					setNotFound(true);
				} else {
					snapshot.forEach((child) => {
						onSearchCustomer(child.key);
					});
				}
			});
	};

	const onSearchCustomer = (customer) => {
		const transactionsRef = props.firebase.transactions();
		const usersRef = props.firebase.users();
		transactionsRef
			.orderByChild("customerKey")
			.equalTo(customer)
			.once("value", function(snapshot, index) {
				if (!snapshot.exists()) {
					console.log("No transactions found");
					setLoading(false);
					setNotFound(true);
				} else {
					snapshot.forEach((child, index) => {
						let Data = child.val();
						let trans = {
							key: index,
							planName: Data.planName === undefined ? "" : Data.planName,
							amount: Data.amount,
							date: Data.date,
							type: Data.type,
							customerKey: Data.customerKey,
							uid: Data.uid,
							firstName: Data.firstName,
							lastName: Data.lastName,
							phoneNumber: Data.phoneNumber,
							farm: Data.farm,
							debt: Data.debt,
						};
						let userRef = usersRef.child(Data.agent);
						userRef.on("value", (snap) => {
							let userData = snap.val();
							let user = {
								username: userData.username,
								email: userData.email,
							};
							setSearchResult((searchResult) => [
								...searchResult,
								{ ...trans, ...user },
							]);
						});
					});
				}
			});
		setLoading(false);
	};

	const menu = (
		<Menu onClick={clickSearchBy}>
			<Menu.Item key="phoneNumber">Search By Phone Number</Menu.Item>
			<Menu.Item key="uid">Search By Customer ID</Menu.Item>
		</Menu>
	);

	const columns = [
		// {
		// 	title: "ID",
		// 	dataIndex: "uid",
		// 	key: "uid",
		// 	width: "10%",
		// 	// sorter: (a, b) => a.uid - b.uid,
		// },
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			width: "15%",
			sorter: (a, b) => a.date > b.date,
		},
		// {
		// 	title: "First Name",
		// 	dataIndex: "firstName",
		// 	key: "firstName",
		// 	width: "10%",
		// 	...getColumnSearchProps(
		// 		"firstName",
		// 		searchText,
		// 		setText,
		// 		searchedColumn,
		// 		setColumn,
		// 		searchInput
		// 	),
		// },
		// {
		// 	title: "Last Name",
		// 	dataIndex: "lastName",
		// 	key: "lastName",
		// 	width: "10%",
		// 	...getColumnSearchProps(
		// 		"lastName",
		// 		searchText,
		// 		setText,
		// 		searchedColumn,
		// 		setColumn,
		// 		searchInput
		// 	),
		// },
		// {
		// 	title: "Phone Number",
		// 	dataIndex: "phoneNumber",
		// 	key: "phoneNumber",
		// 	width: "10%",
		// 	...getColumnSearchProps(
		// 		"phoneNumber",
		// 		searchText,
		// 		setText,
		// 		searchedColumn,
		// 		setColumn,
		// 		searchInput
		// 	),
		// },
		// {
		// 	title: "Farm",
		// 	dataIndex: "farm",
		// 	key: "farm",
		// 	width: "5%",
		// 	filters: farmsFilter,
		// 	onFilter: (value, record) => record.farm.indexOf(value) === 0,
		// },
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: "10%",
			filters: [
				{ text: "Buy", value: "Buy" },
				{ text: "Pay", value: "Pay" },
			],
			onFilter: (value, record) => record.type.indexOf(value) === 0,
		},
		{
			title: "Plan Name",
			dataIndex: "planName",
			key: "planName",
			width: "15%",
			...getColumnSearchProps(
				"planName",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			width: "10%",
			sorter: (a, b) => a.amount - b.amount,
		},
		{
			title: "Agent",
			dataIndex: "username",
			key: "username",
			width: "10%",
			...getColumnSearchProps(
				"username",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
	];

	return (
		<div style={{ margin: "2%" }}>
			<h1>Customer's Activity History</h1>
			<Search
				placeholder={searchBy === "phoneNumber" ? "Phone Numbe" : "Customer ID"}
				onSearch={onSearch}
				enterButton
				loading={loading}
				style={{ width: "300px" }}
			/>
			<Dropdown overlay={menu}>
				<Button
					className="ant-dropdown-link"
					onClick={(e) => e.preventDefault()}
				>
					{searchBy === "phoneNumber"
						? "Search By Phone Number"
						: "Search By Customer ID"}{" "}
					<DownOutlined />
				</Button>
			</Dropdown>
			{!loading && notFound && (
				<div>
					<p>Nothing was found</p>
				</div>
			)}
			{!notFound && searchResult.length > 0 && (
				<div>
					<p>
						<br />
						<b>Name: </b>
						{`${searchResult[0].firstName} ${searchResult[0].lastName}`}
						<br />
						<b>Customer ID: </b>
						{`${searchResult[0].uid}`}
						<br />
						<b>Phone Number: </b>
						{`${searchResult[0].phoneNumber}`}
						<br />
						<b>Farm: </b>
						{`${searchResult[0].farm}`}
					</p>
					<HistoryTable
						style={{ margin: "2% 60% 0 0" }}
						searchResult={searchResult}
						columns={columns}
					/>
				</div>
			)}
		</div>
	);
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(CustomerHistoryPage);
