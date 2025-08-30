import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });

  const API_URL = "http://127.0.0.1:8000/users";


  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create user
  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, null, { params: form });
      setForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container my-4">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">User Manager</span>
        </div>
      </nav>

      {/* Add User Form */}
      <div className="card shadow p-3 mb-4">
        <h5 className="card-title">Add New User</h5>
        <form onSubmit={createUser}>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Add User
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className="card shadow p-3">
        <h5 className="card-title">Users</h5>
        <table className="table table-hover table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
