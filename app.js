const weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五"];
const periods = ["1–2 节", "3–4 节", "5–6 节", "7–8 节", "9–10 节"];

const schedule = {
  "2026-2027-1": [
    { day: 0, slot: 0, name: "操作系统实现技术", room: "A4N204 · 禄口", teacher: "耿必鹏", weeks: "16–17 周" },
    { day: 1, slot: 0, name: "操作系统实现技术", room: "A4N206 · 禄口", teacher: "耿必鹏", weeks: "16–20 周" },
    { day: 1, slot: 0, name: "编译原理与实现", room: "A4N203 · 禄口", teacher: "闵芳", weeks: "2–11 周" },
    { day: 2, slot: 0, name: "计算机网络原理", room: "A4S504 · 禄口", teacher: "欧历云", weeks: "2–11 周" },
    { day: 3, slot: 0, name: "编译原理与实现", room: "A4N403 · 禄口", teacher: "闵芳", weeks: "1–10 周" },
    { day: 4, slot: 0, name: "操作系统原理", room: "A4S404 · 禄口", teacher: "罗娇敏", weeks: "1–12 周" },
    { day: 0, slot: 1, name: "操作系统原理", room: "A4N308 · 禄口", teacher: "罗娇敏", weeks: "2–12 周" },
    { day: 2, slot: 1, name: "操作系统原理", room: "A4N304 · 禄口", teacher: "罗娇敏", weeks: "第 3 周" },
    { day: 3, slot: 1, name: "操作系统实现技术", room: "A4N205 · 禄口", teacher: "耿必鹏", weeks: "16–20 周" },
    { day: 4, slot: 1, name: "计算机网络原理", room: "A4N403 · 禄口", teacher: "欧历云", weeks: "2–11 周" },
    { day: 1, slot: 2, name: "数据库实现", room: "机房 7 · 禄口", teacher: "李莹", weeks: "5–12 周" },
    { day: 1, slot: 3, name: "数据库实现（上机）", room: "等信息中心安排", teacher: "李莹", weeks: "6–12 周" },
    { day: 1, slot: 1, name: "数据库实现（上机）", room: "等信息中心安排", teacher: "李莹", weeks: "第 12 周" },
  ],
  "2025-2026-2": [],
};

const desktopSchedule = document.querySelector("#desktopSchedule");
const mobileSchedule = document.querySelector("#mobileSchedule");
const template = document.querySelector("#courseTemplate");
const classInput = document.querySelector("#classInput");
const termSelect = document.querySelector("#termSelect");
const weekSelect = document.querySelector("#weekSelect");
const title = document.querySelector("#scheduleTitle");
const count = document.querySelector("#courseCount");
const weekNote = document.querySelector("#weekNote");

for (let week = 1; week <= 20; week += 1) {
  const option = document.createElement("option");
  option.value = week;
  option.textContent = `第 ${week} 周`;
  weekSelect.append(option);
}

function courseRunsInWeek(course, week) {
  const numbers = course.weeks.match(/\d+/g)?.map(Number) || [];
  if (numbers.length === 1) return numbers[0] === week;
  return week >= numbers[0] && week <= numbers[1];
}

function makeCard(course, period, index) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".course-card");
  card.classList.add(`theme-${index % 5}`);
  fragment.querySelector(".course-weeks").textContent = course.weeks;
  fragment.querySelector(".course-period").textContent = period;
  fragment.querySelector(".course-name").textContent = course.name;
  fragment.querySelector(".course-place").textContent = course.room;
  fragment.querySelector(".course-teacher").textContent = course.teacher;
  return fragment;
}

function renderDesktop(courses) {
  desktopSchedule.replaceChildren();
  const corner = document.createElement("div");
  corner.className = "schedule-cell header";
  corner.textContent = "节次";
  desktopSchedule.append(corner);
  weekdays.forEach((day) => {
    const header = document.createElement("div");
    header.className = "schedule-cell header";
    header.textContent = day;
    desktopSchedule.append(header);
  });
  periods.forEach((period, slot) => {
    const periodCell = document.createElement("div");
    periodCell.className = "schedule-cell period";
    periodCell.textContent = period;
    desktopSchedule.append(periodCell);
    weekdays.forEach((_, day) => {
      const cell = document.createElement("div");
      cell.className = "schedule-cell";
      const cellCourses = courses.filter((course) => course.day === day && course.slot === slot);
      cellCourses.forEach((course, index) => cell.append(makeCard(course, period, index + day + slot)));
      if (!cellCourses.length) cell.innerHTML = '<div class="empty">—</div>';
      desktopSchedule.append(cell);
    });
  });
}

function renderMobile(courses) {
  mobileSchedule.replaceChildren();
  weekdays.forEach((day, dayIndex) => {
    const dayCourses = courses.filter((course) => course.day === dayIndex);
    const block = document.createElement("section");
    block.className = "day-block";
    block.innerHTML = `<div class="day-heading">${day}<span>${dayCourses.length} 个课程时段</span></div>`;
    const list = document.createElement("div");
    list.className = "day-courses";
    if (dayCourses.length) dayCourses.forEach((course, index) => list.append(makeCard(course, periods[course.slot], index + dayIndex)));
    else list.innerHTML = '<div class="empty">当天没有课程</div>';
    block.append(list);
    mobileSchedule.append(block);
  });
}

function renderSchedule() {
  const selectedWeek = Number(weekSelect.value);
  const courses = (schedule[termSelect.value] || []).filter((course) => courseRunsInWeek(course, selectedWeek));
  const className = classInput.value.trim() || "未填写班级";
  title.textContent = `${className} 班课程表`;
  count.textContent = courses.length;
  weekNote.textContent = `第 ${selectedWeek} 周 · 数据更新于 2026.09.10`;
  renderDesktop(courses);
  renderMobile(courses);
}

document.querySelector("#queryButton").addEventListener("click", renderSchedule);
termSelect.addEventListener("change", renderSchedule);
weekSelect.addEventListener("change", renderSchedule);
classInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") renderSchedule();
});

renderSchedule();
