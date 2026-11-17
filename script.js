const subjects = window.STUDY_DATA || [];
const $ = (id) => document.getElementById(id);
let currentSubject = null;
let currentTab = "summaries";
const icons = { "psicologia-hospitalar":"✚", "psicologia-comunitaria":"♡", "processos-grupais":"◎" };

function showView(viewId) {
  ["homeView","subjectView","allSummariesView","allActivitiesView"].forEach(id => $(id).classList.toggle("hidden", id !== viewId));
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  if (viewId === "homeView") $("navHome").classList.add("active");
  if (viewId === "allSummariesView") $("navSummaries").classList.add("active");
  if (viewId === "allActivitiesView") $("navActivities").classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderCards(targetId) {
  $(targetId).innerHTML = subjects.map(s => `<button class="subject-card" data-subject="${s.id}">
    <span class="card-icon">${s.symbol}</span><h3>${s.name}</h3><p>${s.description}</p><span class="card-link">Acessar matéria →</span>
  </button>`).join("");
  $(targetId).querySelectorAll("[data-subject]").forEach(btn => btn.addEventListener("click", () => openSubject(btn.dataset.subject)));
}
function openSubject(id, tab="summaries") {
  currentSubject = subjects.find(s => s.id === id);
  if (!currentSubject) return;
  $("subjectTitle").textContent = currentSubject.name;
  $("subjectDescription").textContent = currentSubject.description;
  $("subjectSymbol").textContent = currentSubject.symbol;
  currentTab = tab; setTab(tab);
  renderMaterials();
  renderQuestions();
  showView("subjectView");
}
function setTab(tab) {
  currentTab = tab;
  $("subjectSummaries").classList.toggle("hidden", tab !== "summaries");
  $("subjectActivities").classList.toggle("hidden", tab !== "activities");
  document.querySelectorAll(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
}
function allMaterials() {
  return subjects.flatMap(s => (s.materials || []).map(m => ({...m, subject:s.name})));
}
function materialMarkup(m) {
  return `<div class="summary-item"><span class="file-icon">▤</span><div class="file-info"><strong>${escapeHtml(m.title)}</strong><small>${escapeHtml(m.subject)} · ${escapeHtml(m.type || "Material de estudo")}</small></div><a class="download-link" href="${encodeURI(m.file)}" target="_blank" rel="noopener">Abrir arquivo ↗</a></div>`;
}
function renderMaterials() {
  const items = currentSubject.materials || [];
  $("summaryList").innerHTML = items.length ? items.map(materialMarkup).join("") : `<div class="empty-state">Ainda não há resumos cadastrados nesta matéria.<br>Quando você me enviar seus arquivos, vou incluí-los aqui.</div>`;
}
function renderAllMaterials() {
  const items = allMaterials();
  $("allSummaryList").innerHTML = items.length ? items.map(materialMarkup).join("") : `<div class="empty-state">Os resumos aparecerão aqui quando os arquivos forem adicionados ao projeto.</div>`;
}
function storageKey() { return `provas-questions-${currentSubject.id}`; }
function getQuestions() { try { return JSON.parse(localStorage.getItem(storageKey()) || "[]"); } catch { return []; } }
function saveQuestions(q) { localStorage.setItem(storageKey(), JSON.stringify(q)); }
function renderQuestions() {
  if (!currentSubject) return;
  const qs = getQuestions();
  $("questionCount").textContent = `${qs.length} ${qs.length === 1 ? "questão" : "questões"}`;
  $("questionList").innerHTML = qs.length ? qs.map((q,i) => `<article class="question-card">
    <h4>${i+1}. ${escapeHtml(q.text)}</h4>
    ${q.options.map((o,j)=>`<label class="answer-option"><input type="radio" name="q${i}" value="${j}">${"ABCD"[j]}) ${escapeHtml(o)}</label>`).join("")}
    <button class="check-btn" data-check="${i}">Conferir resposta</button>
    <p class="feedback hidden" id="feedback${i}"></p>
  </article>`).join("") : `<div class="empty-state">Nenhuma questão criada ainda. Use o formulário ao lado para montar a primeira.</div>`;
  $("questionList").querySelectorAll("[data-check]").forEach(btn => btn.addEventListener("click", () => {
    const i = Number(btn.dataset.check), q = qs[i], chosen = document.querySelector(`input[name="q${i}"]:checked`), fb = $(`feedback${i}`);
    fb.classList.remove("hidden","wrong");
    if (!chosen) { fb.textContent = "Selecione uma alternativa antes de conferir."; fb.classList.add("wrong"); return; }
    const correct = Number(chosen.value) === Number(q.correct);
    fb.textContent = correct ? `Muito bem! Resposta correta.${q.explanation ? " " + q.explanation : ""}` : `Não foi dessa vez. A resposta correta é ${"ABCD"[q.correct]}.${q.explanation ? " " + q.explanation : ""}`;
    if (!correct) fb.classList.add("wrong");
  }));
}
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

renderCards("subjectGrid");
renderCards("activitySubjectGrid");
renderAllMaterials();
$("homeLink").addEventListener("click", e => { e.preventDefault(); showView("homeView"); });
$("navHome").addEventListener("click", () => showView("homeView"));
$("navSummaries").addEventListener("click", () => { renderAllMaterials(); showView("allSummariesView"); });
$("navActivities").addEventListener("click", () => showView("allActivitiesView"));
["backHome","backHome2","backHome3"].forEach(id => $(id).addEventListener("click", () => showView("homeView")));
document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => setTab(b.dataset.tab)));
$("questionForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!currentSubject) return;
  const q = {text:$("questionText").value.trim(), options:[$("optA").value.trim(),$("optB").value.trim(),$("optC").value.trim(),$("optD").value.trim()], correct:Number($("correctAnswer").value), explanation:$("explanation").value.trim()};
  const qs = getQuestions(); qs.push(q); saveQuestions(qs); e.target.reset(); renderQuestions();
});
