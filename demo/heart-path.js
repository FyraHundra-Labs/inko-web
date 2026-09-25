// Copied from Inko src/utils/heartPath.ts. Regenerate with scripts/sync-demo.cjs.
/**
 * Generates a small ECG/pulse blip pattern at a given x position.
 * Returns points for: flat → sharp spike up → sharp spike down → flat
 */
function ecgBlip(startX, baselineY, amplitude) {
	return [
		{ x: startX, y: baselineY },
		{ x: startX + 3, y: baselineY - amplitude * 0.3 },
		{ x: startX + 6, y: baselineY + amplitude * 0.15 },
		{ x: startX + 8, y: baselineY - amplitude },
		{ x: startX + 10, y: baselineY + amplitude * 0.6 },
		{ x: startX + 12, y: baselineY - amplitude * 0.15 },
		{ x: startX + 15, y: baselineY },
	];
}
/**
 * Generates an SVG path string that traces the outline of a heart shape
 * with ECG pulse waves before and after, creating a heartbeat-monitor effect.
 *
 * Uses the parametric heart curve:
 *   x(t) = 16 * sin(t)^3
 *   y(t) = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
 *
 * The path: flat → ECG blip → flat → heart outline → flat → ECG blip → flat
 */
export function generateHeartPulsePath(width, height, extendToEdges = false) {
	// Sample the parametric heart curve clockwise from bottom point
	const SAMPLES = 200;
	const rawPoints = [];
	for (let i = 0; i <= SAMPLES; i++) {
		const t = Math.PI - (i / SAMPLES) * 2 * Math.PI;
		const sinT = Math.sin(t);
		const px = 16 * sinT * sinT * sinT;
		const py =
			13 * Math.cos(t) -
			5 * Math.cos(2 * t) -
			2 * Math.cos(3 * t) -
			Math.cos(4 * t);
		rawPoints.push({ px, py });
	}
	// Parametric bounds
	const pyMin = -17;
	const pyMax = 12;
	const pyRange = pyMax - pyMin;
	const pxRange = 32;
	const pyCenterParam = (pyMin + pyMax) / 2;
	// Reserve space for 2 pulse blips on each side
	const pulseMargin = 55;
	const heartAreaWidth = width - pulseMargin * 2;
	// Scale heart to fit the center area
	const scale = Math.min(
		(heartAreaWidth * 0.95) / pxRange,
		(height * 0.9) / pyRange,
	);
	const svgCenterX = width / 2;
	const svgCenterY = height / 2;
	// Convert parametric to SVG coordinates
	const svgPoints = rawPoints.map(({ px, py }) => ({
		x: svgCenterX + px * scale,
		y: svgCenterY - (py - pyCenterParam) * scale,
	}));
	// Bottom point SVG y (baseline for flat lines and pulse waves)
	const baselineY = svgPoints[0].y;
	const heartStartX = svgPoints[0].x;
	const heartEndX = svgPoints[svgPoints.length - 1].x;
	// Pulse wave amplitude (small relative to heart)
	const blipAmp = height * 0.12;
	// Build full path: pulse before → heart → pulse after
	const allPoints = [];
	// Blip layout: 2 blips before heart, 2 blips after, evenly spaced
	const blipWidth = 15;
	const spacing = 8; // uniform gap between blips and heart
	const blip2BeforeStart = heartStartX - spacing - blipWidth;
	const blip1BeforeStart = blip2BeforeStart - spacing - blipWidth;
	const blip1AfterStart = heartEndX + spacing;
	const blip2AfterStart = blip1AfterStart + blipWidth + spacing;
	// Lead-in: blip → blip → heart
	allPoints.push(...ecgBlip(blip1BeforeStart, baselineY, blipAmp));
	allPoints.push({ x: blip2BeforeStart, y: baselineY });
	allPoints.push(...ecgBlip(blip2BeforeStart, baselineY, blipAmp));
	allPoints.push({ x: heartStartX, y: baselineY });
	// Heart outline
	for (const p of svgPoints) {
		allPoints.push(p);
	}
	// Lead-out: heart → blip → blip → flat
	allPoints.push({ x: heartEndX, y: baselineY });
	allPoints.push(...ecgBlip(blip1AfterStart, baselineY, blipAmp));
	allPoints.push({ x: blip2AfterStart, y: baselineY });
	allPoints.push(...ecgBlip(blip2AfterStart, baselineY, blipAmp));
	// Compute content width and center within the requested width
	const minX = Math.min(...allPoints.map((p) => p.x));
	const maxX = Math.max(...allPoints.map((p) => p.x));
	const pathWidth = maxX - minX;
	const centerOffset = (width - pathWidth) / 2 - minX;
	for (const p of allPoints) {
		p.x += centerOffset;
	}
	// Extend flat lines to edges if requested
	if (extendToEdges) {
		const firstPt = allPoints[0];
		const lastPt = allPoints[allPoints.length - 1];
		allPoints.unshift({ x: 0, y: firstPt.y });
		allPoints.push({ x: width, y: lastPt.y });
	}
	// Build SVG path string and calculate total length
	let totalLength = 0;
	const first = allPoints[0];
	let d = `M${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
	for (let i = 1; i < allPoints.length; i++) {
		const curr = allPoints[i];
		const prev = allPoints[i - 1];
		const dx = curr.x - prev.x;
		const dy = curr.y - prev.y;
		totalLength += Math.sqrt(dx * dx + dy * dy);
		d += ` L${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
	}
	return { d, totalLength, pathWidth };
}
/**
 * Generates a flat line with 2 ECG blips in the center.
 * Used as a divider between connection cards.
 */
export function generateBlipLinePath(width, height) {
	const baselineY = height / 2;
	const blipAmp = height * 0.35;
	const blipWidth = 15;
	const spacing = 8;
	const centerX = width / 2;
	const blip1Start = centerX - spacing / 2 - blipWidth;
	const blip2Start = centerX + spacing / 2;
	const allPoints = [
		{ x: 0, y: baselineY },
		...ecgBlip(blip1Start, baselineY, blipAmp),
		{ x: blip2Start, y: baselineY },
		...ecgBlip(blip2Start, baselineY, blipAmp),
		{ x: width, y: baselineY },
	];
	let totalLength = 0;
	const first = allPoints[0];
	let d = `M${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
	for (let i = 1; i < allPoints.length; i++) {
		const curr = allPoints[i];
		const prev = allPoints[i - 1];
		const dx = curr.x - prev.x;
		const dy = curr.y - prev.y;
		totalLength += Math.sqrt(dx * dx + dy * dy);
		d += ` L${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
	}
	const pathWidth = width;
	return { d, totalLength, pathWidth };
}
