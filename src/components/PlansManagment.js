import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase/context";
import PlanForm from "./PlanForm";
import DeleteButton from "./DeleteButton";
import DeleteModal from "./DeleteModal";
import { Table } from "antd";

const PlansManagment = (props) => {
	const [plans, setPlans] = useState([]);
	const [error, setError] = useState(null);

	const getPlans = () => {
		let planList = [];
		props.firebase.plans().once("value", (snapshot) => {
			snapshot.forEach(function(childSnapshot) {
				let Key = childSnapshot.key;
				let Data = childSnapshot.val();
				planList.push({
					key: Key,
					name: Data.name,
					cost: Data.cost,
				});
			});
			setPlans(planList);
		});
	};

	useEffect(() => {
		getPlans();
	}, [props.firebase]);

	const addPlan = (plan) => {
		let list = [...plans];
		list.push({ name: plan.name, cost: plan.cost });
		setPlans(list);
	};

	const deletePlan = (key) => {
		let list = [...plans];
		list = list.filter((c) => key !== c.key);
		setPlans(list);
	};

	// Add Plan
	const onFinishPlan = (values) => {
		let newPlan = {
			name: values.name,
			cost: values.cost,
		};
		props.firebase
			.plans()
			.push(newPlan)
			.then(() => {
				addPlan(newPlan);
				getPlans();
			})
			.catch((error) => {
				setError(error);
			});
	};

	const [showDeleteModal, setShowDelete] = useState(false);
	const handleCloseDelete = () => setShowDelete(false);
	const handleShowDelete = () => setShowDelete(true);

	// Delete Plan
	const onSubmitDeletePlan = (key) => {
		props.firebase
			.plans()
			.child(key)
			.remove()
			.then(function() {
				deletePlan(key);
				getPlans();
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
			title: "Cost",
			dataIndex: "cost",
			key: "cost",
			width: "5%",
			sorter: (a, b) => a.cost - b.cost,
		},
		{
			title: "",
			dataIndex: "",
			key: "x",
			width: "5%",
			render: (_, record) => (
				<DeleteButton
					key={record.key}
					ID={record.key}
					onClickDelete={onClickDeletePlan}
				/>
			),
		},
	];

	const [currentPlan, setCurrentPlan] = useState(null);
	const onClickDeletePlan = (ID) => {
		setCurrentPlan(ID);
		handleShowDelete();
	};
	const callSubmitDeletePlan = () => {
		onSubmitDeletePlan(currentPlan);
	};

	return (
		<div>
			<DeleteModal
				ID={currentPlan}
				show={showDeleteModal}
				onSubmit={callSubmitDeletePlan}
				handleClose={handleCloseDelete}
			/>
			<PlanForm onFinishPlan={onFinishPlan} error={error} />
			<Table
				style={{ tableLayout: "auto", width: "80%" }}
				dataSource={plans}
				columns={columns}
			></Table>
		</div>
	);
};
export default withFirebase(PlansManagment);
