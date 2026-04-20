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
import { demoUser } from "./userData";
import { users } from "./users";
import { useParams } from "react-router-dom";

function UserProfileWrapper() {
  const { userId } = useParams();
  const user = users.find((u) => u.id === parseInt(userId));
  return <Profile user={user} currentUser={demoUser} />;
}

function App() {
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
          element={<Profile user={demoUser} currentUser={demoUser} />}
        />
        <Route path="/profile/:userId" element={<UserProfileWrapper />} />
        <Route path="/social" element={<Social />} />
      </Routes>
    </Router>
  );
}

export default App;
