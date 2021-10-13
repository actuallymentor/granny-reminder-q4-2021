import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js'
import { getFirestore, doc, collection, setDoc, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"
const databaseConnection = getFirestore()

function showUserDataVisually( userCredential ) {

	const email = userCredential.user.email
	document.querySelector( 'main' ).innerHTML = `
		<h1>Welcome ${ email }</h1>
		<input id="address" type="text" placeholder="Your address" />
		<button id="save">Save new address</button>
		<button id="logout">Log out</button>
	`

	document.getElementById( 'logout' ).addEventListener( 'click', e => {
		const auth = getAuth()
		signOut( auth )
		document.querySelector( 'main' ).innerHTML = `<h1>You are logged out</h1>`
	} )

	document.getElementById( 'save' ).addEventListener( 'click', e => {

		const address = document.getElementById( 'address' ).value
		console.log( address )

		setDoc( doc( databaseConnection, "addresses", email ), {
			userAddress: address
		} )

	} )

	// is er data? > zo ja vul het in het input veld in
	onSnapshot( doc( databaseConnection, "addresses", email ), (doc) => {

	    const address = doc.data() || {}
	    if( address.userAddress ) { 
	    	document.getElementById( 'address' ).value = address.userAddress
	    }

	} )


}

window.onload = function() {


	// ///////////////////////////////
	// Login and registration
	// ///////////////////////////////

	// Grab the login form, listen to submits
	document.getElementById( 'login' ).addEventListener( 'submit', function( event ) {

		// Prevent default behaviour
		event.preventDefault()

		// Grab the values of the input fields
		const email = event.target[0].value
		const password = event.target[1].value

		// Log out the email and password
		console.log( email, password )

		// Create auth connection
		const auth = getAuth()

		// Try to register the user
		createUserWithEmailAndPassword( auth, email, password )

			// If success, do stuff
			.then( userCredential => {

				showUserDataVisually( userCredential )
				console.log( userCredential )

			} )

			// If failed, try to register the user
			.catch( error => {

				console.log( error )

				// Try to sign in the user
				signInWithEmailAndPassword( auth, email, password )
					// If success, log the user
					.then( userCredential => {
						showUserDataVisually( userCredential )
						console.log( userCredential )
					} )
					.catch( error => console.log( error ) )


			} )

	} )

	// ///////////////////////////////
	// Session management
	// ///////////////////////////////

	const auth = getAuth()

	// Listen to user changed
	onAuthStateChanged( auth, user => {

		console.log( "User from session: ", user )

		// If there is no user, return
		if( !user ) return
		showUserDataVisually( { user: user } )

	} )

}