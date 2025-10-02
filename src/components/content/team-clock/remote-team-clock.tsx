import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type TeamState = 'work' | 'family' | 'chill' | 'doctor' | 'lost' | 'gym';

interface Teammate {
  id: string;
  name: string;
  location: string;
  timezone: string;
  state: TeamState;
  avatar: string;
}

const teammates: Teammate[] = [
  {
    id: '1',
    name: 'Sarah',
    location: 'Vancouver, Canada',
    timezone: 'America/Vancouver',
    state: 'chill',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: '2',
    name: 'Kumail',
    location: 'Toronto, Canada',
    timezone: 'America/Toronto',
    state: 'work',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kumail',
  },
  {
    id: '3',
    name: 'Ethan',
    location: 'San Francisco, USA',
    timezone: 'America/Los_Angeles',
    state: 'work',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
  },
  {
    id: '4',
    name: 'Isabella',
    location: 'Toronto, Canada',
    timezone: 'America/Toronto',
    state: 'work',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
  },
  {
    id: '5',
    name: 'Liam',
    location: 'London, UK',
    timezone: 'Europe/London',
    state: 'family',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
  },
];

const stateOrder: TeamState[] = [
  'work',
  'family',
  'chill',
  'doctor',
  'lost',
  'gym',
];

export function RemoteTeamClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredTeammate, setHoveredTeammate] = useState<Teammate | null>(null);
  const [selectedState, setSelectedState] = useState<TeamState>('work');

  // Calculate the state based on the current user's local time
  const getStateFromTime = (date: Date): TeamState => {
    const hour = date.getHours();

    // Map hours to states (roughly)
    if (hour >= 9 && hour < 17) return 'work'; // 9am-5pm: work
    if (hour >= 17 && hour < 20) return 'family'; // 5pm-8pm: family
    if (hour >= 20 && hour < 23) return 'chill'; // 8pm-11pm: chill
    if (hour >= 23 || hour < 1) return 'doctor'; // 11pm-1am: doctor
    if (hour >= 1 && hour < 5) return 'lost'; // 1am-5am: lost
    return 'gym'; // 5am-9am: gym
  };
  const [isClockView, setIsClockView] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTeammateTime = (teammate: Teammate) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: teammate.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch {
      return '12:00';
    }
  };

  const getTimeDifference = (teammate: Teammate) => {
    try {
      const now = new Date();
      const localTime = now.getTime();
      const teammateTime = new Date(
        now.toLocaleString('en-US', { timeZone: teammate.timezone })
      ).getTime();
      const diff = Math.round((teammateTime - localTime) / (1000 * 60 * 60));

      if (diff === 0) return null;
      return diff > 0 ? `+${diff} hours` : `${diff} hours`;
    } catch {
      return null;
    }
  };

  const getGradientArea = (teammate: Teammate) => {
    try {
      const now = new Date();
      const teammateDate = new Date(
        now.toLocaleString('en-US', { timeZone: teammate.timezone })
      );

      const teammateHours = teammateDate.getHours() % 12;
      const teammateMinutes = teammateDate.getMinutes();

      const teammateHourAngle =
        teammateHours * 30 + (teammateMinutes / 60) * 30;

      // Always start from 12 o'clock (angle 0 degrees, which is -90 in our coordinate system)
      const twelveOClockAngle = 0; // 0 degrees is 12 o'clock position

      // Calculate clockwise and counterclockwise distances from 12 o'clock to target
      const clockwiseFromTwelve = teammateHourAngle;
      const counterclockwiseFromTwelve = 360 - teammateHourAngle;

      // Use the smaller arc from 12 o'clock
      if (clockwiseFromTwelve <= counterclockwiseFromTwelve) {
        // Clockwise is smaller: from 12 to target (clockwise)
        return {
          startAngle: -90, // 12 o'clock position
          endAngle: teammateHourAngle - 90,
        };
      } else {
        // Counterclockwise is smaller: from 12 to target (counterclockwise)
        return {
          startAngle: teammateHourAngle - 90,
          endAngle: -90, // 12 o'clock position
        };
      }
    } catch (error) {
      return null;
    }
  };

  const getAvatarPosition = (state: TeamState, offsetIndex = 0) => {
    const stateIndex = stateOrder.indexOf(state);
    const angle = (stateIndex * 60 + 30 - 90) * (Math.PI / 180); // Convert to radians
    const radius = 120; // Distance from center - reduced to keep avatars on clock face

    const baseX = 200 + radius * Math.cos(angle);
    const baseY = 200 + radius * Math.sin(angle);

    const horizontalOffset = offsetIndex * 20 - 10; // Much closer spacing for overlapping effect

    const x = baseX + horizontalOffset;
    const y = baseY; // Keep same y position for all avatars in same state

    return { x: x - 24, y: y - 24 }; // Offset for avatar size (48px / 2)
  };

  const displayTime = hoveredTeammate
    ? getTeammateTime(hoveredTeammate)
    : currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

  const displayState = hoveredTeammate
    ? hoveredTeammate.state
    : getStateFromTime(currentTime);

  const now = hoveredTeammate
    ? new Date(
        new Date().toLocaleString('en-US', {
          timeZone: hoveredTeammate.timezone,
        })
      )
    : currentTime;
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  const minuteAngle = minutes * 6 - 90;
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30 - 90;

  const stateIndex = stateOrder.indexOf(displayState);
  const stateAngle = stateIndex * 60 + 30 - 90;

  const onlineCount = teammates.length;

  const gradientArea = hoveredTeammate
    ? getGradientArea(hoveredTeammate)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="p-8 bg-white border shadow-lg rounded-3xl">
        <motion.div
          className={
            isClockView ? 'flex justify-center' : 'grid grid-cols-2 gap-12'
          }
          layout
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Left side - Clock */}
          <motion.div
            className="flex flex-col"
            layout
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-900 flex items-center gap-3">
                  Team
                  <div className="flex items-center gap-2 text-base text-gray-500 font-normal">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {onlineCount} online
                  </div>
                </h1>

                <motion.button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isClockView ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  onClick={() => setIsClockView(!isClockView)}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isClockView ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className="relative"
                style={{ width: '400px', height: '400px' }}
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 400 400"
                  style={{ zIndex: 1 }}
                >
                  <defs>
                    <radialGradient id="timeGradient" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="rgba(209, 213, 219, 0)" />
                      <stop offset="70%" stopColor="rgba(209, 213, 219, 0.3)" />
                      <stop
                        offset="100%"
                        stopColor="rgba(209, 213, 219, 0.5)"
                      />
                    </radialGradient>
                  </defs>

                  {gradientArea && (
                    <motion.path
                      d={(() => {
                        const { startAngle, endAngle } = gradientArea;
                        const radius = 145; // Covers the entire clock face
                        const centerX = 200;
                        const centerY = 200;

                        const startX =
                          centerX +
                          radius * Math.cos((startAngle * Math.PI) / 180);
                        const startY =
                          centerY +
                          radius * Math.sin((startAngle * Math.PI) / 180);
                        const endX =
                          centerX +
                          radius * Math.cos((endAngle * Math.PI) / 180);
                        const endY =
                          centerY +
                          radius * Math.sin((endAngle * Math.PI) / 180);

                        // Determine sweep direction (always clockwise from 12 o'clock)
                        let sweepAngle = endAngle - startAngle;
                        if (sweepAngle < 0) sweepAngle += 360;
                        if (sweepAngle > 360) sweepAngle = 360;
                        const largeArcFlag = sweepAngle > 180 ? 1 : 0;

                        return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                      })()}
                      fill="url(#timeGradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {stateOrder.map((state, index) => {
                    const startAngle = index * 60 - 90;
                    const endAngle = (index + 1) * 60 - 90;

                    // Segment divider lines
                    const dividerAngle = ((startAngle + 90) * Math.PI) / 180;
                    const x1 = 200 + 137 * Math.cos(dividerAngle);
                    const y1 = 200 + 137 * Math.sin(dividerAngle);
                    const x2 = 200 + 181 * Math.cos(dividerAngle);
                    const y2 = 200 + 181 * Math.sin(dividerAngle);

                    return (
                      <g key={state}>
                        {/* Segment divider */}
                        <line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          opacity="0.5"
                        />

                        {/* Curved state label */}
                        <defs>
                          <path
                            id={`arc-${index}`}
                            d={`M ${
                              200 +
                              152 *
                                Math.cos(((startAngle + 15) * Math.PI) / 180)
                            } ${
                              200 +
                              152 *
                                Math.sin(((startAngle + 15) * Math.PI) / 180)
                            } A 152 152 0 0 1 ${
                              200 +
                              152 * Math.cos(((endAngle - 15) * Math.PI) / 180)
                            } ${
                              200 +
                              152 * Math.sin(((endAngle - 15) * Math.PI) / 180)
                            }`}
                          />
                        </defs>
                        <text
                          className="text-xs font-medium"
                          fill={displayState === state ? '#ef4444' : '#6b7280'}
                        >
                          <textPath
                            href={`#arc-${index}`}
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            {state.toUpperCase()}
                          </textPath>
                        </text>
                      </g>
                    );
                  })}

                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(hour => {
                    const angle = ((hour * 30 - 90) * Math.PI) / 180;
                    const isMainHour = hour % 3 === 0;
                    const outerRadius = 131;
                    const innerRadius = isMainHour ? 117 : 121;

                    const x1 = 200 + outerRadius * Math.cos(angle);
                    const y1 = 200 + outerRadius * Math.sin(angle);
                    const x2 = 200 + innerRadius * Math.cos(angle);
                    const y2 = 200 + innerRadius * Math.sin(angle);

                    return (
                      <line
                        key={hour}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#9ca3af"
                        strokeWidth={isMainHour ? '2' : '1'}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  <line
                    x1="200"
                    y1="200"
                    x2={200 + 104 * Math.cos((stateAngle * Math.PI) / 180)}
                    y2={200 + 104 * Math.sin((stateAngle * Math.PI) / 180)}
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Center dot */}
                  <circle cx="200" cy="200" r="5" fill="#1f2937" />
                </svg>

                {/* Hour hand */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '6px',
                    height: '60px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 100%',
                    zIndex: 2,
                    background: '#1f2937',
                  }}
                  animate={{
                    transform: `translateX(-50%) translateY(-100%) rotate(${
                      hourAngle + 90
                    }deg)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    duration: 0.8,
                  }}
                />

                {/* Minute hand */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '4px',
                    height: '85px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '50% 100%',
                    zIndex: 3,
                    background: '#4b5563',
                  }}
                  animate={{
                    transform: `translateX(-50%) translateY(-100%) rotate(${
                      minuteAngle + 90
                    }deg)`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    duration: 0.8,
                  }}
                />

                {/* Center dot overlay */}
                <div
                  className="absolute bg-gray-800 rounded-full"
                  style={{
                    width: '10px',
                    height: '10px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 4,
                  }}
                />

                {/* Avatars on clock in clock view */}
                <AnimatePresence>
                  {isClockView &&
                    teammates.map((teammate, index) => {
                      const teammatesInSameState = teammates.filter(
                        t => t.state === teammate.state
                      );
                      const offsetIndex = teammatesInSameState.findIndex(
                        t => t.id === teammate.id
                      );
                      const clockPosition = getAvatarPosition(
                        teammate.state,
                        offsetIndex
                      );
                      const timeDiff = getTimeDifference(teammate);
                      const teammateTime = getTeammateTime(teammate);
                      const isHovered = hoveredTeammate?.id === teammate.id;

                      return (
                        <motion.div
                          key={teammate.id}
                          layoutId={`item-${teammate.id}`}
                          layout="position"
                          className={`absolute flex items-center gap-4 p-4 rounded-xl cursor-pointer ${
                            isHovered ? 'bg-gray-50' : ''
                          }`}
                          style={{
                            left: clockPosition.x - 16,
                            top: clockPosition.y - 16,
                            zIndex: 10 + index,
                          }}
                          transition={{
                            layout: {
                              duration: 0.5,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          onMouseEnter={() => setHoveredTeammate(teammate)}
                          onMouseLeave={() => setHoveredTeammate(null)}
                          onClick={() => setSelectedState(teammate.state)}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white overflow-hidden flex-shrink-0">
                            <img
                              src={teammate.avatar}
                              alt={teammate.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <motion.div
                            className="flex-1 flex items-center gap-4 overflow-hidden pointer-events-none"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          >
                            <div className="flex-1 whitespace-nowrap">
                              <div className="font-semibold text-gray-900 text-lg">
                                {teammate.name}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {teammate.location}
                              </div>
                              <div className="text-xs text-gray-400 capitalize mt-1">
                                {teammate.state} mode
                              </div>
                            </div>

                            <div className="text-sm font-medium text-gray-500">
                              {teammateTime}
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>

              <div className="text-center mt-6">
                <div className="text-2xl font-medium text-gray-700">
                  {displayTime}
                </div>
                <div className="text-sm text-gray-500 mt-1 capitalize">
                  {displayState} mode
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Teammates list */}
          {!isClockView && (
            <motion.div className="space-y-1">
              {teammates.map(teammate => {
                const timeDiff = getTimeDifference(teammate);
                const teammateTime = getTeammateTime(teammate);
                const isHovered = hoveredTeammate?.id === teammate.id;

                return (
                  <motion.div
                    key={teammate.id}
                    layoutId={`item-${teammate.id}`}
                    layout="position"
                    className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      isHovered ? 'bg-gray-50' : 'hover:bg-gray-25'
                    }`}
                    onMouseEnter={() => setHoveredTeammate(teammate)}
                    onMouseLeave={() => setHoveredTeammate(null)}
                    onClick={() => setSelectedState(teammate.state)}
                    transition={{
                      layout: {
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1],
                      },
                    }}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white overflow-hidden flex-shrink-0">
                      <img
                        src={teammate.avatar}
                        alt={teammate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex items-center gap-4 overflow-hidden">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">
                          {teammate.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {teammate.location}
                        </div>
                        <div className="text-xs text-gray-400 capitalize mt-1">
                          {teammate.state} mode
                        </div>
                      </div>

                      <div className="text-sm font-medium text-gray-500 flex flex-col items-end h-5 overflow-hidden">
                        <span className="block group-hover:-translate-y-5 duration-300 transition-transform ease-in-out">
                          {teammateTime}
                        </span>
                        <span
                          className="block group-hover:-translate-y-5 duration-300 transition-transform ease-in-out"
                          style={{ color: 'green' }}
                        >
                          {timeDiff || ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
