import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 👈 IMPORT
import App from "./App.jsx";
import NotFound from "./routes/NotFound.jsx"; // 👈 IMPORT
import "./index.css";
import Layout from "./routes/Layout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<HeroUIProvider>
			<BrowserRouter>
				<Routes>
					<Route element={<Layout />}>
						<Route path="/" element={<App />} />
						{/* ...le tue altre rotte... */}
						<Route path="*" element={<NotFound />} /> {/* catch-all 404 */}
					</Route>
				</Routes>
			</BrowserRouter>
		</HeroUIProvider>
	</React.StrictMode>,
);
