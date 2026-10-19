const AGE_GROUPS = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];
const EDUCATION = ["10th", "12th", "University (pursuing)", "Graduate", "Postgraduate"];
const SETTINGS = ["On my own", "With my parents", "With children under 12 (or hypothetically)", "With my friends"];
const DEFAULT_CLIPS = [
  {id:"clip-01",title:"Clip 1",url:"https://www.youtube.com/watch?v=mz6dgt11n-E",note:""},
  {id:"clip-02",title:"Clip 2",url:"https://youtube.com/shorts/PcBPbpPCPcQ?si=sxN5MYp85vakGkA7",note:""},
  {id:"clip-03",title:"Clip 3",url:"https://youtube.com/shorts/lIAdPolfcpw?si=g11mMkAlnW3FioxT",note:""},
  {id:"clip-04",title:"Clip 4",url:"https://www.youtube.com/shorts/6GEmAYazwyg",note:""},
  {id:"clip-05",title:"Clip 5",url:"https://www.youtube.com/shorts/Pu822ETn4Ds",note:""},
  {id:"clip-06",title:"Clip 6",url:"https://youtube.com/shorts/0NgaOpQr6fE?si=R8SgRQMNciQv1H1t",note:""},
  {id:"clip-07",title:"Clip 7",url:"https://www.youtube.com/shorts/hX2ujhxHg_4",note:""},
  {id:"clip-08",title:"Clip 8",url:"https://youtube.com/shorts/NGkmKaLFeNI?si=bH-zRSg-2UoMgqEF",note:""},
  {id:"clip-09",title:"Clip 9",url:"https://www.youtube.com/shorts/GfvHcweejA4",note:""},
  {id:"clip-10",title:"Clip 10",url:"https://youtube.com/shorts/pPDAfWgO-4c?si=eEOKv2r5ku7jtOCL",note:""},
  {id:"clip-11",title:"Clip 11",url:"https://youtube.com/shorts/fdyfAVKRxfg?si=pS6wm2kpAvvZYVMn",note:""}
];
let config = { clips: DEFAULT_CLIPS, estimatedMinutes: 12 };
let answers = {};
let currentClip = 0;
let importedResponses = [];
const byId = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));

byId("clip-count").textContent = config.clips.length;
fetch("clips.json").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
  config = data;
  byId("clip-count").textContent = data.clips?.length ?? 0;
  byId("time-estimate").textContent = `${data.estimatedMinutes || 5} minutes`;
}).catch(() => { /* Direct file:// opens use the built-in clip list above. */ });

byId("start-button").addEventListener("click", () => {
  if (!config.clips?.length) {
    alert("This survey is being set up. The researcher needs to add clips to clips.json before participants can begin.");
    return;
  }
  answers = { demographics: { languages: [""], genres: [""] }, ratings: [] };
  currentClip = 0;
  byId("welcome-screen").classList.add("hidden");
  byId("survey-screen").classList.remove("hidden");
  renderDemographics();
  window.scrollTo(0, 0);
});

function setProgress(step, count, label) {
  byId("step-label").textContent = label;
  byId("progress-label").textContent = `${step} of ${count}`;
  byId("progress-fill").style.width = `${Math.round((step / count) * 100)}%`;
}
function inputField(key, label, placeholder = "Type your answer", hint = "", required = false) {
  return `<div class="field"><label class="field-label" for="${key}">${label}<span class="optional">${required ? "REQUIRED" : "OPTIONAL"}</span></label><input class="input" id="${key}" name="${key}" type="text" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""}>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;
}
function renderDemographics() {
  const d = answers.demographics;
  setProgress(1, 2 + config.clips.length, "BACKGROUND");
  byId("survey-content").innerHTML = `<h2>A little about you</h2><p class="section-intro">These optional questions help us understand the range of perspectives in the study. Please skip anything you would rather not answer.</p>
    ${inputField("participantName", "Your name", "Enter your name", "Your name will be included with your answers in the response file.", true)}
    <div class="field"><span class="field-label">Age group<span class="optional">OPTIONAL</span></span><div class="choices">${AGE_GROUPS.map(x => `<label class="choice"><input type="radio" name="ageGroup" value="${x}"><span>${x}</span></label>`).join("")}</div></div>
    <div class="field"><span class="field-label">Gender<span class="optional">OPTIONAL</span></span><div class="choices">${["M", "F", "T", "Self-describe"].map(x => `<label class="choice"><input type="radio" name="gender" value="${x}"><span>${x}</span></label>`).join("")}</div><input class="input hidden" id="genderSelf" placeholder="How would you describe your gender?" style="margin-top:9px"></div>
    ${inputField("region", "State or region you hail from", "e.g. Rajasthan")}
    ${inputField("schooling", "State or city where you went to school", "Type NA if you had no schooling")}
    <div class="field"><label class="field-label" for="education">Highest education qualification<span class="optional">OPTIONAL</span></label><select class="select" id="education"><option value="">Select an option</option>${EDUCATION.map(x => `<option>${x}</option>`).join("")}</select></div>
    ${listField("languages", "Languages you speak", "Add a language")}
    ${inputField("watching", "Who do you typically watch films with?", "e.g. family, friends, mostly alone")}
    ${inputField("children", "Do children live in your household?", "You can say yes, no, or describe")}
    ${listField("genres", "Genres you enjoy", "Add a genre")}
    <div class="consent-box"><p><strong>Consent for research use</strong><br>Your name and responses will be used for academic research about media viewing comfort and translation. Your response is identifiable to the researcher because it includes your name. Participation is voluntary. You may skip any optional question or stop before submitting. Your response file will be downloaded to this device and shared with the researcher only if you choose to send it. This survey does not upload responses to a server.</p><label class="consent-check"><input id="consent" type="checkbox"><span>I am 18 or older, have read the information above, and agree to take part.</span></label></div>
    <div class="form-actions"><span></span><button class="primary-button" id="to-clips" type="button">Continue to clips <span aria-hidden="true">→</span></button></div>`;
  document.querySelectorAll('input[name="ageGroup"]').forEach(el => el.addEventListener("change", e => d.ageGroup = e.target.value));
  document.querySelectorAll('input[name="gender"]').forEach(el => el.addEventListener("change", e => {
    d.gender = e.target.value;
    byId("genderSelf").classList.toggle("hidden", e.target.value !== "Self-describe");
  }));
  byId("genderSelf").addEventListener("input", e => d.genderSelf = e.target.value);
  [["region", "region"], ["schooling", "schooling"], ["watching", "typicalViewingCompany"], ["children", "childrenInHousehold"]].forEach(([id,key]) => byId(id).addEventListener("input", e => d[key] = e.target.value));
  byId("education").addEventListener("change", e => d.education = e.target.value);
  bindList("languages", d); bindList("genres", d);
  if (d.ageGroup) { const age = document.querySelector(`input[name="ageGroup"][value="${CSS.escape(d.ageGroup)}"]`); if (age) age.checked = true; }
  if (d.gender) { const gender = document.querySelector(`input[name="gender"][value="${CSS.escape(d.gender)}"]`); if (gender) gender.checked = true; }
  byId("genderSelf").value = d.genderSelf || "";
  byId("genderSelf").classList.toggle("hidden", d.gender !== "Self-describe");
  [["participantName","participantName"],["region","region"],["schooling","schooling"],["watching","typicalViewingCompany"],["children","childrenInHousehold"]].forEach(([id,key]) => byId(id).value = d[key] || "");
  byId("education").value = d.education || "";
  byId("consent").checked = Boolean(d.consent);
  [["languages","languages"],["genres","genres"]].forEach(([key, field]) => {
    const saved = d[field] || [];
    const list = byId(`${key}-list`);
    list.querySelector("input").value = saved[0] || "";
    for (const value of saved.slice(1)) {
      const row = document.createElement("div"); row.className = "tag-row";
      row.innerHTML = `<input class="input" type="text" data-list="${key}" placeholder="Add another"><button class="small-button" type="button" aria-label="Remove item">Remove</button>`;
      row.querySelector("input").value = value;
      row.querySelector("button").addEventListener("click", () => { row.remove(); d[field] = [...list.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean); });
      row.querySelector("input").addEventListener("input", () => { d[field] = [...list.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean); });
      list.append(row);
    }
  });
  byId("to-clips").addEventListener("click", () => {
    d.participantName = byId("participantName").value.trim();
    if (!d.participantName) { alert("Please enter your name to continue."); byId("participantName").focus(); return; }
    if (!byId("consent").checked) { alert("Please provide consent to continue, or close the survey."); return; }
    d.consent = true; renderClip();
  });
}
function listField(key, label, button) {
  return `<div class="field"><span class="field-label">${label}<span class="optional">OPTIONAL</span></span><div class="tag-list" id="${key}-list"><div class="tag-row"><input class="input" type="text" data-list="${key}" placeholder="${button.replace("Add a ", "e.g. ")}"></div></div><button class="small-button" type="button" data-add="${key}">＋ ${button}</button></div>`;
}
function bindList(key, object) {
  const list = byId(`${key}-list`);
  const sync = () => { object[key] = [...list.querySelectorAll("input")].map(x => x.value.trim()).filter(Boolean); };
  list.querySelector("input").addEventListener("input", sync);
  document.querySelector(`[data-add="${key}"]`).addEventListener("click", () => {
    const row = document.createElement("div"); row.className = "tag-row";
    row.innerHTML = `<input class="input" type="text" data-list="${key}" placeholder="Add another"><button class="small-button" type="button" aria-label="Remove item">Remove</button>`;
    row.querySelector("button").addEventListener("click", () => { row.remove(); sync(); });
    row.querySelector("input").addEventListener("input", sync); list.append(row); row.querySelector("input").focus();
  });
}
function getEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("youtu.be")) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(u.pathname.slice(1))}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.pathname === "/watch" ? u.searchParams.get("v") : u.pathname.split("/").filter(Boolean).at(-1);
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (u.hostname.includes("reddit.com") && /\/comments\//.test(u.pathname)) return `${u.origin}${u.pathname.replace(/\/$/, "")}/?embed=true`;
  } catch {}
  return "";
}
function renderClip() {
  const clip = config.clips[currentClip];
  const step = currentClip + 2;
  setProgress(step, 2 + config.clips.length, `CLIP ${currentClip + 1} / ${config.clips.length}`);
  const embed = getEmbed(clip.url || "");
  const ratings = SETTINGS.map((setting, i) => `<div class="rating-row"><span>${setting}</span><div class="rating-options" role="radiogroup" aria-label="Comfort ${setting}">${[1,2,3,4,5].map(n => `<span class="rating-option"><input type="radio" id="r${i}-${n}" name="rating-${i}" value="${n}"><label for="r${i}-${n}">${n}</label></span>`).join("")}</div></div>`).join("");
  byId("survey-content").innerHTML = `<h2>${escapeHtml(clip.title || `Clip ${currentClip+1}`)}</h2><p class="section-intro">Watch the clip, then rate how comfortable you would feel watching it in each setting. Skip the clip if you prefer.</p>
    <div class="clip-card"><div class="clip-frame">${embed ? `<iframe src="${escapeHtml(embed)}" title="${escapeHtml(clip.title || "Survey clip")}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>` : `<a class="clip-link" href="${escapeHtml(clip.url || "#")}" target="_blank" rel="noopener noreferrer">Open this clip in a new tab ↗</a>`}</div><div class="clip-copy"><strong>${escapeHtml(clip.title || "Video clip")}</strong>${clip.note ? `<p>${escapeHtml(clip.note)}</p>` : ""}</div></div>
    <div class="rating-title">How comfortable would you feel?</div><p class="rating-scale">Choose one answer for each viewing situation.</p>${ratings}<div class="rating-ends"><span>1 · Not at all comfortable</span><span>5 · Very comfortable</span></div>
    <label class="choice skip-choice"><input type="checkbox" id="skip-clip"><span>Skip this clip</span></label>
    <div class="form-actions">${currentClip === 0 ? `<button class="back-button" id="back-demographics" type="button">← Back</button>` : `<button class="back-button" id="back-clip" type="button">← Previous clip</button>`}<button class="primary-button" id="next-clip" type="button">${currentClip + 1 === config.clips.length ? "Finish survey" : "Next clip"}<span aria-hidden="true">→</span></button></div>`;
  const saved = answers.ratings[currentClip];
  if (saved) saved.scores?.forEach((v,i) => { const el = document.querySelector(`input[name="rating-${i}"][value="${v}"]`); if (el) el.checked = true; });
  byId("skip-clip").checked = saved?.skipped || false;
  byId("back-demographics")?.addEventListener("click", renderDemographics);
  byId("back-clip")?.addEventListener("click", () => { collectRatings(); currentClip--; renderClip(); });
  byId("next-clip").addEventListener("click", () => {
    collectRatings();
    if (currentClip < config.clips.length - 1) { currentClip++; renderClip(); }
    else renderComplete();
  });
}
function collectRatings() {
  const skipped = byId("skip-clip").checked;
  const scores = SETTINGS.map((_,i) => document.querySelector(`input[name="rating-${i}"]:checked`)?.value || "");
  answers.ratings[currentClip] = { clipId: config.clips[currentClip].id, clipTitle: config.clips[currentClip].title, scores: skipped ? ["","","",""] : scores, skipped };
}
function renderComplete() {
  setProgress(config.clips.length + 2, config.clips.length + 2, "COMPLETE");
  byId("survey-content").innerHTML = `<h2>Thank you for taking part.</h2><p class="section-intro">Your responses are ready. Download the file, then send it to the researcher using the method they provided.</p><div class="complete-card"><strong>Your file stays with you</strong><p>Nothing was sent automatically. The downloaded file contains your name and clip ratings, so it identifies your response to the researcher.</p></div><button class="primary-button" id="download-response" type="button">Download my response <span aria-hidden="true">↓</span></button><p class="privacy-small">If you close this page without downloading, your answers will not be submitted. You may delete the downloaded file at any time.</p>`;
  byId("download-response").addEventListener("click", downloadResponse);
}
function downloadResponse() {
  const response = { survey: "Watching Together", schemaVersion: 1, submittedAt: new Date().toISOString(), ...answers };
  const blob = new Blob([JSON.stringify(response, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href=url; link.download=`media-comfort-response-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(url);
}
byId("organizer-button").addEventListener("click", () => { byId("welcome-screen").classList.add("hidden"); byId("organizer-screen").classList.remove("hidden"); });
byId("close-organizer").addEventListener("click", () => { byId("organizer-screen").classList.add("hidden"); byId("welcome-screen").classList.remove("hidden"); });
byId("response-files").addEventListener("change", async e => {
  const files = [...e.target.files]; importedResponses = [];
  for (const file of files) {
    try { const r = JSON.parse(await file.text()); if (r.survey === "Watching Together" && Array.isArray(r.ratings)) importedResponses.push(r); }
    catch { /* Ignore invalid JSON files. */ }
  }
  byId("import-status").textContent = `${importedResponses.length} valid response${importedResponses.length === 1 ? "" : "s"} imported from ${files.length} file${files.length === 1 ? "" : "s"}.`;
  byId("export-csv").disabled = importedResponses.length === 0;
});
byId("export-csv").addEventListener("click", () => {
  const headers = ["response_id","submitted_at","participant_name","age_group","gender","gender_self_describe","region","schooling_location","education","languages","typical_viewing_company","children_in_household","genres",...config.clips.flatMap((clip) => ["alone","with_parents","with_children_under_12","with_friends"].map(setting => `comfort_${clip.id}_${setting}`)),...config.clips.map(clip=>`clip_${clip.id}_skipped`)];
  const rows = importedResponses.map((r,index) => {
    const d=r.demographics||{}; const base=[index+1,r.submittedAt,d.participantName,d.ageGroup,d.gender,d.genderSelf,d.region,d.schooling,d.education,(d.languages||[]).join("; "),d.typicalViewingCompany,d.childrenInHousehold,(d.genres||[]).join("; ")];
    const scoreVals=config.clips.flatMap((_,i)=>[0,1,2,3].map(j=>r.ratings?.[i]?.scores?.[j]||""));
    const skipVals=config.clips.map((_,i)=>r.ratings?.[i]?.skipped ? "yes" : "no");
    return [...base,...scoreVals,...skipVals];
  });
  const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="media-comfort-responses.csv";a.click();URL.revokeObjectURL(url);
});
