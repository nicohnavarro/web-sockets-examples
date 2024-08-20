import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { Input } from "./components/input";
import { v4 as uuid4 } from "uuid";

function App() {
  const [formInputs, setFormInputs] = useState({});
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const socket = io("localhost:3000");

  const handleInput = (event) => {
    let { name, value } = event.target;
    let obj = { [name]: value };
    setFormInputs((prev) => ({ ...prev, ...obj }));
  };

  const handleSubmit = () => {
    socket.emit("data", { ...formInputs, id: uuid4() });

    socket.on("crudData", (response) => {
      setCrudData(response);
    });

    cleanForm();
  };

  const cleanForm = () => {
    setFormInputs({
      name: "",
      age: "",
      phoneNumber: "",
    });
  };

  const getEditData = (data) => {
    setFormInputs(data);
    setIsEdit(true);
  };

  const handleEdit = () => {
    socket.emit("editData", formInputs);
  };

  const handleDelete = (id) => {
    socket.emit("deleteData", id);
  };

  useEffect(() => {
    socket.on("crudData", (response) => {
      setCrudData(response);
    });

    return () => socket.on("disconnect");
  }, []);

  return (
    <div>
      <h1>Simple CRUD Dashboard</h1>
      <Input
        name="name"
        handleInput={handleInput}
        value={formInputs.name}
        placeholder="Enter your Name"
      />
      <Input
        name="age"
        handleInput={handleInput}
        value={formInputs.age}
        placeholder="Enter your Age"
      />

      <Input
        name="phoneNumber"
        handleInput={handleInput}
        value={formInputs.phoneNumber}
        placeholder="Enter your Phone Number"
      />
      <button onClick={isEdit ? handleEdit : handleSubmit} className="add-data">
        {isEdit ? "Edit Data" : "Add Data"}
      </button>
      {crudData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {crudData.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.phoneNumber}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)}>🗑️</button>{" "}
                  <button onClick={() => getEditData(user)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
