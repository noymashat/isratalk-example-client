import { Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

export const getColumnSearchProps = (
	dataIndex,
	searchText,
	setText,
	searchedColumn,
	setColumn,
	searchInput
) => ({
	filterDropdown: ({
		setSelectedKeys,
		selectedKeys,
		confirm,
		clearFilters,
	}) => (
		<div style={{ padding: 8 }}>
			<Input
				ref={searchInput}
				placeholder={`Search ${dataIndex}`}
				value={selectedKeys[0]}
				onChange={(e) =>
					setSelectedKeys(e.target.value ? [e.target.value] : [])
				}
				onPressEnter={() =>
					handleSearch(selectedKeys, confirm, dataIndex, setText, setColumn)
				}
				style={{ width: 188, marginBottom: 8, display: "block" }}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() =>
						handleSearch(selectedKeys, confirm, dataIndex, setText, setColumn)
					}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90 }}
				>
					Search
				</Button>
				<Button
					onClick={() => handleReset(clearFilters, setText)}
					size="small"
					style={{ width: 90 }}
				>
					Reset
				</Button>
			</Space>
		</div>
	),
	filterIcon: (filtered) => (
		<SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
	),
	onFilter: (value, record) =>
		record[dataIndex]
			? record[dataIndex]
					.toString()
					.toLowerCase()
					.includes(value.toLowerCase())
			: "",
	onFilterDropdownVisibleChange: (visible) => {
		if (visible) {
			setTimeout(() => searchInput.current.select(), 100);
		}
	},
	render: (text) =>
		searchedColumn === dataIndex ? (
			<Highlighter
				highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
				searchWords={[searchText]}
				autoEscape
				textToHighlight={text ? text.toString() : ""}
			/>
		) : (
			text
		),
});

const handleSearch = (selectedKeys, confirm, dataIndex, setText, setColumn) => {
	confirm();
	setText(selectedKeys[0]);
	setColumn(dataIndex);
};

const handleReset = (clearFilters, setText) => {
	clearFilters();
	setText("");
};
