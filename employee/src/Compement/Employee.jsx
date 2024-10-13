import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { BiUserPlus } from "react-icons/bi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "../style/employee.css";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [category, setCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  useEffect(() => {
   
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const getCategoryName = (id) => {
    const categoryItem = category.find((cat) => cat.id === id);
    return categoryItem ? categoryItem.name : "Unknown Category";
  };

  const filteredEmployees = employee.filter(
    (emp) =>
      (selectedCategory === "All" || emp.category_id === selectedCategory) &&
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>

      <Form inline>
        <Row className="align-items-center">
          <Col xs="auto" className="mr-4"> {/* Increased margin from mr-2 to mr-4 */}
            <Link to="/dashboard/add_employee" className="btn btn-success">
              <BiUserPlus /> Add Employee
            </Link>
          </Col>
          <Col xs="auto" className="mr-2">
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>
        </Row>
      </Form>

      <div className="mt-3">
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedCategory === "All" ? "All" : getCategoryName(selectedCategory)}
        >
          <Dropdown.Item onClick={() => handleCategoryChange("All")}>All</Dropdown.Item>
          {category.map((cat) => (
            <Dropdown.Item key={cat.id} onClick={() => handleCategoryChange(cat.id)}>
              {cat.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Category</th> {/* Changed header from Post to Category */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/${e.image}`}
                    className="employee_image"
                    alt={e.name} // Optional: Add alt attribute for accessibility
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{getCategoryName(e.category_id)}</td> {/* Replace category_id with category name */}
                <td>
                  <Link
                    to={`/dashboard/edit_employee/${e.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
