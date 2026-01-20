export function getDaysSince(dateString: string): number {
  const apiDate = new Date(dateString);
  const now = new Date();
  
  // Normalize both to midnight to count full days accurately
  apiDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffInMs = now.getTime() - apiDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}