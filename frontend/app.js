// ============================================================
// COMBATPREP — Soldier Readiness & Skill Assessment Tool
// ============================================================

// ---- DATA STORE ----
const DB = {
  users: [
    { id: 1, name: 'Col. Rajesh Sharma', username: 'admin', password: 'admin123', role: 'admin', unit: 'HQ', email: 'rsharma@combatprep.mil', joined: '2024-01-10', status: 'active' },
    { id: 2, name: 'Maj. Arjun Mehta', username: 'officer1', password: 'officer123', role: 'officer', unit: 'Alpha', email: 'amehta@combatprep.mil', joined: '2024-02-15', status: 'active' },
    { id: 3, name: 'Capt. Priya Nair', username: 'officer2', password: 'officer123', role: 'officer', unit: 'Bravo', email: 'pnair@combatprep.mil', joined: '2024-03-01', status: 'active' },
    { id: 4, name: 'Pvt. Rohan Das', username: 'soldier1', password: 'soldier123', role: 'soldier', unit: 'Alpha', email: 'rdas@combatprep.mil', joined: '2024-03-10', status: 'active' },
    { id: 5, name: 'Pvt. Vikram Singh', username: 'soldier2', password: 'soldier123', role: 'soldier', unit: 'Alpha', email: 'vsingh@combatprep.mil', joined: '2024-03-12', status: 'active' },
    { id: 6, name: 'Cpl. Sneha Rao', username: 'soldier3', password: 'soldier123', role: 'soldier', unit: 'Bravo', email: 'srao@combatprep.mil', joined: '2024-04-01', status: 'active' },
    { id: 7, name: 'Sgt. Ankit Joshi', username: 'soldier4', password: 'soldier123', role: 'soldier', unit: 'Bravo', email: 'ajoshi@combatprep.mil', joined: '2024-04-15', status: 'inactive' },
  ],

  assessments: [
    { id: 1, soldierId: 4, officerId: 2, date: '2025-03-01', physicalScore: 85, skillScore: 78, trainingStatus: 'completed', remarks: 'Good stamina. Skill needs improvement.', readinessLevel: 'combat-ready' },
    { id: 2, soldierId: 5, officerId: 2, date: '2025-03-05', physicalScore: 62, skillScore: 70, trainingStatus: 'completed', remarks: 'Moderate performance. Recommend additional drills.', readinessLevel: 'partially-ready' },
    { id: 3, soldierId: 6, officerId: 3, date: '2025-03-10', physicalScore: 91, skillScore: 88, trainingStatus: 'completed', remarks: 'Excellent performance across all categories.', readinessLevel: 'combat-ready' },
    { id: 4, soldierId: 7, officerId: 3, date: '2025-02-20', physicalScore: 44, skillScore: 38, trainingStatus: 'incomplete', remarks: 'Below threshold. Needs immediate attention.', readinessLevel: 'not-ready' },
    { id: 5, soldierId: 4, officerId: 2, date: '2025-04-01', physicalScore: 90, skillScore: 83, trainingStatus: 'completed', remarks: 'Significant improvement noted.', readinessLevel: 'combat-ready' },
  ],

  trainings: [
    { id: 1, name: 'Basic Combat Training', unit: 'All', startDate: '2025-02-01', endDate: '2025-02-28', status: 'completed', participants: 45 },
    { id: 2, name: 'Advanced Weapons Handling', unit: 'Alpha', startDate: '2025-03-01', endDate: '2025-03-20', status: 'completed', participants: 18 },
    { id: 3, name: 'Field Survival Skills', unit: 'Bravo', startDate: '2025-03-15', endDate: '2025-04-05', status: 'completed', participants: 22 },
    { id: 4, name: 'Urban Combat Tactics', unit: 'All', startDate: '2025-04-10', endDate: '2025-05-10', status: 'ongoing', participants: 60 },
    { id: 5, name: 'Night Vision Operations', unit: 'Alpha', startDate: '2025-05-15', endDate: '2025-06-15', status: 'scheduled', participants: 0 },
  ]
};

let currentUser = null;

// ---- UTILITY ----
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function showAlert(containerId, msg, type = 'success') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  setTimeout(() => el.innerHTML = '', 4000);
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calcOverall(phys, skill) {
  return Math.round((phys * 0.5) + (skill * 0.5));
}

function readinessClass(level) {
  if (level === 'combat-ready') return 'badge-green';
  if (level === 'partially-ready') return 'badge-amber';
  return 'badge-red';
}

function readinessLabel(level) {
  if (level === 'combat-ready') return 'Combat Ready';
  if (level === 'partially-ready') return 'Partial Ready';
  return 'Not Ready';
}

function getReadinessFromScore(score) {
  if (score >= 75) return 'combat-ready';
  if (score >= 50) return 'partially-ready';
  return 'not-ready';
}

function getUserById(id) { return DB.users.find(u => u.id === id); }
function getSoldiers() { return DB.users.filter(u => u.role === 'soldier'); }

function getLatestAssessment(soldierId) {
  const arr = DB.assessments.filter(a => a.soldierId === soldierId).sort((a, b) => new Date(b.date) - new Date(a.date));
  return arr[0] || null;
}

function roleTag(role) {
  const labels = { admin: 'Admin', officer: 'Officer', soldier: 'Soldier' };
  return `<span class="role-tag role-${role}">${labels[role] || role}</span>`;
}

// ---- AUTH ----
function doLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('login-alert');

  const user = DB.users.find(u => u.username === username && u.password === password);
  if (!user) {
    alertEl.innerHTML = `<div class="alert alert-error">⚠ Invalid credentials. Check username/password.</div>`;
    return;
  }
  if (user.status === 'inactive') {
    alertEl.innerHTML = `<div class="alert alert-error">⚠ Account is inactive. Contact admin.</div>`;
    return;
  }

  currentUser = user;
  alertEl.innerHTML = '';
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('app-page').classList.add('active');
  initApp();
}

function doLogout() {
  if (!confirm('Confirm logout?')) return;
  currentUser = null;
  document.getElementById('app-page').classList.remove('active');
  document.getElementById('login-page').classList.add('active');
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('login-alert').innerHTML = '';
}

// ---- APP INIT ----
function initApp() {
  document.getElementById('sb-user-name').textContent = currentUser.name;
  document.getElementById('sb-user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
  document.getElementById('sb-user-avatar').textContent = currentUser.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  document.querySelectorAll('[data-role]').forEach(el => {
    const roles = el.dataset.role.split(',');
    el.style.display = roles.includes(currentUser.role) ? '' : 'none';
  });

  navigateTo('dashboard');
  renderDashboard();
}

function navigateTo(section) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));

  const navEl = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (navEl) navEl.classList.add('active');

  const sectionEl = document.getElementById(`section-${section}`);
  if (sectionEl) sectionEl.classList.add('active');

  const titles = { dashboard: 'Dashboard', soldiers: 'Soldier Profiles', assessments: 'Assessments', trainings: 'Training Programs', reports: 'Readiness Reports', users: 'User Management' };
  document.getElementById('topbar-title').textContent = titles[section] || section;

  const renderers = { dashboard: renderDashboard, soldiers: renderSoldiers, assessments: renderAssessments, trainings: renderTrainings, reports: renderReports, users: renderUsers };
  if (renderers[section]) renderers[section]();
}

// ---- DASHBOARD ----
function renderDashboard() {
  const soldiers = getSoldiers();
  const total = soldiers.length;

  let ready = 0, partial = 0, notReady = 0;
  soldiers.forEach(s => {
    const la = getLatestAssessment(s.id);
    if (!la) { notReady++; return; }
    if (la.readinessLevel === 'combat-ready') ready++;
    else if (la.readinessLevel === 'partially-ready') partial++;
    else notReady++;
  });

  document.getElementById('dash-total').textContent = total;
  document.getElementById('dash-ready').textContent = ready;
  document.getElementById('dash-partial').textContent = partial;
  document.getElementById('dash-notready').textContent = notReady;
  document.getElementById('dash-assessments').textContent = DB.assessments.length;

  const recent = [...DB.assessments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const tbody = document.getElementById('dash-recent-tbody');
  tbody.innerHTML = recent.map(a => {
    const soldier = getUserById(a.soldierId);
    const officer = getUserById(a.officerId);
    const overall = calcOverall(a.physicalScore, a.skillScore);
    return `
      <tr>
        <td>${formatDate(a.date)}</td>
        <td><strong>${soldier?.name || '-'}</strong><br><small style="color:var(--steel)">${soldier?.unit || ''} Unit</small></td>
        <td>${officer?.name || '-'}</td>
        <td><span class="mono">${a.physicalScore}/100</span></td>
        <td><span class="mono">${a.skillScore}/100</span></td>
        <td><strong class="mono">${overall}</strong></td>
        <td><span class="badge ${readinessClass(a.readinessLevel)}">${readinessLabel(a.readinessLevel)}</span></td>
      </tr>`;
  }).join('');

  const rList = document.getElementById('dash-readiness-list');
  rList.innerHTML = soldiers.map(s => {
    const la = getLatestAssessment(s.id);
    const score = la ? calcOverall(la.physicalScore, la.skillScore) : 0;
    const fillClass = score >= 75 ? 'fill-high' : score >= 50 ? 'fill-mid' : 'fill-low';
    return `
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:14px;font-weight:600">${s.name}</span>
          <span class="mono" style="font-size:13px;color:var(--khaki)">${score}%</span>
        </div>
        <div class="readiness-bar"><div class="readiness-fill ${fillClass}" style="width:${score}%"></div></div>
        <span style="font-size:11px;color:var(--steel)">${s.unit} Unit · ${la ? formatDate(la.date) : 'No assessment'}</span>
      </div>`;
  }).join('');

  const scores = [...DB.assessments].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-8).map(a => calcOverall(a.physicalScore, a.skillScore));
  document.getElementById('mini-chart').innerHTML = scores.map(s => {
    const h = Math.round((s / 100) * 56);
    const extra = s >= 75 ? '' : s >= 50 ? 'style="background:var(--amber)"' : 'style="background:var(--rust-light)"';
    return `<div class="mini-bar" ${extra} style="height:${h}px" title="Score: ${s}"></div>`;
  }).join('');
}

// ---- SOLDIERS ----
function renderSoldiers(filter = '') {
  let soldiers = getSoldiers();
  if (filter) soldiers = soldiers.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.unit.toLowerCase().includes(filter.toLowerCase()));

  const tbody = document.getElementById('soldiers-tbody');
  if (!soldiers.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="icon">🪖</div><p>No soldiers found.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = soldiers.map(s => {
    const la = getLatestAssessment(s.id);
    const score = la ? calcOverall(la.physicalScore, la.skillScore) : null;
    const level = la ? la.readinessLevel : 'not-ready';
    const totalAssessments = DB.assessments.filter(a => a.soldierId === s.id).length;
    const canEdit = currentUser.role === 'admin' || currentUser.role === 'officer';
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="user-avatar" style="width:32px;height:32px;font-size:12px">${s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
            <div>
              <div style="font-weight:700">${s.name}</div>
              <div style="font-size:11px;color:var(--steel)">${s.email}</div>
            </div>
          </div>
        </td>
        <td>${s.unit} Unit</td>
        <td>${totalAssessments}</td>
        <td>${score !== null ? `<span class="mono">${score}/100</span>` : '<span style="color:var(--steel)">—</span>'}</td>
        <td><span class="badge ${readinessClass(level)}">${readinessLabel(level)}</span></td>
        <td><span class="badge ${s.status === 'active' ? 'badge-green' : 'badge-steel'}">${s.status}</span></td>
        <td>
          ${canEdit ? `<button class="btn-secondary" onclick="viewSoldierProfile(${s.id})" style="padding:6px 12px;font-size:12px">View</button>` : ''}
        </td>
      </tr>`;
  }).join('');
}

function viewSoldierProfile(soldierId) {
  const s = getUserById(soldierId);
  if (!s) return;
  const assessments = DB.assessments.filter(a => a.soldierId === soldierId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const avgPhys = assessments.length ? Math.round(assessments.reduce((sum, a) => sum + a.physicalScore, 0) / assessments.length) : 0;
  const avgSkill = assessments.length ? Math.round(assessments.reduce((sum, a) => sum + a.skillScore, 0) / assessments.length) : 0;

  document.getElementById('profile-modal-body').innerHTML = `
    <div style="display:flex;gap:20px;align-items:center;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--border)">
      <div class="user-avatar" style="width:64px;height:64px;font-size:24px">${s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div>
        <h3 style="font-size:22px;margin-bottom:4px">${s.name}</h3>
        <p style="color:var(--steel);font-size:13px">${s.unit} Unit · ${s.email}</p>
        <div style="margin-top:8px">${roleTag(s.role)} <span class="badge ${s.status==='active'?'badge-green':'badge-steel'}" style="margin-left:6px">${s.status}</span></div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">
      <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border:1px solid var(--border)">
        <div style="font-size:32px;font-family:'Bebas Neue',cursive;color:var(--khaki)">${assessments.length}</div>
        <div style="font-size:11px;color:var(--steel);letter-spacing:1px">ASSESSMENTS</div>
      </div>
      <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border:1px solid var(--border)">
        <div style="font-size:32px;font-family:'Bebas Neue',cursive;color:var(--green-neon)">${avgPhys}</div>
        <div style="font-size:11px;color:var(--steel);letter-spacing:1px">AVG PHYSICAL</div>
      </div>
      <div style="text-align:center;padding:16px;background:rgba(255,255,255,0.03);border:1px solid var(--border)">
        <div style="font-size:32px;font-family:'Bebas Neue',cursive;color:var(--amber)">${avgSkill}</div>
        <div style="font-size:11px;color:var(--steel);letter-spacing:1px">AVG SKILL</div>
      </div>
    </div>
    <h4 style="color:var(--khaki);margin-bottom:12px;font-size:16px;letter-spacing:1px">ASSESSMENT HISTORY</h4>
    ${assessments.length === 0 ? '<p style="color:var(--steel);text-align:center;padding:20px">No assessments recorded.</p>' : `
    <table class="data-table">
      <thead><tr><th>Date</th><th>Physical</th><th>Skill</th><th>Overall</th><th>Status</th></tr></thead>
      <tbody>
        ${assessments.map(a => `
          <tr>
            <td>${formatDate(a.date)}</td>
            <td><span class="mono">${a.physicalScore}</span></td>
            <td><span class="mono">${a.skillScore}</span></td>
            <td><strong class="mono">${calcOverall(a.physicalScore, a.skillScore)}</strong></td>
            <td><span class="badge ${readinessClass(a.readinessLevel)}">${readinessLabel(a.readinessLevel)}</span></td>
          </tr>`).join('')}
      </tbody>
    </table>`}
  `;
  openModal('profile-modal');
}

// ---- ASSESSMENTS ----
function renderAssessments(filter = '') {
  let data = [...DB.assessments].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (currentUser.role === 'soldier') data = data.filter(a => a.soldierId === currentUser.id);
  if (filter) data = data.filter(a => { const s = getUserById(a.soldierId); return s?.name.toLowerCase().includes(filter.toLowerCase()); });

  const canAdd = currentUser.role === 'officer' || currentUser.role === 'admin';
  document.getElementById('btn-add-assessment').style.display = canAdd ? '' : 'none';

  const tbody = document.getElementById('assessments-tbody');
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="icon">📋</div><p>No assessments found.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(a => {
    const soldier = getUserById(a.soldierId);
    const officer = getUserById(a.officerId);
    const overall = calcOverall(a.physicalScore, a.skillScore);
    const fillClass = overall >= 75 ? 'fill-high' : overall >= 50 ? 'fill-mid' : 'fill-low';
    return `
      <tr>
        <td><span class="mono" style="font-size:12px">#${String(a.id).padStart(4,'0')}</span></td>
        <td>${formatDate(a.date)}</td>
        <td><strong>${soldier?.name || '-'}</strong></td>
        <td style="color:var(--steel)">${officer?.name || '-'}</td>
        <td><span class="mono">${a.physicalScore}</span></td>
        <td><span class="mono">${a.skillScore}</span></td>
        <td>
          <strong class="mono">${overall}</strong>
          <div class="readiness-bar" style="margin-top:4px;width:80px"><div class="readiness-fill ${fillClass}" style="width:${overall}%"></div></div>
        </td>
        <td><span class="badge ${readinessClass(a.readinessLevel)}">${readinessLabel(a.readinessLevel)}</span></td>
      </tr>`;
  }).join('');
}

function openAddAssessment() {
  const soldiers = getSoldiers();
  document.getElementById('assess-soldier').innerHTML = soldiers.map(s => `<option value="${s.id}">${s.name} (${s.unit} Unit)</option>`).join('');
  document.getElementById('assess-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('assess-alert').innerHTML = '';
  openModal('assessment-modal');
}

function submitAssessment() {
  const soldierId = parseInt(document.getElementById('assess-soldier').value);
  const date = document.getElementById('assess-date').value;
  const phys = parseInt(document.getElementById('assess-physical').value);
  const skill = parseInt(document.getElementById('assess-skill').value);
  const training = document.getElementById('assess-training').value;
  const remarks = document.getElementById('assess-remarks').value;

  if (!date || isNaN(phys) || isNaN(skill)) { showAlert('assess-alert', 'Please fill all required fields.', 'error'); return; }
  if (phys < 0 || phys > 100 || skill < 0 || skill > 100) { showAlert('assess-alert', 'Scores must be between 0-100.', 'error'); return; }

  const overall = calcOverall(phys, skill);
  const level = getReadinessFromScore(overall);
  const newId = Math.max(...DB.assessments.map(a => a.id)) + 1;

  DB.assessments.push({ id: newId, soldierId, officerId: currentUser.id, date, physicalScore: phys, skillScore: skill, trainingStatus: training, remarks, readinessLevel: level });

  closeModal('assessment-modal');
  showToast(`✅ Assessment recorded. Readiness: ${readinessLabel(level)}`);
  renderAssessments();
  renderDashboard();
}

// ---- TRAININGS ----
function renderTrainings() {
  const tbody = document.getElementById('trainings-tbody');
  tbody.innerHTML = DB.trainings.map(t => {
    const statusClass = t.status === 'completed' ? 'badge-green' : t.status === 'ongoing' ? 'badge-amber' : 'badge-steel';
    return `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.unit === 'All' ? '<span class="badge badge-steel">All Units</span>' : `${t.unit} Unit`}</td>
        <td>${formatDate(t.startDate)}</td>
        <td>${formatDate(t.endDate)}</td>
        <td>${t.participants > 0 ? t.participants : '—'}</td>
        <td><span class="badge ${statusClass}">${t.status.charAt(0).toUpperCase()+t.status.slice(1)}</span></td>
      </tr>`;
  }).join('');
}

// ---- REPORTS ----
function renderReports() {
  const soldiers = getSoldiers();
  let reportData = soldiers;
  if (currentUser.role === 'soldier') reportData = soldiers.filter(s => s.id === currentUser.id);

  const tbody = document.getElementById('reports-tbody');
  tbody.innerHTML = reportData.map(s => {
    const assessments = DB.assessments.filter(a => a.soldierId === s.id).sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = assessments[0];
    const score = latest ? calcOverall(latest.physicalScore, latest.skillScore) : 0;
    const avgScore = assessments.length ? Math.round(assessments.reduce((sum, a) => sum + calcOverall(a.physicalScore, a.skillScore), 0) / assessments.length) : 0;
    const trend = assessments.length > 1 ? (calcOverall(assessments[0].physicalScore, assessments[0].skillScore) - calcOverall(assessments[1].physicalScore, assessments[1].skillScore)) : null;
    const level = latest ? latest.readinessLevel : 'not-ready';
    const scoreClass = score >= 75 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low';
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="user-avatar" style="width:32px;height:32px;font-size:12px">${s.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
            <div><div style="font-weight:700">${s.name}</div><div style="font-size:11px;color:var(--steel)">${s.unit} Unit</div></div>
          </div>
        </td>
        <td>${assessments.length}</td>
        <td><div class="score-circle ${scoreClass}" style="width:52px;height:52px;font-size:18px">${score}</div></td>
        <td><span class="mono" style="color:var(--steel)">${avgScore}</span></td>
        <td>${trend !== null ? `<span style="color:${trend >= 0 ? 'var(--green-neon)' : 'var(--rust-light)'}">${trend >= 0 ? '▲' : '▼'} ${Math.abs(trend)} pts</span>` : '<span style="color:var(--steel)">—</span>'}</td>
        <td>${latest ? formatDate(latest.date) : '<span style="color:var(--steel)">Never</span>'}</td>
        <td><span class="badge ${readinessClass(level)}">${readinessLabel(level)}</span></td>
      </tr>`;
  }).join('');

  const readyCount = reportData.filter(s => { const la = getLatestAssessment(s.id); return la?.readinessLevel === 'combat-ready'; }).length;
  document.getElementById('report-summary').innerHTML = `<span style="color:var(--steel);font-size:13px"><strong style="color:var(--green-neon)">${readyCount}</strong> of <strong style="color:var(--khaki)">${reportData.length}</strong> soldiers are Combat Ready (${reportData.length ? Math.round((readyCount/reportData.length)*100) : 0}%)</span>`;
}

// ---- USERS ----
function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = DB.users.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div class="user-avatar" style="width:32px;height:32px;font-size:12px">${u.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div><div style="font-weight:700">${u.name}</div><div style="font-size:11px;color:var(--steel)">${u.email}</div></div>
        </div>
      </td>
      <td><span class="mono" style="font-size:12px">${u.username}</span></td>
      <td>${roleTag(u.role)}</td>
      <td>${u.unit}</td>
      <td>${formatDate(u.joined)}</td>
      <td><span class="badge ${u.status==='active'?'badge-green':'badge-steel'}">${u.status}</span></td>
      <td>${u.id !== currentUser.id ? `<button class="btn-secondary" style="padding:5px 10px;font-size:12px" onclick="toggleUserStatus(${u.id})">${u.status==='active'?'Deactivate':'Activate'}</button>` : '<span style="color:var(--steel);font-size:12px">You</span>'}</td>
    </tr>`).join('');
}

function openAddUser() {
  document.getElementById('add-user-form').reset();
  document.getElementById('add-user-alert').innerHTML = '';
  openModal('add-user-modal');
}

function submitAddUser() {
  const name = document.getElementById('new-name').value.trim();
  const username = document.getElementById('new-username').value.trim();
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-role').value;
  const unit = document.getElementById('new-unit').value.trim();
  const email = document.getElementById('new-email').value.trim();

  if (!name || !username || !password || !unit || !email) { showAlert('add-user-alert', 'All fields are required.', 'error'); return; }
  if (DB.users.find(u => u.username === username)) { showAlert('add-user-alert', 'Username already exists.', 'error'); return; }

  const newId = Math.max(...DB.users.map(u => u.id)) + 1;
  DB.users.push({ id: newId, name, username, password, role, unit, email, joined: new Date().toISOString().split('T')[0], status: 'active' });

  closeModal('add-user-modal');
  showToast(`✅ User ${name} added successfully.`);
  renderUsers();
}

function toggleUserStatus(userId) {
  const user = DB.users.find(u => u.id === userId);
  if (!user) return;
  user.status = user.status === 'active' ? 'inactive' : 'active';
  showToast(`User ${user.name} ${user.status === 'active' ? 'activated' : 'deactivated'}.`);
  renderUsers();
}

// ---- MODAL ----
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ---- DEMO LOGIN SHORTCUTS ----
function demoLogin(type) {
  const creds = { admin: ['admin', 'admin123'], officer: ['officer1', 'officer123'], soldier: ['soldier1', 'soldier123'] };
  document.getElementById('username').value = creds[type][0];
  document.getElementById('password').value = creds[type][1];
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-page').classList.add('active');
  document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});
