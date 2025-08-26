// src/routes/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
	return (
		<div className="min-h-screen min-w-screen bg-black text-white">
			<header className="absolute flex w-full items-center justify-between px-6 py-4">
				<div className="font-extrabold tracking-tight">
					Del<span className="text-violet-400">tekk</span>
				</div>
				<nav className="flex gap-4">
					<NavLink
						to="/"
						className={({ isActive }) =>
							"hover:text-violet-300 " +
							(isActive ? "text-violet-400" : "text-white/80")
						}
					>
						Home
					</NavLink>
					<NavLink
						to="/about"
						className={({ isActive }) =>
							"hover:text-violet-300 " +
							(isActive ? "text-violet-400" : "text-white/80")
						}
					>
						About
					</NavLink>
				</nav>
			</header>

			<main className="h-screen w-screen">
				<Outlet /> {/* qui React inserisce la pagina figlia */}
			</main>
		</div>
	);
}
