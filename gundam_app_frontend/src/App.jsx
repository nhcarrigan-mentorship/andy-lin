import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Kits from "./pages/Kits";
import Collection from "./pages/Collection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import KitPage from "./pages/KitPage";
import Profile from "./pages/Profile";
import Social from "./pages/Social";
//import { demoUser } from "./userData";
import { users } from "./users";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function UserProfileWrapper() {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  return <Profile user={user} currentUser={currentUser} />;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://localhost:5000/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentUser();
  })

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Kits />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/kits/:kitId" element={<KitPage />} />
        <Route
          path="/profile"
          element={<Profile currentUser={currentUser} />}
        />
        <Route 
          path="profile/:userId"
          element={<UserProfileWrapper currentUser={currentUser} />}
        />
        <Route path="/social" element={<Social />} />
        <Route path="/kits/:id" element={<KitPage />} />
      </Routes>
    </Router>
  );
}

export default App;
