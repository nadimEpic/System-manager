import React from 'react';
import Dashboard from './Compement/Dashboard';
import Employee from './Compement/Employee';
import Login from './Compement/Login';
import 'bootstrap/dist/css/bootstrap.css';
import Category from './Compement/Category';
import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import AddEmployee from './Compement/Addemployee';
import EditEmployee from './Compement/EditEmployee';
import AddCategory from './Compement/AddCategory';
import Timesheet from './Compement/Timesheet';
import Ptimesheet from './Compement/Ptimesheet';
import Chat from './Compement/Chat';
import PrivateRoute from './Compement/PrivateRoute';
import State from './Compement/State';
import Elogin from './Compement/Elogin';
import EmployeeDetail from './Compement/EmployeeDetail';
import Edashboard from './Compement/Employee/Edashboard';
import ETimesheet from './Compement/Employee/Etimesheet';
import ETimeline from './Compement/Employee/Etimeline';
import PieChart from './Compement/Home';
import Echat from './Compement/Employee/Echat';
import HeroImage from './Compement/Start';
import ToDo from './Compement/ToDo';
import Timeline from './Compement/Timeline';

function App() {
  return (

<BrowserRouter>
     <Routes>

      <Route path='' element={<HeroImage />}></Route>
     <Route path='/adminlogin' element={<Login />}> </Route>
     <Route path='/employee_login' element={<Elogin />}></Route>

     <Route path='/edashboard' element={<PrivateRoute >
          <Edashboard />
        </PrivateRoute>}> 
        <Route path='' element={<PieChart />}></Route>
        <Route path='/edashboard/echat' element={<Echat />}></Route>
        <Route path='/edashboard/etimesheet' element={<ETimesheet />}></Route>
        <Route path='/edashboard/etimeline' element={<ETimeline />}></Route>
      </Route>
      <Route path='/employee_detail/:id' element={<EmployeeDetail />}></Route>
      <Route path='/dashboard' element={<PrivateRoute >
          <Dashboard />
        </PrivateRoute>}> 
        <Route path='' element={<PieChart />}></Route>
  
      <Route path='/dashboard/add_timesheet' element={<Timesheet />}></Route>
      <Route path='/dashboard/timesheet' element={<Ptimesheet />}></Route>
      <Route path='/dashboard/employee' element={<Employee />}></Route>
      <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
      <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route> 
      <Route path='/dashboard/category' element={<Category />}></Route>
      <Route path='/dashboard/add_category' element={<AddCategory />}></Route>
      <Route path='/dashboard/todo' element={<ToDo />}></Route>
      <Route path='/dashboard/chat' element={<Chat />}></Route>
      <Route path='/dashboard/timeline' element={<Timeline />}></Route>
      <Route path='/dashboard/state' element={<State />}></Route>
      <Route path="/dashboard/project-stats/:projectId" element={<State />}></Route>
      
       </Route>
     </Routes>
</BrowserRouter>

   
  )
}

export default App