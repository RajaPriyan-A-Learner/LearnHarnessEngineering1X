export interface Position {
  symbol: string;
  marketValue: number;
  assetClass: string;
}

export interface TargetAllocation {
  [assetClass: string]: number; // percentages as decimals (e.g. 0.40 for 40%)
}

export interface DriftResult {
  assetClass: string;
  currentWeight: number;
  targetWeight: number;
  drift: number; // currentWeight - targetWeight
}

export const calculateAllocation = (positions: Position[]): { [assetClass: string]: number } => {
  const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
  if (totalValue === 0) return {};

  const allocation: { [assetClass: string]: number } = {};
  for (const pos of positions) {
    allocation[pos.assetClass] = (allocation[pos.assetClass] || 0) + pos.marketValue;
  }

  // Convert to weights
  for (const assetClass in allocation) {
    allocation[assetClass] = allocation[assetClass] / totalValue;
  }

  return allocation;
};

export const calculateDrift = (
  positions: Position[],
  target: TargetAllocation
): DriftResult[] => {
  const currentAllocation = calculateAllocation(positions);
  const allAssetClasses = new Set([...Object.keys(currentAllocation), ...Object.keys(target)]);

  const results: DriftResult[] = [];
  for (const assetClass of allAssetClasses) {
    const currentWeight = currentAllocation[assetClass] || 0;
    const targetWeight = target[assetClass] || 0;
    results.push({
      assetClass,
      currentWeight,
      targetWeight,
      drift: currentWeight - targetWeight
    });
  }

  return results;
};
