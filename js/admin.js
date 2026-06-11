/* ============================================================
   Brave Motors — admin backend logic
   ============================================================ */
(function () {
  let data = BMStore.load();

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let toastTimer;
  function toast(msg, isErr) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('err', !!isErr);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
  }

  function persist() {
    BMStore.save(data);
  }

  /* ============ PIN lock ============ */
  let pinBuffer = '';
  const pinLen = () => Math.max(4, Math.min(8, (data.settings.pin || '0000').length));

  function renderDots() {
    const n = pinLen();
    $('#pin-dots').innerHTML = Array.from({ length: n }, (_, i) =>
      '<span class="' + (i < pinBuffer.length ? 'filled' : '') + '"></span>'
    ).join('');
  }

  function tryPin() {
    if (pinBuffer === String(data.settings.pin)) {
      BMStore.session.login();
      unlock();
    } else {
      $('#lock-err').textContent = 'Incorrect PIN — please try again.';
      const card = $('#lock-card');
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      pinBuffer = '';
      renderDots();
    }
  }

  $('#pin-pad').addEventListener('click', (e) => {
    const k = e.target.dataset && e.target.dataset.k;
    if (!k) return;
    $('#lock-err').textContent = '';
    if (k === 'clear') pinBuffer = '';
    else if (k === 'back') pinBuffer = pinBuffer.slice(0, -1);
    else if (pinBuffer.length < pinLen()) pinBuffer += k;
    renderDots();
    if (pinBuffer.length === pinLen()) setTimeout(tryPin, 120);
  });

  document.addEventListener('keydown', (e) => {
    if (BMStore.session.isAuthed()) return;
    if (/^[0-9]$/.test(e.key) && pinBuffer.length < pinLen()) { pinBuffer += e.key; renderDots(); if (pinBuffer.length === pinLen()) setTimeout(tryPin, 120); }
    if (e.key === 'Backspace') { pinBuffer = pinBuffer.slice(0, -1); renderDots(); }
  });

  function unlock() {
    $('#lock-screen').style.display = 'none';
    $('#app').classList.add('authed');
    renderAll();
  }

  $('#logout-btn').addEventListener('click', () => {
    BMStore.session.logout();
    location.reload();
  });

  /* ============ Navigation ============ */
  function go(panel) {
    document.querySelectorAll('.snav[data-panel]').forEach(b => b.classList.toggle('active', b.dataset.panel === panel));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + panel));
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll('.snav[data-panel]').forEach(b => {
    b.addEventListener('click', () => go(b.dataset.panel));
  });

  function closeModal(id) { document.getElementById(id).classList.remove('open'); }
  document.querySelectorAll('.modal-wrap').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
  });

  /* ============ Image helper ============ */
  function readImage(file, cb, maxWidth) {
    if (!file || !file.type.startsWith('image/')) { toast('Please choose an image file.', true); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = maxWidth || 1280;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        cb(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ============ Dashboard ============ */
  function fmtWhen(iso) {
    try {
      return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return iso; }
  }

  function renderDashboard() {
    const msgs = BMStore.messages();
    const unread = msgs.filter(m => !m.read).length;
    const stats = [
      { v: data.vehicles.length, l: 'Vehicles listed' },
      { v: data.vehicles.filter(v => v.status === 'Available').length, l: 'Available now' },
      { v: data.posts.length, l: 'Blog posts' },
      { v: BMStore.views(), l: 'Site visits (this device)' }
    ];
    $('#dash-stats').innerHTML = stats.map(s =>
      '<div class="stat-card"><div class="v">' + s.v + '</div><div class="l">' + s.l + '</div></div>'
    ).join('');

    const badge = $('#msg-badge');
    badge.style.display = unread ? 'inline-block' : 'none';
    badge.textContent = unread;

    $('#dash-messages').innerHTML = msgs.length
      ? msgs.slice(0, 3).map(m =>
          '<div class="list-row"><div class="grow">' +
          '<div class="title">' + esc(m.name) + (m.read ? '' : '<span class="tag red">NEW</span>') + '</div>' +
          '<div class="meta">' + esc(m.email) + ' · ' + fmtWhen(m.at) + '</div></div>' +
          '<button class="btn btn-ghost btn-sm" onclick="AdminUI.go(\'messages\')">VIEW</button></div>'
        ).join('')
      : '<div class="empty">No messages yet. Enquiries from the contact form will appear here.</div>';
  }

  /* ============ Hero slider ============ */
  const HERO_MAX_WIDTH = 1672;
  let replacingSlideId = null;

  function renderHeroSlides() {
    const slides = data.heroSlides || [];
    $('#hero-list').innerHTML = slides.length
      ? slides.map((s, i) =>
          '<div class="list-row">' +
          '<img class="thumb" style="width:150px;height:84px;" src="' + s.image + '" alt="" />' +
          '<div class="grow"><div class="title">Slide ' + (i + 1) + (i === 0 ? '<span class="tag gold">SHOWS FIRST</span>' : '') + '</div>' +
          '<div class="meta">Recommended size: 1672 × 941 px</div></div>' +
          '<div class="actions">' +
          (i > 0 ? '<button class="btn btn-ghost btn-sm" onclick="AdminUI.moveHeroSlide(\'' + s.id + '\',-1)" title="Move earlier">↑</button>' : '') +
          (i < slides.length - 1 ? '<button class="btn btn-ghost btn-sm" onclick="AdminUI.moveHeroSlide(\'' + s.id + '\',1)" title="Move later">↓</button>' : '') +
          '<button class="btn btn-ghost btn-sm" onclick="AdminUI.replaceHeroSlide(\'' + s.id + '\')">REPLACE IMAGE</button>' +
          '<button class="btn btn-danger btn-sm" onclick="AdminUI.deleteHeroSlide(\'' + s.id + '\')">DELETE</button>' +
          '</div></div>'
        ).join('')
      : '<div class="empty">No hero images. Click “+ ADD HERO IMAGE” to upload your first slide (1672 × 941 px recommended).</div>';
  }

  $('#hs-add-file').addEventListener('change', function () {
    readImage(this.files[0], (dataUrl) => {
      data.heroSlides = data.heroSlides || [];
      data.heroSlides.push({ id: BMStore.uid('h'), image: dataUrl, alt: 'Brave Motors vehicle' });
      persist();
      renderHeroSlides();
      toast('✓ Hero image added — it is now in the homepage rotation.');
    }, HERO_MAX_WIDTH);
    this.value = '';
  });

  $('#hs-replace-file').addEventListener('change', function () {
    const slide = (data.heroSlides || []).find(s => s.id === replacingSlideId);
    if (!slide) { this.value = ''; return; }
    readImage(this.files[0], (dataUrl) => {
      slide.image = dataUrl;
      persist();
      renderHeroSlides();
      toast('✓ Hero image replaced.');
    }, HERO_MAX_WIDTH);
    this.value = '';
  });

  function replaceHeroSlide(id) {
    replacingSlideId = id;
    document.getElementById('hs-replace-file').click();
  }

  function moveHeroSlide(id, dir) {
    const slides = data.heroSlides || [];
    const i = slides.findIndex(s => s.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= slides.length) return;
    [slides[i], slides[j]] = [slides[j], slides[i]];
    persist();
    renderHeroSlides();
  }

  function deleteHeroSlide(id) {
    const slides = data.heroSlides || [];
    const i = slides.findIndex(s => s.id === id);
    if (i < 0) return;
    if (!confirm('Remove slide ' + (i + 1) + ' from the homepage hero rotation?')) return;
    slides.splice(i, 1);
    persist();
    renderHeroSlides();
    toast('Hero image removed.');
  }

  /* ============ Vehicles ============ */
  let editingVehicle = null;
  let vehicleImage = '';

  function renderVehicles() {
    $('#vehicle-list').innerHTML = data.vehicles.length
      ? data.vehicles.map(v => {
          const statusTag = v.status === 'Available' ? 'green' : (v.status === 'Sold' ? 'red' : 'blue');
          return '<div class="list-row">' +
            '<img class="thumb" src="' + BMStore.vehicleImage(v) + '" alt="" />' +
            '<div class="grow"><div class="title">' + esc(v.name) +
            (v.featured ? '<span class="tag gold">FEATURED</span>' : '') +
            '<span class="tag ' + statusTag + '">' + esc(v.status) + '</span></div>' +
            '<div class="meta">' + esc(v.category) + (v.year ? ' · ' + esc(v.year) : '') + ' · ' + esc(v.price || 'POA') + '</div></div>' +
            '<div class="actions">' +
            '<button class="btn btn-ghost btn-sm" onclick="AdminUI.openVehicleForm(\'' + v.id + '\')">EDIT</button>' +
            '<button class="btn btn-danger btn-sm" onclick="AdminUI.deleteVehicle(\'' + v.id + '\')">DELETE</button>' +
            '</div></div>';
        }).join('')
      : '<div class="empty">No vehicles listed. Click “+ ADD VEHICLE” to create your first listing.</div>';
  }

  function openVehicleForm(id) {
    editingVehicle = id ? data.vehicles.find(v => v.id === id) : null;
    vehicleImage = editingVehicle ? (editingVehicle.image || '') : '';
    $('#vf-title').textContent = editingVehicle ? 'Edit Vehicle' : 'Add Vehicle';
    $('#vf-name').value = editingVehicle ? editingVehicle.name : '';
    $('#vf-category').value = editingVehicle ? editingVehicle.category : 'Heavy-Duty 4WD';
    $('#vf-year').value = editingVehicle ? (editingVehicle.year || '') : '';
    $('#vf-price').value = editingVehicle ? (editingVehicle.price || 'POA') : 'POA';
    $('#vf-status').value = editingVehicle ? (editingVehicle.status || 'Available') : 'Available';
    $('#vf-specs').value = editingVehicle ? (editingVehicle.specs || []).join(', ') : '';
    $('#vf-desc').value = editingVehicle ? (editingVehicle.desc || '') : '';
    $('#vf-featured').checked = editingVehicle ? !!editingVehicle.featured : false;
    updateVehiclePreview();
    document.getElementById('vehicle-modal').classList.add('open');
  }

  function updateVehiclePreview() {
    const ghost = editingVehicle || { name: $('#vf-name').value || 'New Vehicle', accent: '#E5A33B', art: '4WD' };
    $('#vf-preview').src = vehicleImage || BMStore.vehicleArt(ghost);
  }

  $('#vf-image-file').addEventListener('change', function () {
    readImage(this.files[0], (dataUrl) => {
      vehicleImage = dataUrl;
      updateVehiclePreview();
      toast('Photo attached — remember to save.');
    });
    this.value = '';
  });

  function clearVehicleImage() {
    vehicleImage = '';
    updateVehiclePreview();
    toast('Photo removed — the branded placeholder will be used.');
  }

  function saveVehicle() {
    const name = $('#vf-name').value.trim();
    if (!name) { toast('Please enter a vehicle name.', true); return; }
    const payload = {
      name,
      category: $('#vf-category').value,
      year: $('#vf-year').value.trim(),
      price: $('#vf-price').value.trim() || 'POA',
      status: $('#vf-status').value,
      specs: $('#vf-specs').value.split(',').map(s => s.trim()).filter(Boolean),
      desc: $('#vf-desc').value.trim(),
      featured: $('#vf-featured').checked,
      image: vehicleImage
    };
    if (editingVehicle) {
      Object.assign(editingVehicle, payload);
    } else {
      data.vehicles.push(Object.assign({
        id: BMStore.uid('v'),
        accent: '#E5A33B',
        art: payload.category === 'Sedan' ? 'SEDAN' : (payload.category === 'Ute' || payload.category === 'Truck' ? 'UTE' : '4WD')
      }, payload));
    }
    persist();
    closeModal('vehicle-modal');
    renderVehicles();
    renderDashboard();
    toast('✓ Vehicle saved — it is now live on the website.');
  }

  function deleteVehicle(id) {
    const v = data.vehicles.find(x => x.id === id);
    if (!v) return;
    if (!confirm('Delete "' + v.name + '" from the website? This cannot be undone.')) return;
    data.vehicles = data.vehicles.filter(x => x.id !== id);
    persist();
    renderVehicles();
    renderDashboard();
    toast('Vehicle deleted.');
  }

  /* ============ Blog ============ */
  let editingPost = null;
  let postImage = '';

  function renderPosts() {
    const sorted = [...data.posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    $('#post-list').innerHTML = sorted.length
      ? sorted.map(p =>
          '<div class="list-row">' +
          (p.image ? '<img class="thumb" src="' + p.image + '" alt="" />' : '<div class="thumb" style="display:grid;place-items:center;color:var(--muted);font-size:11px;">No image</div>') +
          '<div class="grow"><div class="title">' + esc(p.title) + '</div>' +
          '<div class="meta">' + esc(p.date || '') + ' · ' + esc(p.author || '') + '</div></div>' +
          '<div class="actions">' +
          '<button class="btn btn-ghost btn-sm" onclick="AdminUI.openPostForm(\'' + p.id + '\')">EDIT</button>' +
          '<button class="btn btn-danger btn-sm" onclick="AdminUI.deletePost(\'' + p.id + '\')">DELETE</button>' +
          '</div></div>'
        ).join('')
      : '<div class="empty">No posts yet. Click “+ NEW POST” to publish your first article.</div>';
  }

  function openPostForm(id) {
    editingPost = id ? data.posts.find(p => p.id === id) : null;
    postImage = editingPost ? (editingPost.image || '') : '';
    $('#pf-title').textContent = editingPost ? 'Edit Blog Post' : 'New Blog Post';
    $('#pf-name').value = editingPost ? editingPost.title : '';
    $('#pf-author').value = editingPost ? (editingPost.author || '') : 'Brave Motors Team';
    $('#pf-date').value = editingPost ? (editingPost.date || '') : new Date().toISOString().slice(0, 10);
    $('#pf-excerpt').value = editingPost ? (editingPost.excerpt || '') : '';
    $('#pf-body').value = editingPost ? (editingPost.body || '') : '';
    updatePostPreview();
    document.getElementById('post-modal').classList.add('open');
  }

  function updatePostPreview() {
    $('#pf-preview').style.display = postImage ? 'block' : 'none';
    if (postImage) $('#pf-preview').src = postImage;
  }

  $('#pf-image-file').addEventListener('change', function () {
    readImage(this.files[0], (dataUrl) => {
      postImage = dataUrl;
      updatePostPreview();
      toast('Cover image attached — remember to publish.');
    });
    this.value = '';
  });

  function clearPostImage() {
    postImage = '';
    updatePostPreview();
    toast('Cover image removed.');
  }

  function savePost() {
    const title = $('#pf-name').value.trim();
    if (!title) { toast('Please enter a post title.', true); return; }
    const payload = {
      title,
      author: $('#pf-author').value.trim() || 'Brave Motors Team',
      date: $('#pf-date').value || new Date().toISOString().slice(0, 10),
      excerpt: $('#pf-excerpt').value.trim(),
      body: $('#pf-body').value.trim(),
      image: postImage
    };
    if (editingPost) {
      Object.assign(editingPost, payload);
    } else {
      data.posts.unshift(Object.assign({ id: BMStore.uid('p') }, payload));
    }
    persist();
    closeModal('post-modal');
    renderPosts();
    renderDashboard();
    toast('✓ Post published — it is now live on the blog.');
  }

  function deletePost(id) {
    const p = data.posts.find(x => x.id === id);
    if (!p) return;
    if (!confirm('Delete the post "' + p.title + '"?')) return;
    data.posts = data.posts.filter(x => x.id !== id);
    persist();
    renderPosts();
    renderDashboard();
    toast('Post deleted.');
  }

  /* ============ Content ============ */
  function renderContentForms() {
    const c = data.content, s = data.settings;
    $('#c-heroKicker').value = c.heroKicker;
    $('#c-heroTitle').value = c.heroTitle;
    $('#c-heroSub').value = c.heroSub;
    $('#c-stats').innerHTML = (c.stats || []).map((st, i) =>
      '<div class="frow" style="margin-bottom:4px;">' +
      '<div class="field"><label>Stat ' + (i + 1) + ' — value</label><input class="stat-v" data-i="' + i + '" value="' + esc(st.value) + '" /></div>' +
      '<div class="field"><label>Stat ' + (i + 1) + ' — label</label><input class="stat-l" data-i="' + i + '" value="' + esc(st.label) + '" /></div>' +
      '</div>'
    ).join('');

    $('#c-aboutTitle').value = c.aboutTitle;
    $('#c-aboutBody').value = c.aboutBody;
    $('#c-aboutPoints').value = (c.aboutPoints || []).join('\n');

    $('#c-visionTitle').value = c.visionTitle;
    $('#c-visionStatement').value = c.visionStatement;
    $('#c-visionBody').value = c.visionBody;
    $('#c-pillars').innerHTML = (c.visionPillars || []).map((p, i) =>
      '<div class="frow" style="margin-bottom:4px;">' +
      '<div class="field"><label>Pillar ' + (i + 1) + ' — title</label><input class="pillar-t" data-i="' + i + '" value="' + esc(p.title) + '" /></div>' +
      '<div class="field"><label>Pillar ' + (i + 1) + ' — text</label><input class="pillar-x" data-i="' + i + '" value="' + esc(p.text) + '" /></div>' +
      '</div>'
    ).join('');

    $('#c-email').value = s.email;
    $('#c-phone').value = s.phone;
    $('#c-location').value = s.location;
    $('#c-hours').value = s.hours;
  }

  function saveHero() {
    data.content.heroKicker = $('#c-heroKicker').value.trim();
    data.content.heroTitle = $('#c-heroTitle').value.trim();
    data.content.heroSub = $('#c-heroSub').value.trim();
    document.querySelectorAll('.stat-v').forEach(inp => { data.content.stats[+inp.dataset.i].value = inp.value.trim(); });
    document.querySelectorAll('.stat-l').forEach(inp => { data.content.stats[+inp.dataset.i].label = inp.value.trim(); });
    persist();
    toast('✓ Homepage saved.');
  }

  function saveAbout() {
    data.content.aboutTitle = $('#c-aboutTitle').value.trim();
    data.content.aboutBody = $('#c-aboutBody').value.trim();
    data.content.aboutPoints = $('#c-aboutPoints').value.split('\n').map(s => s.trim()).filter(Boolean);
    persist();
    toast('✓ About page saved.');
  }

  function saveVision() {
    data.content.visionTitle = $('#c-visionTitle').value.trim();
    data.content.visionStatement = $('#c-visionStatement').value.trim();
    data.content.visionBody = $('#c-visionBody').value.trim();
    document.querySelectorAll('.pillar-t').forEach(inp => { data.content.visionPillars[+inp.dataset.i].title = inp.value.trim(); });
    document.querySelectorAll('.pillar-x').forEach(inp => { data.content.visionPillars[+inp.dataset.i].text = inp.value.trim(); });
    persist();
    toast('✓ Vision page saved.');
  }

  function saveContact() {
    const email = $('#c-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Please enter a valid email address.', true); return; }
    data.settings.email = email;
    data.settings.phone = $('#c-phone').value.trim();
    data.settings.location = $('#c-location').value.trim();
    data.settings.hours = $('#c-hours').value.trim();
    persist();
    toast('✓ Contact details saved across the site.');
  }

  /* ============ Messages ============ */
  function renderMessages() {
    const msgs = BMStore.messages();
    $('#message-list').innerHTML = msgs.length
      ? msgs.map(m =>
          '<div class="msg-row ' + (m.read ? '' : 'unread') + '">' +
          '<div class="msg-head"><div><b>' + esc(m.name) + '</b> <span style="color:var(--muted);font-size:13px;">&lt;' + esc(m.email) + '&gt;</span>' +
          (m.read ? '' : '<span class="tag red">NEW</span>') + '</div>' +
          '<span class="when">' + fmtWhen(m.at) + '</span></div>' +
          '<div class="msg-body">' + esc(m.message) + '</div>' +
          '<div class="msg-actions">' +
          '<a class="btn btn-ghost btn-sm" href="mailto:' + esc(m.email) + '?subject=' + encodeURIComponent('Re: your Brave Motors enquiry') + '">REPLY BY EMAIL</a>' +
          (m.read ? '' : '<button class="btn btn-ghost btn-sm" onclick="AdminUI.markRead(\'' + m.id + '\')">MARK READ</button>') +
          '<button class="btn btn-danger btn-sm" onclick="AdminUI.deleteMessage(\'' + m.id + '\')">DELETE</button>' +
          '</div></div>'
        ).join('')
      : '<div class="empty">No messages on this device yet.<br>Contact-form enquiries are also emailed straight to <b>' + esc(data.settings.email) + '</b>.</div>';
  }

  function markRead(id) {
    const msgs = BMStore.messages();
    const m = msgs.find(x => x.id === id);
    if (m) { m.read = true; BMStore.saveMessages(msgs); }
    renderMessages(); renderDashboard();
  }

  function markAllRead() {
    const msgs = BMStore.messages().map(m => Object.assign(m, { read: true }));
    BMStore.saveMessages(msgs);
    renderMessages(); renderDashboard();
    toast('All messages marked as read.');
  }

  function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    BMStore.saveMessages(BMStore.messages().filter(m => m.id !== id));
    renderMessages(); renderDashboard();
    toast('Message deleted.');
  }

  /* ============ Settings ============ */
  function changePin() {
    const cur = $('#pin-current').value.trim();
    const next = $('#pin-new').value.trim();
    const confirmPin = $('#pin-confirm').value.trim();
    if (cur !== String(data.settings.pin)) { toast('Current PIN is incorrect.', true); return; }
    if (!/^\d{4,8}$/.test(next)) { toast('New PIN must be 4–8 digits.', true); return; }
    if (next !== confirmPin) { toast('New PIN and confirmation do not match.', true); return; }
    data.settings.pin = next;
    persist();
    $('#pin-current').value = $('#pin-new').value = $('#pin-confirm').value = '';
    toast('✓ PIN updated. Use the new PIN next time you log in.');
  }

  function exportData() {
    const blob = new Blob([BMStore.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'brave-motors-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('✓ Backup downloaded.');
  }

  $('#import-file').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        BMStore.importJSON(reader.result);
        data = BMStore.load();
        renderAll();
        toast('✓ Backup imported — website updated.');
      } catch (e) {
        toast('That file is not a valid Brave Motors backup.', true);
      }
    };
    reader.readAsText(file);
    this.value = '';
  });

  function resetAll() {
    if (!confirm('Reset the ENTIRE website (vehicles, posts, text, contact details and PIN) back to defaults? This cannot be undone.')) return;
    if (!confirm('Are you absolutely sure? All edits will be lost.')) return;
    BMStore.reset();
    data = BMStore.load();
    renderAll();
    toast('Website reset to factory defaults. PIN is 0000 again.');
  }

  /* ============ Render all ============ */
  function renderAll() {
    renderDashboard();
    renderHeroSlides();
    renderVehicles();
    renderPosts();
    renderContentForms();
    renderMessages();
  }

  /* ============ Public API ============ */
  window.AdminUI = {
    go, closeModal,
    replaceHeroSlide, moveHeroSlide, deleteHeroSlide,
    openVehicleForm, saveVehicle, deleteVehicle, clearVehicleImage,
    openPostForm, savePost, deletePost, clearPostImage,
    saveHero, saveAbout, saveVision, saveContact,
    markRead, markAllRead, deleteMessage,
    changePin, exportData, resetAll
  };

  /* ============ Init ============ */
  renderDots();
  if (BMStore.session.isAuthed()) unlock();
})();
