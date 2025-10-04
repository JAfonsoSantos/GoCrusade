import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/gantt.css";
import { useNotificationsStore } from "./store/notifications";
import { useTabsStore } from "./store/tabs";

// Initialize stores with demo data
useNotificationsStore.getState().seedDemo();
useTabsStore.getState().ensureHome("Home", "/");

createRoot(document.getElementById("root")!).render(<App />);
