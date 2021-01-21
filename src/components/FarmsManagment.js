import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase/context";
import FarmForm from "./FarmForm";
import DeleteButton from "./DeleteButton";
import DeleteModal from "./DeleteModal";
import { Table } from "antd";

const FarmsManagment = (props) => {
	const [farms, setFarms] = useState([]);
	const [error, setError] = useState(null);

	const [showDeleteModal, setShowDelete] = useState(false);
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

	const getFarms = () => {
		let farmList = [];
		props.firebase.farms().once("value", (snapshot) => {
			snapshot.forEach(function(childSnapshot) {
				let Key = childSnapshot.key;
				let Data = childSnapshot.val();
				farmList.push({
					key: Key,
					name: Data.name,
				});
			});
			setFarms(farmList);
		});
	};

	useEffect(() => {
		getFarms();
	}, [props.firebase]);

	const addFarm = (farmKey, farm) => {
		let list = [...farms];
		list.push({
			key: farmKey,
			name: farm.name,
		});
		setFarms(list);
	};

	const deleteFarm = (farm) => {
		let list = [...farms];
		list = list.filter((f) => farm.key !== f.key);
		setFarms(list);
	};

	// Add Farm
	const onFinishFarm = (values) => {
		let farmKey = props.firebase.farms().push();
		let newFarm = {
			name: values.name,
		};
		farmKey
			.set(newFarm)
			.then(() => {
				addFarm(farmKey, newFarm);
				getFarms();
			})
			.catch((error) => {
				setError(error);
			});
	};

	// Delete Farm
	const onSubmitDeleteFarm = (key) => {
		props.firebase
			.farms()
			.child(key)
			.remove()
			.then(function() {
				deleteFarm(key);
				getFarms();
				handleCloseDelete();
			})
			.catch(function(error) {
				console.log("Remove failed: " + error.message);
			});
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			width: "5%",
			sorter: (a, b) => a.name > b.name,
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
					onClickDelete={onClickDeleteFarm}
				/>
			),
		},
	];

	const [currentFarm, setCurrentFarm] = useState(null);
	const onClickDeleteFarm = (ID) => {
		handleShowDelete();
		setCurrentFarm(ID);
	};
	const callSubmitDeleteFarm = () => {
		onSubmitDeleteFarm(currentFarm);
	};

	return (
		<div>
			<DeleteModal
				ID={currentFarm}
				show={showDeleteModal}
				onSubmit={callSubmitDeleteFarm}
				handleClose={handleCloseDelete}
			/>
			<FarmForm onFinishFarm={onFinishFarm} error={error} />
			<Table
				style={{ tableLayout: "auto", width: "80%" }}
				dataSource={farms}
				columns={columns}
			></Table>
		</div>
	);
};
export default withFirebase(FarmsManagment);
