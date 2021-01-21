import React from "react";
import { Link } from "react-router-dom";
import AuthUserContext from "./Session/context";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

import SignOutButton from "./components/SignOut";
import * as ROUTES from "./constants/routes";
import * as ROLES from "./constants/roles";

const Navigation = ({ isMobile }) => (
	<AuthUserContext.Consumer>
		{(authUser) =>
			authUser ? (
				<NavigationAuth authUser={authUser} isMobile={isMobile} />
			) : (
				<></>
			)
		}
	</AuthUserContext.Consumer>
);

const admin = (
	<Menu>
		<Menu.Item>
			<Link to={ROUTES.MANAGE}>
				<b>Manage Agents</b>
			</Link>
		</Menu.Item>
		<Menu.Item>
			<Link to={ROUTES.AGENT_HISTORY}>
				<b>Agent's History</b>
			</Link>
		</Menu.Item>
		<Menu.Item>
			<Link to={ROUTES.PLANS_FARMS}>
				<b>Plans & Farms</b>
			</Link>
		</Menu.Item>
		<Menu.Item>
			<Link to={ROUTES.SIGN_UP}>
				<b>Create New User</b>
			</Link>
		</Menu.Item>
	</Menu>
);

const styleDesktop = {
	display: "flex",
	justifyContent: "space-evenly",
};
const styleMobile = {
	margin: "auto",
};

const NavigationAuth = ({ authUser, isMobile }) => {
	const deviceStyle = isMobile ? styleMobile : styleDesktop;
	return (
		<div style={deviceStyle}>
			<Menu style={{ display: "flex", flexDirection: "row", border: "none" }}>
				<Menu.Item>
					<Link to={ROUTES.CHARGE}>
						<p
							style={{
								margin: "auto",
								lineHeight: "20px",
								verticalAlign: "middle",
							}}
						>
							<b>Charge</b>
						</p>
					</Link>
				</Menu.Item>
				<Menu.Item style={{ whiteSpace: "breakSpaces", height: "auto" }}>
					<Link to={ROUTES.CUSTOMER_HISTORY}>
						<p
							style={{
								margin: "auto",
								lineHeight: "20px",
								textAlign: "center",
							}}
						>
							<b>
								Customer's
								<br />
								History
							</b>
						</p>
					</Link>
				</Menu.Item>
				<Menu.Item>
					{!!authUser.roles[ROLES.ADMIN] && (
						<Dropdown overlay={admin}>
							<a onClick={(e) => e.preventDefault()}>
								<p
									style={{
										margin: "auto",
										lineHeight: "20px",
									}}
								>
									<b>Admin</b> <DownOutlined />
								</p>
							</a>
						</Dropdown>
					)}
				</Menu.Item>
				<Menu.Item>
					<SignOutButton />
				</Menu.Item>
			</Menu>
		</div>
	);
};

export default Navigation;
