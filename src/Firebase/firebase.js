import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import firebaseConfig from "./firebaseConfig";

class Firebase {
	constructor() {
		app.initializeApp(firebaseConfig);
		this.auth = app.auth();
		this.db = app.database();
	}

	// *** Auth API ***
	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password) =>
		this.auth.currentUser.updatePassword(password);

	listAllUsers = () => {
		this.db.list(`users`);
	};

	// *** Merge Auth and DB User API *** //
	onAuthUserListener = (next, fallback) =>
		this.auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				this.user(authUser.uid)
					.once("value")
					.then((snapshot) => {
						const dbUser = snapshot.val();

						// default empty roles
						if (!dbUser.roles) {
							dbUser.roles = {};
						}

						// merge auth and db user
						authUser = {
							uid: authUser.uid,
							email: authUser.email,
							sell: 0,
							collect: 0,
							...dbUser,
						};

						next(authUser);
					});
			} else {
				fallback();
			}
		});

	// *** User API ***
	user = (uid) => this.db.ref(`users/${uid}`);

	users = () => this.db.ref("users");

	customers = () => this.db.ref("customers");

	getUser = () => this.auth.currentUser.email;

	getUserKey = () => this.auth.currentUser.uid;

	transactions = () => this.db.ref("transactions");

	farms = () => this.db.ref("farms");

	plans = () => this.db.ref("plans");

	database = () => this.db.ref();
}

export default Firebase;
