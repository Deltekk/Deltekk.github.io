// src/routes/NotFound.jsx
import { div } from "framer-motion/client";
import { Link } from "react-router-dom";
export default function NotFound() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center text-center">
			<div className="relative">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 -top-10 h-82 opacity-60"
					style={{
						background:
							"radial-gradient(800px 400px at 25% 20%, rgba(56,189,248,.25), transparent 55%), radial-gradient(800px 400px at 75% 70%, rgba(168,85,247,.22), transparent 55%)",
						filter: "blur(40px)",
					}}
				/>

				<h1 className="text-6xl font-extrabold text-violet-400">404</h1>
				<p className="mt-2 text-white/80">La pagina che cerchi non esiste.</p>

				<div className="mt-6">
					<Link
						to="/"
						className="rounded-lg bg-violet-500 px-4 py-2 font-semibold text-black hover:bg-violet-400"
					>
						Torna alla home
					</Link>
				</div>
			</div>
		</div>
	);
}
