import React from 'react';
import {Routes,Route} from 'react-router-dom';
import { UserProvider } from './Context/userContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Protected from './pages/Protected';

function App() {

  return (
    <div className="App" style={{
      backgroundColor:'#233142',
      height:'100vh',
      width:'100vw'
    }}>
        <UserProvider>
          {/* <button onClick={()=>socket.emit('send_msg','hello')}>click me</button> */}
          {/* <Container> */}
            <Routes>
              <Route element={<Protected/>} >
                <Route path='/' element={<Home/>} />
              </Route>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/*' element={<NotFound />}/>
            </Routes>
          {/* </Container> */}
        </UserProvider>
    </div>
  );
}

export default App;
