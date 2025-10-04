import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/gantt.css";
import { useNotificationsStore } from "./store/notifications";
import { useWorkspaceStore } from "./store/workspace";

// Initialize stores with demo data
useWorkspaceStore.getState().hydrate();
useWorkspaceStore.getState().seedDemo();
useNotificationsStore.getState().seedDemo();

createRoot(document.getElementById("root")!).render(<App />);
