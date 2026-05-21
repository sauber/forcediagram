/**
 * Gravity attraction force
 * @param x - The current distance between objects.
 * @param eps - The stability constant (prevents infinity, default 0.2).
 * @returns The calculated force (negative = repulsion, positive = attraction).
 */
export function gravity(x: number, eps: number = 0.2): number {
  return 1 / (Math.pow(x, 2) + eps);
}

/**
 * Exponential Repulsion force
 * @param x - The current distance between objects.
 * @returns The calculated force (negative = repulsion, positive = attraction).
 */
export function repulsion(x: number): number {
  return -Math.exp(-x);
}

export const serpentine = (x: number): number => 2 * x / (x * x + 1);
export const agnesi = (x: number): number => 4 * x / (x * x + 4);

/**
 * Smooth gravity-repulsion force.
 *
 * @param x - The current distance between objects.
 * @param l - The equilibrium point (where force is 0).
 * @param k - The smoothness/sharpness of the transition (default 5.0).
 * @param eps - The stability constant (prevents infinity, default 0.2).
 * @returns The calculated force (negative = repulsion, positive = attraction).
 */
export function snap(
  x: number,
  l: number,
  k: number = 5.0,
  eps: number = 0.2,
): number {
  const d = x - l;

  // Phase 1: Exponential Repulsion (Negative output when d < 0)
  const y1 = repulsion(d);

  // Phase 2: Inverse-Square Attraction (Positive output when d > 0)
  const y2 = gravity(d, eps);

  /**
   * Root Alignment Logic:
   * To ensure f(l) is exactly 0, we calculate a sigmoid offset.
   * This forces the weights to cancel out y1 and y2 at d = 0.
   */
  const offset = Math.log(1 / eps) / k;
  const weight = 1 / (1 + Math.exp(-k * (d - offset)));

  // Blend the two phases
  return (1 - weight) * y1 + weight * y2;
}

// Example usage:
// const equilibriumDistance = 10;
// const currentDistance = 10.46; // Near the peak attraction
// const force = calculateSnappingForce(currentDistance, equilibriumDistance);

// console.log(`Force at distance ${currentDistance}: ${force.toFixed(4)}`);
