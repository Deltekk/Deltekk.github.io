import { Button, Card, CardBody } from "@heroui/react";

export default function App() {
	return (
		<main className="flex min-h-screen min-w-screen items-center justify-center bg-black text-white">
			<div className="m-10 max-w-lg space-y-6 text-center">
				<h1 className="text-4xl font-extrabold">
					Benvenuto su <span className="text-cyan-400">Deltekk</span>
				</h1>
				<p className="text-white/70">
					Landing page tech-ready con React, Tailwind e HeroUI 🚀
				</p>

				{/* bottone HeroUI */}
				<Button color="primary" size="lg">
					Get Started
				</Button>

				{/* card HeroUI */}
				<Card className="flex flex-col border border-white/10 bg-white/5 p-10">
					<h4> PIPO IN CULO </h4>
					<CardBody>
						<p className="text-white/80">
							Questo è un componente <strong>Card</strong> di HeroUI, reso ancora più
							tech con le utility Tailwind ✨
						</p>
					</CardBody>
				</Card>
			</div>
		</main>
	);
}
