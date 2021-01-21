import React, { useState, useEffect, useRef } from "react";
import withAuthorization from "../Session/withAuthorization";
import { getColumnSearchProps } from "../components/getColumnSearchProps";
import HistoryTable from "../components/HistoryTable";
import DeleteButton from "../components/DeleteButton";
import DeleteModal from "../components/DeleteModal";
import ResetButton from "../components/ResetButton";
import ResetModal from "../components/ResetModal";
import axios from "axios";
require("dotenv").config();

const ManageAgentsPage = (props) => {
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showResetModal, setShowResetModal] = useState(false);

	const handleCloseDelete = () => setShowDeleteModal(false);
	const handleShowDelete = () => setShowDeleteModal(true);

	const handleCloseReset = () => setShowResetModal(false);
	const handleShowReset = () => setShowResetModal(true);

	// for column search
	const [searchText, setText] = useState("");
	const [searchedColumn, setColumn] = useState("");
	const searchInput = useRef(null);

	const resetUser = (key) => {
		let list = [...users];
		list.forEach((user) => {
			if (user.key === key) {
				user.sell = 0;
				user.collect = 0;
			}
		});
		setUsers(list);
	};

	const userList = () => {
		let list = [];
		props.firebase.users().once("value", (snapshot) => {
			snapshot.forEach(function(childSnapshot) {
				let Key = childSnapshot.key;
				let Data = childSnapshot.val();
				list.push({
					key: Key,
					username: Data.username,
					sell: Data.sell,
					collect: Data.collect,
					role: Data.roles === undefined ? "Admin" : "Agent",
				});
			});
			list.filter((user) => user.role === "Agent");
			setUsers(list);
		});
	};

	useEffect(() => {
		userList();
	}, [props.firebase]);

	const onClickDeleteAgent = (userKey) => {
		setCurrentUser(userKey);
		handleShowDelete();
	};

	const callSubmitDelete = () => {
		return axios
			.post(process.env.REACT_APP_SERVER_URL + "delete", {
				uid: currentUser,
			})
			.then(() => {
				props.firebase
					.users()
					.child(currentUser)
					.remove()
					.then(() => {
						handleCloseDelete();
						userList();
						console.log(currentUser, "was deleted completely");
					})
					.catch((error) => {
						console.log(error);
					});
			})
			.catch((e) => console.log(e));
	};

	const onClickReset = (userKey) => {
		setCurrentUser(userKey);
		handleShowReset();
	};

	const callSubmitReset = () => {
		let updates = {};
		updates[`/users/${currentUser}/sell`] = 0;
		updates[`/users/${currentUser}/collect`] = 0;

		props.firebase
			.database()
			.update(updates)
			.then(() => {
				resetUser(currentUser);
				handleCloseReset();
			})
			.catch((error) => {
				console.log("error ", error);
			});
	};

	const columns = [
		{
			title: "Username",
			dataIndex: "username",
			key: "username",
			width: "5%",
			...getColumnSearchProps(
				"username",
				searchText,
				setText,
				searchedColumn,
				setColumn,
				searchInput
			),
		},
		{
			title: "Sell",
			dataIndex: "sell",
			key: "sell",
			width: "5%",
			sorter: (a, b) => a.sell - b.sell,
		},
		{
			title: "Collect",
			dataIndex: "collect",
			key: "collect",
			width: "5%",
			sorter: (a, b) => a.collect - b.collect,
		},
		{
			title: "",
			dataIndex: "",
			key: "y",
			width: "5%",
			render: (_, record) => (
				<ResetButton
					key={record.key}
					ID={record.key}
					onClickReset={onClickReset}
				/>
			),
		},
		{
			title: "",
			dataIndex: "",
			key: "y",
			width: "5%",
			render: (_, record) => (
				<DeleteButton
					key={record.key}
					ID={record.key}
					onClickDelete={onClickDeleteAgent}
				/>
			),
		},
	];

	return (
		<div style={{ margin: "2%  0 0" }}>
			<ResetModal
				ID={currentUser}
				show={showResetModal}
				onSubmit={callSubmitReset}
				handleClose={handleCloseReset}
			/>
			<DeleteModal
				ID={currentUser}
				show={showDeleteModal}
				onSubmit={callSubmitDelete}
				handleClose={handleCloseDelete}
			/>
			<h1>Manage Agents</h1>
			<HistoryTable searchResult={users} columns={columns} />
		</div>
	);
};

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(ManageAgentsPage);
