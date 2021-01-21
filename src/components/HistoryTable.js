import React from "react";

import { withFirebase } from "../Firebase/context";
import { Table, } from "antd";
// import Table from "ant-responsive-table";

const HistoryTable = (props) => {
	const { searchResult, columns } = props;

	const onChange = (pagination, filters, sorter, extra) => {
		console.log("params", pagination, filters, sorter, extra);
	};

	return (
		<div>
			<Table columns={columns} dataSource={searchResult} onChange={onChange} />
		</div>
	);
};

export default withFirebase(HistoryTable);
