import { Target, Flame, Award, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatsCards({ habits }) {
  // 1. State variable to force re-render periodically
  const [timeKey, setTimeKey] = useState(Date.now());

  // 2. Set up interval to update timeKey every minute (60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeKey(Date.now());
    }, 60000); // 60,000 milliseconds = 1 minute

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Use the state variable for calculating time-dependent stats
  const currentTimeMs = timeKey;

  // Convert all relevant fields to standard JS numbers before calculating stats
  const numericHabits = habits.map((h) => ({
    ...h,
    // FIX: Convert BigNum (BN) habit count to a standard number for Math.max to work
    count:
      typeof h.count?.toNumber === "function"
        ? h.count.toNumber()
        : h.count || 0,
    // FIX: Ensure lastCheckIn is also a standard number
    lastCheckIn:
      typeof h.lastCheckIn?.toNumber === "function"
        ? h.lastCheckIn.toNumber()
        : h.lastCheckIn || 0,
  }));

  const totalHabits = numericHabits.length;

  // Now h.count is guaranteed to be a number
  const longestStreak = Math.max(...numericHabits.map((h) => h.count), 0);

  const totalBadges =
    numericHabits.filter((h) => h.streak7).length +
    numericHabits.filter((h) => h.streak30).length;

  const activeToday = numericHabits.filter((h) => {
    // lastCheckIn is now a number (seconds)
    const lastCheckInMs = h.lastCheckIn * 1000;
    const timeSince = currentTimeMs - lastCheckInMs;
    // Check if the habit was checked in within the last 24 hours
    return timeSince < 24 * 60 * 60 * 1000;
  }).length;

  const stats = [
    {
      icon: Target,
      label: "Total Habits",
      value: totalHabits,
      color: "#667eea",
    },
    {
      icon: Flame,
      label: "Longest Streak",
      value: longestStreak,
      color: "#f59e0b",
    },
    {
      icon: Award,
      label: "Badges Earned",
      value: totalBadges,
      color: "#10b981",
    },
    {
      icon: TrendingUp,
      label: "Active Today",
      value: activeToday,
      color: "#8b5cf6",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto 1rem", // Reduced bottom margin
        padding: "0 1.5rem", // Padding for mobile gutters
        display: "grid",
        // Responsive grid: minimum 140px wide columns
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "1rem",
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "16px",
            padding: "1.25rem", // Slightly reduced padding
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <stat.icon size={24} color={stat.color} />
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              {stat.label}
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#333" }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
