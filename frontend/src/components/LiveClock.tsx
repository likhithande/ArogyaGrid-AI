import React, { useState, useEffect } from 'react';

interface LiveClockProps {
  showGreeting?: boolean;
  roleTitle?: string;
  subtitlePrefix?: string;
  className?: string;
  mode?: 'full' | 'time-only' | 'badge';
}

export function getIndiaGreeting(date: Date = new Date()): string {
  const istHours = Number(
    new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false
    }).format(date)
  );

  if (istHours >= 5 && istHours < 12) {
    return 'Good morning';
  } else if (istHours >= 12 && istHours < 17) {
    return 'Good afternoon';
  } else if (istHours >= 17 && istHours < 21) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}

export function formatIndiaDateTime(date: Date = new Date()): {
  dateStr: string;
  timeStr: string;
  combined: string;
} {
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const dateStr = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);
  const timeStr = new Intl.DateTimeFormat('en-GB', timeOptions).format(date);
  
  return {
    dateStr,
    timeStr,
    combined: `${dateStr} · ${timeStr} IST`
  };
}

export const LiveClock: React.FC<LiveClockProps> = ({
  showGreeting = false,
  roleTitle = 'Administrator',
  subtitlePrefix = 'Healthcare resilience overview',
  className = '',
  mode = 'full'
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    // 1-second dynamic heartbeat interval
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = getIndiaGreeting(now);
  const { combined, timeStr } = formatIndiaDateTime(now);

  if (mode === 'time-only') {
    return <span className={className}>{timeStr} IST</span>;
  }

  if (mode === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{timeStr} IST</span>
      </span>
    );
  }

  return (
    <div className={`live-clock-container ${className}`}>
      {showGreeting && (
        <h1
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--text-primary, #0F172A)',
            letterSpacing: '-0.02em',
            margin: 0
          }}
        >
          {greeting}, {roleTitle}.
        </h1>
      )}
      <p
        style={{
          fontSize: 13,
          color: 'var(--text-secondary, #475569)',
          marginTop: showGreeting ? 2 : 0,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <span>{subtitlePrefix}</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span style={{ fontWeight: 600, color: 'var(--text-primary, #1E293B)', fontVariantNumeric: 'tabular-nums' }}>
          {combined}
        </span>
      </p>
    </div>
  );
};

export default LiveClock;
