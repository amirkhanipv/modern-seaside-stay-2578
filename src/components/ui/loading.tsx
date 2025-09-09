import { cn } from "@/lib/utils"

interface LoadingProps {
	className?: string;
}

export function Loading({ className }: LoadingProps) {
	return (
		<div className={cn("flex items-center justify-center", className)}>
			<div className="relative">
				<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
				<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
			</div>
		</div>
	)
}

export function LoadingPage() {
	return (
		<div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center">
			<div className="text-center space-y-10">
				{/* Orbiting ring with camera icon */}
				<div className="relative w-40 h-40 mx-auto">
					{/* Core */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-gray-100 blur-sm" />
					<div className="absolute inset-3 rounded-full bg-white border border-primary/20 shadow-lg" />
					{/* Orbit path */}
					<div className="absolute inset-0 rounded-full ring-2 ring-primary/20" />
					{/* Orbiting dot */}
					<div className="absolute top-1/2 left-1/2 -ml-[2px] -mt-[2px]">
						<div className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg animate-spin" style={{ animationDuration: '2s' }} />
					</div>
					{/* Camera icon spinning softly */}
					<div className="absolute inset-0 flex items-center justify-center">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="w-10 h-10 text-primary animate-spin"
							style={{ animationDuration: '3s' }}
						>
							<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
							<circle cx="12" cy="13" r="3"/>
						</svg>
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-gray-800">در حال بارگذاری...</h2>
					<p className="text-gray-600">آتلیه نورا</p>
				</div>
			</div>
		</div>
	)
}

export function LoadingSpinner({ className }: LoadingProps) {
	return (
		<div className={cn("animate-spin rounded-full border-2 border-primary/30 border-t-primary", className)} />
	)
}