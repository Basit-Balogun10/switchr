import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./index.css";
import App from "./App";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConvexProvider client={convex}>
            <ConvexAuthProvider client={convex}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConvexAuthProvider>
        </ConvexProvider>
    </React.StrictMode>
);
