/* ============================================================
   Brave Motors — front-end logic (routing + rendering)
   ============================================================ */
(function () {
  const data = BMStore.load();
  BMStore.bumpViews();

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------- Routing ---------- */
  const ROUTES = ['home', 'vehicles', 'blog', 'vision', 'about', 'contact'];

  function route() {
    let hash = (location.hash || '#home').slice(1);
    let page = hash.split('/')[0];
    if (!ROUTES.includes(page)) page = 'home';

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + page);
    if (el) el.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === page);
    });

    if (page === 'blog') {
      const postId = hash.split('/')[1];
      if (postId) { openPost(postId); } else { closePost(); }
    }
    document.getElementById('nav-links').classList.remove('open');
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', route);

  $('#nav-burger').addEventListener('click', () => {
    $('#nav-links').classList.toggle('open');
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg, isErr) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.toggle('err', !!isErr);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4200);
  }

  /* ---------- Hero + stats ---------- */
  function renderHero() {
    const c = data.content;
    $('#hero-kicker').textContent = c.heroKicker;
    const t = c.heroTitle;
    const dot = t.indexOf('.');
    if (dot > -1 && dot < t.length - 1) {
      $('#hero-title').innerHTML = esc(t.slice(0, dot + 1)) + ' <span class="accent">' + esc(t.slice(dot + 1).trim()) + '</span>';
    } else {
      $('#hero-title').textContent = t;
    }
    $('#hero-sub').textContent = c.heroSub;
    $('#stats-row').innerHTML = (c.stats || []).map(s =>
      '<div class="stat"><div class="v">' + esc(s.value) + '</div><div class="l">' + esc(s.label) + '</div></div>'
    ).join('');
  }

  /* ---------- Vehicles ---------- */
  function vehicleCard(v) {
    const badgeClass = v.status === 'Sold' ? 'sold' : (v.status === 'Incoming' ? 'incoming' : '');
    return (
      '<article class="veh-card">' +
        '<div class="veh-media">' +
          '<span class="veh-badge ' + badgeClass + '">' + esc(v.status || 'Available') + '</span>' +
          '<img src="' + BMStore.vehicleImage(v) + '" alt="' + esc(v.name) + '" loading="lazy" />' +
        '</div>' +
        '<div class="veh-body">' +
          '<div class="veh-cat">' + esc(v.category) + (v.year ? ' · ' + esc(v.year) : '') + '</div>' +
          '<h3 class="veh-name">' + esc(v.name) + '</h3>' +
          '<div class="veh-specs">' + (v.specs || []).slice(0, 4).map(s => '<span>' + esc(s) + '</span>').join('') + '</div>' +
          '<div class="veh-foot">' +
            '<div class="veh-price">' + esc(v.price || 'POA') + '<small>PRICE ON APPLICATION</small></div>' +
            '<div class="veh-actions">' +
              '<button class="btn btn-ghost btn-sm" onclick="openVehicleModal(\'' + v.id + '\')">DETAILS</button>' +
              '<button class="btn btn-red btn-sm" onclick="enquireVehicle(\'' + v.id + '\')">ENQUIRE</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  let activeFilter = 'All';
  function renderVehicles() {
    const cats = ['All'].concat([...new Set(data.vehicles.map(v => v.category))]);
    $('#filter-row').innerHTML = cats.map(c =>
      '<button class="chip' + (c === activeFilter ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>'
    ).join('');
    document.querySelectorAll('#filter-row .chip').forEach(ch => {
      ch.addEventListener('click', () => { activeFilter = ch.dataset.cat; renderVehicles(); });
    });

    const list = activeFilter === 'All' ? data.vehicles : data.vehicles.filter(v => v.category === activeFilter);
    $('#vehicles-grid').innerHTML = list.length
      ? list.map(vehicleCard).join('')
      : '<div class="empty">No vehicles in this category right now — check back soon or <a href="#contact" style="color:var(--gold)">contact us</a>.</div>';

    const featured = data.vehicles.filter(v => v.featured).slice(0, 3);
    $('#featured-grid').innerHTML = (featured.length ? featured : data.vehicles.slice(0, 3)).map(vehicleCard).join('');
  }

  window.openVehicleModal = function (id) {
    const v = data.vehicles.find(x => x.id === id);
    if (!v) return;
    $('#vm-img').src = BMStore.vehicleImage(v);
    $('#vm-cat').textContent = v.category + (v.year ? ' · ' + v.year : '');
    $('#vm-name').textContent = v.name;
    $('#vm-specs').innerHTML = (v.specs || []).map(s => '<span>' + esc(s) + '</span>').join('');
    $('#vm-desc').textContent = v.desc || '';
    $('#vm-price').innerHTML = esc(v.price || 'POA') + '<small>PRICE ON APPLICATION</small>';
    $('#vm-enquire').onclick = () => { closeVehicleModal(); enquireVehicle(id); };
    $('#veh-modal').classList.add('open');
  };
  window.closeVehicleModal = function () {
    $('#veh-modal').classList.remove('open');
  };
  $('#veh-modal').addEventListener('click', (e) => {
    if (e.target.id === 'veh-modal') closeVehicleModal();
  });

  window.enquireVehicle = function (id) {
    const v = data.vehicles.find(x => x.id === id);
    location.hash = '#contact';
    if (v) {
      setTimeout(() => {
        const msg = $('#cf-message');
        msg.value = 'Hi Brave Motors, I\'m interested in the ' + v.name + ' (' + (v.price || 'POA') + '). Please contact me with availability and your best price.';
        $('#cf-name').focus();
      }, 60);
    }
  };

  /* ---------- Blog ---------- */
  function postCard(p) {
    const media = p.image
      ? '<img src="' + p.image + '" alt="' + esc(p.title) + '" loading="lazy" />'
      : '<div class="post-art">' + esc(p.title) + '</div>';
    return (
      '<article class="post-card" onclick="location.hash=\'#blog/' + p.id + '\'">' +
        '<div class="post-media">' + media + '</div>' +
        '<div class="post-body">' +
          '<div class="post-meta">' + esc(fmtDate(p.date)) + ' · ' + esc(p.author || 'Brave Motors') + '</div>' +
          '<h3 class="post-title">' + esc(p.title) + '</h3>' +
          '<p class="post-excerpt">' + esc(p.excerpt || '') + '</p>' +
          '<div class="post-more">READ ARTICLE →</div>' +
        '</div>' +
      '</article>'
    );
  }

  function fmtDate(d) {
    try {
      return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return d; }
  }

  function renderBlog() {
    const sorted = [...data.posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    $('#blog-grid').innerHTML = sorted.length ? sorted.map(postCard).join('') : '<div class="empty">No articles yet — check back soon.</div>';
    $('#home-posts').innerHTML = sorted.slice(0, 3).map(postCard).join('');
  }

  function openPost(id) {
    const p = data.posts.find(x => x.id === id);
    if (!p) { location.hash = '#blog'; return; }
    $('#blog-list').style.display = 'none';
    const reader = $('#blog-reader');
    reader.style.display = 'block';
    reader.innerHTML =
      '<button class="btn btn-ghost btn-sm back" onclick="location.hash=\'#blog\'">← ALL ARTICLES</button>' +
      '<div class="meta">' + esc(fmtDate(p.date)) + ' · ' + esc(p.author || 'Brave Motors') + '</div>' +
      '<h2>' + esc(p.title) + '</h2>' +
      (p.image ? '<div class="reader-hero"><img src="' + p.image + '" alt="" /></div>' : '') +
      '<div class="reader-body">' + String(p.body || '').split(/\n\n+/).map(par => '<p>' + esc(par).replace(/\n/g, '<br>') + '</p>').join('') + '</div>';
  }
  function closePost() {
    $('#blog-list').style.display = 'block';
    $('#blog-reader').style.display = 'none';
  }

  /* ---------- Vision / About ---------- */
  function renderVision() {
    const c = data.content;
    $('#vision-title').textContent = c.visionTitle;
    $('#vision-statement').textContent = '“' + c.visionStatement + '”';
    $('#vision-body').innerHTML = String(c.visionBody || '').split(/\n\n+/).map(p => '<p>' + esc(p) + '</p>').join('');
    $('#vision-pillars').innerHTML = (c.visionPillars || []).map((p, i) =>
      '<div class="pillar"><div class="n">0' + (i + 1) + '</div><div><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></div></div>'
    ).join('');
  }

  function renderAbout() {
    const c = data.content, s = data.settings;
    $('#about-title').textContent = c.aboutTitle;
    $('#about-body').innerHTML = String(c.aboutBody || '').split(/\n\n+/).map(p => '<p>' + esc(p) + '</p>').join('');
    $('#about-points').innerHTML = (c.aboutPoints || []).map(p => '<li>' + esc(p) + '</li>').join('');
    $('#about-info').innerHTML = infoRows(s);
  }

  function infoRows(s) {
    return (
      '<div class="row"><div class="ic">📧</div><div><b>Email</b><span><a href="mailto:' + esc(s.email) + '" style="color:var(--gold-soft)">' + esc(s.email) + '</a></span></div></div>' +
      '<div class="row"><div class="ic">📞</div><div><b>Phone</b><span><a href="tel:' + esc(s.phone).replace(/\s/g, '') + '" style="color:var(--gold-soft)">' + esc(s.phone) + '</a></span></div></div>' +
      '<div class="row"><div class="ic">📍</div><div><b>Location</b><span>' + esc(s.location) + '</span></div></div>' +
      '<div class="row"><div class="ic">🕘</div><div><b>Opening Hours</b><span>' + esc(s.hours) + '</span></div></div>'
    );
  }

  /* ---------- Contact ---------- */
  function renderContact() {
    const s = data.settings;
    $('#contact-info').innerHTML = infoRows(s);
    $('#cf-note-email').textContent = s.email;
    $('#tb-phone').textContent = s.phone;
    $('#tb-phone').href = 'tel:' + s.phone.replace(/\s/g, '');
    $('#tb-email').textContent = s.email;
    $('#tb-email').href = 'mailto:' + s.email;
    $('#ft-email').textContent = s.email;
    $('#ft-email').href = 'mailto:' + s.email;
    $('#ft-phone').textContent = s.phone;
    $('#ft-phone').href = 'tel:' + s.phone.replace(/\s/g, '');
    $('#ft-location').textContent = '📍 ' + s.location;
    $('#ft-hours').textContent = '🕘 ' + s.hours;
  }

  $('#contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = $('#cf-submit');
    const name = $('#cf-name').value.trim();
    const email = $('#cf-email').value.trim();
    const message = $('#cf-message').value.trim();
    if (!name || !email || !message) return;

    btn.disabled = true;
    btn.textContent = 'SENDING…';

    // Keep a copy for the admin Messages inbox.
    BMStore.addMessage({ name, email, message });

    try {
      const res = await fetch('https://formsubmit.co/ajax/' + data.settings.email, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name, email, message,
          _subject: 'New enquiry from the Brave Motors website'
        })
      });
      if (!res.ok) throw new Error('send failed');
      toast('✓ Message sent! The Brave Motors team will be in touch soon.');
      this.reset();
    } catch (err) {
      // Network/service fallback: open the user's mail client instead.
      toast('Could not reach the mail service — opening your email app instead.', true);
      location.href = 'mailto:' + data.settings.email +
        '?subject=' + encodeURIComponent('Brave Motors enquiry from ' + name) +
        '&body=' + encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
    } finally {
      btn.disabled = false;
      btn.textContent = 'SEND MESSAGE';
    }
  });

  /* ---------- Init ---------- */
  renderHero();
  renderVehicles();
  renderBlog();
  renderVision();
  renderAbout();
  renderContact();
  route();
})();
