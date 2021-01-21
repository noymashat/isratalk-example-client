import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";
// import { DownOutlined } from "@ant-design/icons";
import withAuthorization from "../Session/withAuthorization";
import HistoryTable from "../components/HistoryTable";
import { getColumnSearchProps } from "../components/getColumnSearchProps";

const AgentHistoryPage = (props) => {
	// data fetch
	const [farms, setFarms] = useState([]);
	const [sell, setSell] = useState(0);
	const [collect, setCollect] = useState(0);
	const farmsFilter = farms.map((farm) =>
		Object.assign({ text: farm, value: farm })
	);

	// search info
	const { Search } = Input;
	const [searchResult, setSearchResult] = useState([]);
	// const [searchBy, setSearchBy] = useState("username");
	const [loading, setLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);

	// for filtering table
	const [searchText, setText] = useState("");
	const [searchedColumn, setColumn] = useState("");
	const searchInput = useRef(null);

	const getFarms = () => {
		let list = [];
		props.firebase
			.farms()
			.once("value", (snapshot) => {
				snapshot.forEach(function(childSnapshot) {
					let Data = childSnapshot.val();
					list.push({
						name: Data.name,
					});
				});
			})
			.then(() => {
				setFarms(list);
			});
	};

	const getSell = (userKey) => {
		let data = 0;
		props.firebase
			.user(userKey)
			.once("value", (snapshot) => {
				data = snapshot.val();
			})
			.then(() => setSell(data.sell));
	};

	const getCollect = (userKey) => {
		let data = 0;
		props.firebase
			.user(userKey)
			.once("value", (snapshot) => {
				data = snapshot.val();
			})
			.then(() => setCollect(data.collect));
	};

	useEffect(() => {
		getFarms();
		// getSell();
		// getCollect();
	}, []);

	const onSearch = (searchValue) => {
		if (searchValue !== "") {
			setLoading(true);
			findUserKey(searchValue.toLowerCase());
		}
	};

	// const clickSearchBy = (e) => {
	// 	setSearchBy(e.key);
	// };

	const findUserKey = (searchValue) => {
		// reset search result when starting a new search
		setSearchResult([]);
		setNotFound(false);

		props.firebase
			.users()
			.orderByChild("username")
			.equalTo(searchValue)
			.once("value", (snapshot) => {
				if (!snapshot.exists()) {
					console.log("User Not Found");
					setLoading(false);
					setNotFound(true);
				} else {
					snapshot.forEach((child) => {
						onSearchAgent(child.key);
						getSell(child.key);
						getCollect(child.key);
					});
				}
			});
	};

	const onSearchAgent = (user) => {
		const transactionsRef = props.firebase.transactions();
		// const customersRef = props.firebase.customers();
		transactionsRef
			.orderByChild("agent")
			.equalTo(user)
			.once("value", function(snapshot, index) {
				if (!snapshot.exists()) {
					console.log("No transactions found");
					setLoading(false);
					setNotFound(true);
				} else {
					snapshot.forEach((child) => {
						let Key = child.key;
						let Data = child.val();
						let trans = {
							key: Key,
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
						setSearchResult((searchResult) => [...searchResult, { ...trans }]);
					});
				}
			});
	};

	// const menu = (
	// 	<Menu onClick={clickSearchBy}>
	// 		<Menu.Item key="username">Search By Username</Menu.Item>
	// 		<Menu.Item key="email">Search By Email</Menu.Item>
	// 	</Menu>
	// );

	const columns = [
		// {
		// 	title: "ID",
		// 	dataIndex: "uid",
		// 	key: "uid",
		// 	width: "5%",
		// 	sorter: (a, b) => a.uid - b.uid,
		// },
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			width: "5%",
			sorter: (a, b) => a.date > b.date,
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
			width: "5%",
			filters: farmsFilter,
			onFilter: (value, record) => record.farm.indexOf(value) === 0,
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			width: "5%",
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
			width: "10%",
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
			width: "5%",
			sorter: (a, b) => a.amount - b.amount,
		},
	];

	return (
		<div style={{ margin: "2%" }}>
			<h1>Agent's Activity History</h1>
			<Search
				placeholder={"Username"}
				onSearch={onSearch}
				enterButton
				style={{ width: "300px" }}
			/>
			{/* <Dropdown overlay={menu}>
				<Button
					className="ant-dropdown-link"
					onClick={(e) => e.preventDefault()}
				>
					{searchBy === "username" ? "Search By Username" : "Search By Email"}
					<DownOutlined />
				</Button>
			</Dropdown> */}
			{!loading && notFound && (
				<div>
					<p>Nothing was found</p>
				</div>
			)}
			{!notFound && searchResult.length > 0 && (
				<div>
					<h4>
						<p>
							<br />
							<b>Total Sell: </b>
							{`${sell}`}
							<br />
							<b>Total Collect: </b>
							{`${collect}`}
							<br />
						</p>
					</h4>

					{/* <h2>All Transactions By {Search}</h2> */}
					<HistoryTable searchResult={searchResult} columns={columns} />
				</div>
			)}
		</div>
	);
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(AgentHistoryPage);
