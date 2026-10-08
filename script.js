// Typing effect
const roles = ["Full-Stack Developer", "REST API Builder", "ML Enthusiast", "Problem Solver"];
const typed = document.getElementById("typed");
let r = 0, i = 0, del = false;
(function type() {
  const word = roles[r];
  typed.textContent = "> " + word.slice(0, i);
  if (!del && i < word.length) i++;
  else if (!del) { del = true; return setTimeout(type, 1400); }
  else if (i > 0) i--;
  else { del = false; r = (r + 1) % roles.length; }
  setTimeout(type, del ? 40 : 85);
})();

// Scroll reveal + counters
const countUp = el => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  let n = 0; const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n + suffix; if (n >= target) clearInterval(t); }, 35);
};
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-count]").forEach(countUp);
  io.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Scroll progress + active nav link
const links = [...document.querySelectorAll(".nav nav a")];
const sections = links.map(a => document.querySelector(a.getAttribute("href")));
addEventListener("scroll", () => {
  const h = document.documentElement;
  document.getElementById("progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  const y = scrollY + 140;
  sections.forEach((s, k) => links[k].classList.toggle("active", s && s.offsetTop <= y && s.offsetTop + s.offsetHeight > y));
});

// 3D tilt on hero code window
const tilt = document.getElementById("tilt");
tilt.addEventListener("mousemove", e => {
  const b = tilt.getBoundingClientRect();
  const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
  tilt.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
});
tilt.addEventListener("mouseleave", () => (tilt.style.transform = ""));

// Project filters
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest("button"); if (!btn) return;
  document.querySelectorAll("#filters button").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelectorAll(".card").forEach(c => c.classList.toggle("hide", btn.dataset.f !== "all" && c.dataset.cat !== btn.dataset.f));
});

// LeetCode: live stats (graceful fallback if the API is down)
document.getElementById("lcCard").addEventListener("error", e => e.target.classList.add("err"));
fetch("https://leetcode-stats-api.herokuapp.com/shrads29")
  .then(r => r.json())
  .then(d => {
    if (d.status !== "success") return;
    document.getElementById("lcStats").innerHTML =
      `<div><b>${d.totalSolved}</b><span>Solved</span></div>
       <div><b>${d.easySolved}</b><span>Easy</span></div>
       <div><b>${d.mediumSolved}</b><span>Medium</span></div>
       <div><b>${d.hardSolved}</b><span>Hard</span></div>`;
  }).catch(() => {});

// Contact form -> opens the visitor's email app (no backend needed)
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get("msg")}\n\nFrom: ${f.get("name")} (${f.get("email")})`;
  location.href = `mailto:shradhatiwari2901@gmail.com?subject=${encodeURIComponent("Portfolio message from " + f.get("name"))}&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = new Date().getFullYear();
