// Define all possible bus stops
export const busStops = [
  { id: 1, name: "ศาลาพระเกี้ยว" },
  { id: 2, name: "คณะรัฐศาสตร์" },
  { id: 3, name: "รร.สาธิต มศว. ปทุมวัน" },
  { id: 4, name: "คณะสัตวแพทยศาสตร์" },
  { id: 5, name: "แยกเฉลิมเผ่า" },
  { id: 6, name: "ลิโด้สยาม" },
  { id: 7, name: "คณะเกษตรศาสตร์" },
  { id: 8, name: "อาคาร 60 ปี คณะสัตวแพทยศาสตร์" },
  { id: 9, name: "รร.เตรียมอุดมศึกษา" },
  { id: 10, name: "คณะสถาปัตยกรรมศาสตร์" },
  { id: 11, name: "คณะอักษรศาสตร์" },
  { id: 12, name: "คณะวิศวกรรมศาสตร์" },
  { id: 13, name: "คณะครุศาสตร์" },
  { id: 14, name: "ศูนย์กีฬา" },
  { id: 15, name: "ตรงข้ามอาคารจามจุรี 9" },
  { id: 16, name: "ยูเซ็นเตอร์" },
  { id: 17, name: "สามย่านมิตรทาวน์" },
];

// Randomly assign stops to each line
function getRandomStops(count: number) {
  const shuffled = [...busStops].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Create route information for each line
export const busRoutes = {
  "Line 1": {
    color: "#ec4899", // pink-500
    stops: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12],
    description: "Main campus loop service with frequent departures",
  },
  "Line 2": {
    color: "#be185d", // pink-700
    stops: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12],
    description: "Express service connecting major academic buildings",
  },
  "Line 3": {
    color: "#db2777", // pink-600
    stops: getRandomStops(6),
    description: "Residential areas to central campus connector",
  },
  "Line 4": {
    color: "#9d174d", // pink-800
    stops: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12],
    description: "Outer campus loop with stops at all major facilities",
  },
};
