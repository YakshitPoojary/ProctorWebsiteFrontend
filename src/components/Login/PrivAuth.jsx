// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { AuthContext } from './Authenticate';

// const PrivAuth = ({ component: Component, ...rest }) => {
//     const { currentUser } = React.useContext(AuthContext);

//     return (
//         <Route
//             {...rest}
//             render={props =>
//                 currentUser ? (
//                     <Component {...props} />
//                 ) : (
//                     <Redirect to="/login" />
//                 )
//             }
//         />
//     );
// };

// export default PrivAuth;
