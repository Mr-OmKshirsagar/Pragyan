import { useState } from "react";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log(data);

      alert("User Registered");

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div>

      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Enter Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>

    </div>
  );
}

export default Register;