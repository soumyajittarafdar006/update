import type { TeamMember, Task, DailyWorkLog, RoadmapWeek, NotificationItem } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'soumyajit',
    name: 'Soumyajit Tarafdar',
    role: 'Software 1',
    shortRole: 'Software 1',
    team: 'Software',
    responsibility: 'ESP32-S3 firmware, sensor communication, data acquisition, embedded programming',
    avatar: 'ST',
    email: 'soumyajit@cansat.org',
    statusToday: 'On Track',
    statusReason: 'ESP32-S3 study and Arduino/ESP-IDF framework setup in progress'
  },
  {
    id: 'debanjona',
    name: 'Debanjona Kundu',
    role: 'Software 2',
    shortRole: 'Software 2',
    team: 'Software',
    responsibility: 'Telemetry, ground station, data visualization, graphs, data analysis',
    avatar: 'DK',
    email: 'debanjona@cansat.org',
    statusToday: 'Needs Attention',
    statusReason: 'Reviewing data requirements & telemetry JSON packet structure'
  },
  {
    id: 'richi',
    name: 'Richi Paul',
    role: 'Hardware 1',
    shortRole: 'Hardware 1',
    team: 'Hardware',
    responsibility: 'Sensors, sensor testing, calibration, sensor wiring and integration',
    avatar: 'RP',
    email: 'richi@cansat.org',
    statusToday: 'On Track',
    statusReason: 'AMG8833 and BMP280 sensor datasheets & pinouts studied'
  },
  {
    id: 'archisman',
    name: 'Archisman Nebu',
    role: 'Hardware 2',
    shortRole: 'Hardware 2',
    team: 'Hardware',
    responsibility: 'Power system, battery, voltage regulation, connectors, wiring and electronics integration',
    avatar: 'AN',
    email: 'archisman@cansat.org',
    statusToday: 'Blocked',
    statusReason: 'Validating LiPo 2S battery discharge curve & 3.3V LDO thermal rating'
  },
  {
    id: 'srijani',
    name: 'Srijani Bhowmick',
    role: '3D Design & Mechanical',
    shortRole: '3D Design',
    team: '3D Design & Mechanical',
    responsibility: 'CAD design, CanSat structure, component mounting, 3D printing and mechanical assembly',
    avatar: 'SB',
    email: 'srijani@cansat.org',
    statusToday: 'On Track',
    statusReason: 'Finalizing 115mm x 200mm cylindrical CanSat CAD dimensions concept'
  }
];

export const INITIAL_ROADMAP: RoadmapWeek[] = [
  {
    weekNumber: 1,
    title: 'Study & Concept Freeze',
    objective: 'Study ESP32-S3, data telemetry formats, sensor pinouts, power wiring, and initial CanSat CAD dimensions.',
    phase: 'Phase 1: Architecture & Requirements',
    startDate: '2026-10-01',
    endDate: '2026-10-07',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 2,
    title: 'Basic Bench Testing & CAD Blueprint',
    objective: 'ESP32-S3 basic tests, PC ground station setup, sensor bench tests, power regulator tests & detailed CAD model.',
    phase: 'Phase 2: Subsystem Bench Validation',
    startDate: '2026-10-08',
    endDate: '2026-10-14',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 3,
    title: 'Sensor Protocols & Data Logging',
    objective: 'I²C/SPI/UART sensor drivers, data logging system, AMG8833 thermal testing, wiring harness plan & PCB mounting.',
    phase: 'Phase 2: Protocol Development',
    startDate: '2026-10-15',
    endDate: '2026-10-21',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 4,
    title: 'Sensor Readouts & 3D Print V1',
    objective: 'Read sensors through ESP32, define telemetry packet structure, power distribution circuit & 3D print V1 chassis.',
    phase: 'Phase 3: Integration & Prototyping V1',
    startDate: '2026-10-22',
    endDate: '2026-10-28',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 5,
    title: 'Sensor Fusion & Telemetry GUI',
    objective: 'Sensor fusion with timestamps, live telemetry GUI display, hardware integration & physical electronics assembly.',
    phase: 'Phase 3: Telemetry & Assembly',
    startDate: '2026-10-29',
    endDate: '2026-11-04',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 6,
    title: 'Data Storage & Assembly Revisions',
    objective: 'Data storage with error handling, telemetry plotting, full electronics assembly, cabling & CAD revisions.',
    phase: 'Phase 4: Optimization & Refinement',
    startDate: '2026-11-05',
    endDate: '2026-11-11',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 7,
    title: 'V1 System Completion & 3D Print V2',
    objective: 'Complete Firmware V1, Ground Station V1, hardware bench test, power consumption test & 3D print V2 structure.',
    phase: 'Phase 5: Full System Integration',
    startDate: '2026-11-12',
    endDate: '2026-11-18',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 8,
    title: 'Stress Testing & Sensor Calibration',
    objective: 'Firmware stress test, end-to-end radio telemetry test, sensor calibration, wiring safety check & mechanical assembly.',
    phase: 'Phase 5: Calibration & Stress QA',
    startDate: '2026-11-19',
    endDate: '2026-11-25',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 9,
    title: 'Bug Fixing & Pre-Flight Checks',
    objective: 'Code bug fixes & optimization, data accuracy reports, integration drop tests, vibration checks & structural audit.',
    phase: 'Phase 6: Pre-Flight QA & Verification',
    startDate: '2026-11-26',
    endDate: '2026-12-02',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  },
  {
    weekNumber: 10,
    title: 'Final Mission Freeze & Flight Assembly',
    objective: 'Final firmware freeze, ground station freeze, hardware freeze, total system flight test & final CanSat assembly.',
    phase: 'Phase 7: Flight Readiness & Mission Freeze',
    startDate: '2026-12-03',
    endDate: '2026-12-09',
    responsibleMemberIds: ['soumyajit', 'debanjona', 'richi', 'archisman', 'srijani']
  }
];

export const INITIAL_TASKS: Task[] = [
  // ==========================================
  // WEEK 1
  // ==========================================
  {
    id: 'w1-sw1',
    title: 'Study ESP32-S3, Arduino/ESP-IDF',
    description: 'Review ESP32-S3 Dual-Core pinouts, FreeRTOS tasks setup, I2C/SPI hardware peripherals, and ESP-IDF compilation environment.',
    assignedMemberId: 'soumyajit',
    week: 1,
    day: 'Monday',
    startDate: '2026-10-01',
    dueDate: '2026-10-03',
    priority: 'High',
    status: 'In Progress',
    completionPercentage: 65,
    hoursWorked: 4.5,
    notes: 'ESP32-S3 datasheet studied. Initial ESP-IDF environment setup complete.',
    blocker: ''
  },
  {
    id: 'w1-sw2',
    title: 'Study data requirements & telemetry format',
    description: 'Define telemetry requirements including temperature, pressure, altitude, orientation, and battery voltage payload structure.',
    assignedMemberId: 'debanjona',
    week: 1,
    day: 'Tuesday',
    startDate: '2026-10-02',
    dueDate: '2026-10-04',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    hoursWorked: 0,
    notes: 'Reviewing payload packet fields with Software 1 lead.',
    blocker: ''
  },
  {
    id: 'w1-hw1',
    title: 'Study all sensors/modules',
    description: 'Analyze datasheets and I2C/SPI operating voltages for BMP280, MPU6050, AMG8833, and NRF24L01 radio modules.',
    assignedMemberId: 'richi',
    week: 1,
    day: 'Wednesday',
    startDate: '2026-10-03',
    dueDate: '2026-10-04',
    priority: 'Critical',
    status: 'Completed',
    completionPercentage: 100,
    hoursWorked: 6,
    notes: 'All sensor pin maps and voltage limits verified (3.3V safe).',
    completedAt: '2026-10-04'
  },
  {
    id: 'w1-hw2',
    title: 'Study battery, power & wiring',
    description: 'Calculate total current draw (ESP32 + sensors + radio ~650mA peak) and select 2S LiPo battery & buck regulator specs.',
    assignedMemberId: 'archisman',
    week: 1,
    day: 'Thursday',
    startDate: '2026-10-04',
    dueDate: '2026-10-06',
    priority: 'Critical',
    status: 'In Progress',
    completionPercentage: 50,
    hoursWorked: 3,
    notes: '5V regulator rail stable under load test.',
    blocker: '3.3V regulator heating up under RF transmit burst. Testing heatsink.'
  },
  {
    id: 'w1-mech',
    title: 'Finalize CanSat dimensions & CAD concept',
    description: 'Confirm CanSat competition constraint limits (115mm diameter x 200mm height, max 500g mass) and draft solid envelope concept.',
    assignedMemberId: 'srijani',
    week: 1,
    day: 'Friday',
    startDate: '2026-10-02',
    dueDate: '2026-10-05',
    priority: 'High',
    status: 'In Progress',
    completionPercentage: 75,
    hoursWorked: 7,
    notes: 'Cylindrical shell & internal stacking disc layout approved in CAD draft.',
    blocker: ''
  },

  // ==========================================
  // WEEK 2
  // ==========================================
  {
    id: 'w2-sw1',
    title: 'ESP32-S3 basic tests',
    description: 'Flash test firmware on ESP32-S3 to verify GPIO output, serial UART console logs, dual-core task creation and internal flash memory.',
    assignedMemberId: 'soumyajit',
    week: 2,
    day: 'Monday',
    startDate: '2026-10-08',
    dueDate: '2026-10-10',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w2-sw2',
    title: 'Set up PC data-reception environment',
    description: 'Configure Python PySerial / Electron environment on Ground Station PC to receive USB serial stream and parse telemetry strings.',
    assignedMemberId: 'debanjona',
    week: 2,
    day: 'Tuesday',
    startDate: '2026-10-08',
    dueDate: '2026-10-11',
    priority: 'Medium',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w2-hw1',
    title: 'Test individual sensors',
    description: 'Breadboard bench-test BMP280 barometer and MPU6050 accelerometer/gyroscope independently using Arduino/ESP32 test sketches.',
    assignedMemberId: 'richi',
    week: 2,
    day: 'Wednesday',
    startDate: '2026-10-09',
    dueDate: '2026-10-12',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w2-hw2',
    title: 'Test battery/voltage regulators',
    description: 'Assemble power circuit board with LiPo safety BMS and measure voltage ripple under 500mA and 1000mA dummy load conditions.',
    assignedMemberId: 'archisman',
    week: 2,
    day: 'Thursday',
    startDate: '2026-10-09',
    dueDate: '2026-10-12',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w2-mech',
    title: 'Create detailed CAD model',
    description: 'Design complete solid 3D CAD model including outer cylinder shell, sensor mounting brackets, parachute hook, and battery holder.',
    assignedMemberId: 'srijani',
    week: 2,
    day: 'Friday',
    startDate: '2026-10-10',
    dueDate: '2026-10-14',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 3
  // ==========================================
  {
    id: 'w3-sw1',
    title: 'Sensor communication: I²C/SPI/UART',
    description: 'Implement multi-device bus communication routines on ESP32-S3 for shared I2C bus (BMP280 + MPU6050) and SPI bus for NRF24 radio.',
    assignedMemberId: 'soumyajit',
    week: 3,
    day: 'Monday',
    startDate: '2026-10-15',
    dueDate: '2026-10-18',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w3-sw2',
    title: 'Create data logging system',
    description: 'Build local data logger program on PC Ground Station to automatically append incoming telemetry packets to timestamped CSV files.',
    assignedMemberId: 'debanjona',
    week: 3,
    day: 'Tuesday',
    startDate: '2026-10-15',
    dueDate: '2026-10-18',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w3-hw1',
    title: 'Test AMG8833 + other sensors',
    description: 'Calibrate AMG8833 8x8 IR grid thermal array matrix and perform temperature baseline verification across all 64 thermal pixels.',
    assignedMemberId: 'richi',
    week: 3,
    day: 'Wednesday',
    startDate: '2026-10-16',
    dueDate: '2026-10-19',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w3-hw2',
    title: 'Prepare connectors & wiring plan',
    description: 'Create schematics and color-coded wire harness diagram using JST-XH/Dupont quick-connectors to facilitate easy assembly.',
    assignedMemberId: 'archisman',
    week: 3,
    day: 'Thursday',
    startDate: '2026-10-16',
    dueDate: '2026-10-19',
    priority: 'Medium',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w3-mech',
    title: 'Complete enclosure/PCB mounting design',
    description: 'Incorporate internal standoff posts, ventilation slots for pressure sensor ambient readings, and structural access hatches.',
    assignedMemberId: 'srijani',
    week: 3,
    day: 'Friday',
    startDate: '2026-10-17',
    dueDate: '2026-10-21',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 4
  // ==========================================
  {
    id: 'w4-sw1',
    title: 'Read all sensors through ESP32',
    description: 'Integrate unified FreeRTOS sensor sampling task reading IMU, barometer, thermal grid, and battery level synchronously.',
    assignedMemberId: 'soumyajit',
    week: 4,
    day: 'Monday',
    startDate: '2026-10-22',
    dueDate: '2026-10-25',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w4-sw2',
    title: 'Develop telemetry/data format',
    description: 'Finalize compact telemetry binary/JSON string frame structure with packet sequence IDs, timestamps, and checksum bytes.',
    assignedMemberId: 'debanjona',
    week: 4,
    day: 'Tuesday',
    startDate: '2026-10-22',
    dueDate: '2026-10-25',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w4-hw1',
    title: 'Integrate sensors with ESP32',
    description: 'Solder and wire sensor breakout boards onto custom perfboard shield mounted directly on top of ESP32-S3 core board.',
    assignedMemberId: 'richi',
    week: 4,
    day: 'Wednesday',
    startDate: '2026-10-23',
    dueDate: '2026-10-26',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w4-hw2',
    title: 'Build power distribution system',
    description: 'Construct solid power distribution hub board with physical toggle switch, battery fuse, and regulated 5V/3.3V bus rails.',
    assignedMemberId: 'archisman',
    week: 4,
    day: 'Thursday',
    startDate: '2026-10-23',
    dueDate: '2026-10-26',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w4-mech',
    title: '3D print V1 structure',
    description: 'Slice and 3D print 1st mechanical prototype shell in PLA/PETG. Measure weight and verify mechanical tolerances with physical electronics.',
    assignedMemberId: 'srijani',
    week: 4,
    day: 'Friday',
    startDate: '2026-10-24',
    dueDate: '2026-10-28',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 5
  // ==========================================
  {
    id: 'w5-sw1',
    title: 'Sensor fusion + timestamping',
    description: 'Apply Madgwick AHRS filter algorithm on IMU data to compute pitch/roll/yaw orientation angles with microsecond timestamps.',
    assignedMemberId: 'soumyajit',
    week: 5,
    day: 'Monday',
    startDate: '2026-10-29',
    dueDate: '2026-11-01',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w5-sw2',
    title: 'Live telemetry display',
    description: 'Build real-time Ground Station GUI displaying live numerical sensor outputs, packet reception counter, and transmission link RSSI.',
    assignedMemberId: 'debanjona',
    week: 5,
    day: 'Tuesday',
    startDate: '2026-10-29',
    dueDate: '2026-11-01',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w5-hw1',
    title: 'Hardware integration',
    description: 'Interconnect telemetry radio transmitter module with external antenna mount and verify RF output power.',
    assignedMemberId: 'richi',
    week: 5,
    day: 'Wednesday',
    startDate: '2026-10-30',
    dueDate: '2026-11-02',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w5-hw2',
    title: 'Battery + power testing',
    description: 'Perform battery discharge endurance test under full system power draw (target: minimum 2 hours continuous flight operation).',
    assignedMemberId: 'archisman',
    week: 5,
    day: 'Thursday',
    startDate: '2026-10-30',
    dueDate: '2026-11-02',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w5-mech',
    title: 'Assemble structure with electronics',
    description: 'Mount power board, ESP32 shield, and sensors into printed V1 chassis stack. Inspect structural rigidity under manual strain.',
    assignedMemberId: 'srijani',
    week: 5,
    day: 'Friday',
    startDate: '2026-10-31',
    dueDate: '2026-11-04',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 6
  // ==========================================
  {
    id: 'w6-sw1',
    title: 'Data storage + error handling',
    description: 'Implement SPIFFS / SD card backup logging routine on ESP32 to prevent telemetry loss in case of RF signal dropouts during flight.',
    assignedMemberId: 'soumyajit',
    week: 6,
    day: 'Monday',
    startDate: '2026-11-05',
    dueDate: '2026-11-08',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w6-sw2',
    title: 'Graphs/plots & data analysis',
    description: 'Add real-time altitude profile graph, 3D orientation visualization model, and thermal heat map chart in Ground Station UI.',
    assignedMemberId: 'debanjona',
    week: 6,
    day: 'Tuesday',
    startDate: '2026-11-05',
    dueDate: '2026-11-08',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w6-hw1',
    title: 'Full electronics assembly',
    description: 'Finalize internal stack wiring, insulate exposed solder joints with heat-shrink tubing, and secure sensor modules with vibration dampening pads.',
    assignedMemberId: 'richi',
    week: 6,
    day: 'Wednesday',
    startDate: '2026-11-06',
    dueDate: '2026-11-09',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w6-hw2',
    title: 'Cable management + connectors',
    description: 'Route and tie all internal power and signal cables neatly to prevent interference and snagging during parachute deployment.',
    assignedMemberId: 'archisman',
    week: 6,
    day: 'Thursday',
    startDate: '2026-11-06',
    dueDate: '2026-11-09',
    priority: 'Medium',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w6-mech',
    title: 'Modify CAD based on assembly problems',
    description: 'Update CAD drawing tolerances based on V1 assembly feedback: enlarge cable routing holes and reinforce top parachute attachment ring.',
    assignedMemberId: 'srijani',
    week: 6,
    day: 'Friday',
    startDate: '2026-11-07',
    dueDate: '2026-11-11',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 7
  // ==========================================
  {
    id: 'w7-sw1',
    title: 'Complete firmware V1',
    description: 'Finalize and tag Firmware Version 1 release build featuring autonomous state machine (Pre-Flight -> Ascent -> Descent -> Landing).',
    assignedMemberId: 'soumyajit',
    week: 7,
    day: 'Monday',
    startDate: '2026-11-12',
    dueDate: '2026-11-15',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w7-sw2',
    title: 'Complete ground-station/software V1',
    description: 'Tag Version 1 release build of PC Ground Station telemetry suite with automated mission replay and log export features.',
    assignedMemberId: 'debanjona',
    week: 7,
    day: 'Tuesday',
    startDate: '2026-11-12',
    dueDate: '2026-11-15',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w7-hw1',
    title: 'Full system hardware test',
    description: 'Execute complete hardware flight bench test operating all sensors, memory logging, and radio telemetry simultaneously for 1 hour.',
    assignedMemberId: 'richi',
    week: 7,
    day: 'Wednesday',
    startDate: '2026-11-13',
    dueDate: '2026-11-16',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w7-hw2',
    title: 'Power-consumption test',
    description: 'Measure precise power consumption in active transmit vs sleep modes; verify power rail voltage stability under peak radio transmission.',
    assignedMemberId: 'archisman',
    week: 7,
    day: 'Thursday',
    startDate: '2026-11-13',
    dueDate: '2026-11-16',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w7-mech',
    title: '3D print V2/final structure',
    description: 'Print final iteration mechanical enclosure in high-strength PETG filament. Conduct mass measurement (< 450g achieved).',
    assignedMemberId: 'srijani',
    week: 7,
    day: 'Friday',
    startDate: '2026-11-14',
    dueDate: '2026-11-18',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 8
  // ==========================================
  {
    id: 'w8-sw1',
    title: 'Firmware stress testing',
    description: 'Subject ESP32 firmware to extreme loop rates, simulated corrupted I2C data, and memory leak checks over 4 hours continuous run.',
    assignedMemberId: 'soumyajit',
    week: 8,
    day: 'Monday',
    startDate: '2026-11-19',
    dueDate: '2026-11-22',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w8-sw2',
    title: 'End-to-end telemetry testing',
    description: 'Test telemetry link over 500m open field distance; measure packet loss rate and verify automatic reconnection protocol.',
    assignedMemberId: 'debanjona',
    week: 8,
    day: 'Tuesday',
    startDate: '2026-11-19',
    dueDate: '2026-11-22',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w8-hw1',
    title: 'Electronics + sensor calibration',
    description: 'Perform multi-point temperature and barometric pressure calibration against reference lab instruments; store calibration offset constants.',
    assignedMemberId: 'richi',
    week: 8,
    day: 'Wednesday',
    startDate: '2026-11-20',
    dueDate: '2026-11-23',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w8-hw2',
    title: 'Final wiring & safety checks',
    description: 'Perform electrical insulation breakdown check, short-circuit protection test, and inspect power toggle switch mechanism durability.',
    assignedMemberId: 'archisman',
    week: 8,
    day: 'Thursday',
    startDate: '2026-11-20',
    dueDate: '2026-11-23',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w8-mech',
    title: 'Final mechanical assembly',
    description: 'Assemble final mechanical structure with stainless steel fasteners and attach parachute rigging cord with locking carabiner.',
    assignedMemberId: 'srijani',
    week: 8,
    day: 'Friday',
    startDate: '2026-11-21',
    dueDate: '2026-11-25',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 9
  // ==========================================
  {
    id: 'w9-sw1',
    title: 'Fix bugs + optimize code',
    description: 'Address minor timing bugs identified during stress tests and optimize FreeRTOS task stack allocations for maximum stability.',
    assignedMemberId: 'soumyajit',
    week: 9,
    day: 'Monday',
    startDate: '2026-11-26',
    dueDate: '2026-11-29',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w9-sw2',
    title: 'Test data accuracy & generate reports',
    description: 'Verify packet data precision, test automated PDF/CSV flight report generator in Ground Station, and audit telemetry logs.',
    assignedMemberId: 'debanjona',
    week: 9,
    day: 'Tuesday',
    startDate: '2026-11-26',
    dueDate: '2026-11-29',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w9-hw1',
    title: 'Full CanSat integration test',
    description: 'Conduct simulated drop test from height (10m) while transmitting live telemetry to verify sensor resilience under shock.',
    assignedMemberId: 'richi',
    week: 9,
    day: 'Wednesday',
    startDate: '2026-11-27',
    dueDate: '2026-11-30',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w9-hw2',
    title: 'Battery/runtime + vibration checks',
    description: 'Vibration test assembled CanSat on shaker table; verify battery terminal connections remain completely solid.',
    assignedMemberId: 'archisman',
    week: 9,
    day: 'Thursday',
    startDate: '2026-11-27',
    dueDate: '2026-11-30',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w9-mech',
    title: 'Final structural inspection',
    description: 'Inspect outer body for micro-cracks post drop test, check parachute deployment clearance, and verify total weight (< 500g).',
    assignedMemberId: 'srijani',
    week: 9,
    day: 'Friday',
    startDate: '2026-11-28',
    dueDate: '2026-12-02',
    priority: 'High',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },

  // ==========================================
  // WEEK 10
  // ==========================================
  {
    id: 'w10-sw1',
    title: 'Final firmware freeze',
    description: 'Lock and seal final ESP32-S3 firmware binary (Version 1.0 Final). No further code modifications permitted.',
    assignedMemberId: 'soumyajit',
    week: 10,
    day: 'Monday',
    startDate: '2026-12-03',
    dueDate: '2026-12-05',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w10-sw2',
    title: 'Final software freeze',
    description: 'Lock and seal PC Ground Station Telemetry Software (Version 1.0 Final). Build standalone executable package.',
    assignedMemberId: 'debanjona',
    week: 10,
    day: 'Tuesday',
    startDate: '2026-12-03',
    dueDate: '2026-12-06',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w10-hw1',
    title: 'Final hardware freeze',
    description: 'Conclude all electronics calibration, lock hardware connections, and seal sensor ports for mission launch.',
    assignedMemberId: 'richi',
    week: 10,
    day: 'Wednesday',
    startDate: '2026-12-04',
    dueDate: '2026-12-07',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w10-hw2',
    title: 'Final system test',
    description: 'Execute 100% full mission dress rehearsal: power on, sensor acquisition, RF telemetry link, drop deployment simulation, and power down.',
    assignedMemberId: 'archisman',
    week: 10,
    day: 'Thursday',
    startDate: '2026-12-04',
    dueDate: '2026-12-07',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  },
  {
    id: 'w10-mech',
    title: 'Final CanSat assembly',
    description: 'Perform final flight assembly seal, affix competition team decals and parachute, and pack into protective flight case.',
    assignedMemberId: 'srijani',
    week: 10,
    day: 'Friday',
    startDate: '2026-12-05',
    dueDate: '2026-12-09',
    priority: 'Critical',
    status: 'Not Started',
    completionPercentage: 0,
    notes: ''
  }
];

export const INITIAL_DAILY_LOGS: DailyWorkLog[] = [
  {
    id: 'log-1',
    date: '2026-10-04',
    memberId: 'richi',
    taskId: 'w1-hw1',
    taskTitle: 'Study all sensors/modules',
    workCompleted: 'Analyzed operating voltages and datasheet specifications for BMP280, MPU6050, and AMG8833 thermal array.',
    progressPercentage: 100,
    hoursWorked: 6,
    status: 'Completed',
    blocker: 'None',
    nextStep: 'Begin breadboard individual sensor communication tests in Week 2.',
    createdAt: '2026-10-04T16:30:00Z'
  },
  {
    id: 'log-2',
    date: '2026-10-04',
    memberId: 'soumyajit',
    taskId: 'w1-sw1',
    taskTitle: 'Study ESP32-S3, Arduino/ESP-IDF',
    workCompleted: 'Configured ESP-IDF toolchain and verified ESP32-S3 Dual-Core pinouts for I2C and SPI buses.',
    progressPercentage: 65,
    hoursWorked: 4.5,
    status: 'In Progress',
    blocker: 'None',
    nextStep: 'Test ESP32-S3 basic firmware compilation and serial output in Week 2.',
    createdAt: '2026-10-04T17:15:00Z'
  },
  {
    id: 'log-3',
    date: '2026-10-04',
    memberId: 'archisman',
    taskId: 'w1-hw2',
    taskTitle: 'Study battery, power & wiring',
    workCompleted: 'Calculated 650mA peak current draw for ESP32 + radio + sensors. Assembled 5V regulator rail.',
    progressPercentage: 50,
    hoursWorked: 3,
    status: 'In Progress',
    blocker: 'Regulator heating up under peak RF power draw. Testing aluminum heatsink attachment.',
    nextStep: 'Conduct thermal load test with heatsink mounted.',
    createdAt: '2026-10-04T18:00:00Z'
  },
  {
    id: 'log-4',
    date: '2026-10-04',
    memberId: 'srijani',
    taskId: 'w1-mech',
    taskTitle: 'Finalize CanSat dimensions & CAD concept',
    workCompleted: 'Completed cylindrical shell envelope concept in SolidWorks (115mm diameter x 200mm height constraint).',
    progressPercentage: 75,
    hoursWorked: 7,
    status: 'In Progress',
    blocker: 'None',
    nextStep: 'Begin detailed 3D CAD modeling in Week 2.',
    createdAt: '2026-10-04T18:45:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Blocker Alert',
    message: "Archisman Nebu's task 'Study battery, power & wiring' reported regulator heating issue.",
    type: 'danger',
    timestamp: '2026-10-04T18:00:00Z',
    read: false,
    relatedMemberId: 'archisman',
    relatedTaskId: 'w1-hw2'
  },
  {
    id: 'notif-2',
    title: 'Daily Update Pending',
    message: "Debanjona Kundu has not submitted a daily work log entry for today.",
    type: 'warning',
    timestamp: '2026-10-04T19:00:00Z',
    read: false,
    relatedMemberId: 'debanjona'
  },
  {
    id: 'notif-3',
    title: 'Task Completed',
    message: "Richi Paul completed 'Study all sensors/modules' with 100% progress!",
    type: 'success',
    timestamp: '2026-10-04T16:30:00Z',
    read: true,
    relatedMemberId: 'richi',
    relatedTaskId: 'w1-hw1'
  },
  {
    id: 'notif-4',
    title: 'Upcoming Milestone',
    message: "Week 2 'Basic Bench Testing & CAD Blueprint' starts tomorrow.",
    type: 'info',
    timestamp: '2026-10-04T12:00:00Z',
    read: true
  }
];
