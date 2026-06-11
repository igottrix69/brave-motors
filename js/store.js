/* ============================================================
   Brave Motors — shared data layer
   Defaults below are the "factory" content. Anything edited in
   the admin backend is saved to localStorage and overrides them.
   ============================================================ */
(function () {
  const DATA_KEY = 'bm_site_v1';
  const MSG_KEY = 'bm_messages_v1';
  const VIEWS_KEY = 'bm_views_v1';
  const SESSION_KEY = 'bm_admin_session';

  const DEFAULTS = {
    settings: {
      pin: '0000',
      email: 'support@pngbravegroup.com',
      phone: '+675 7998 8842',
      location: 'Port Moresby, Papua New Guinea',
      hours: 'Mon–Fri 8:00am – 5:00pm · Sat 9:00am – 1:00pm'
    },
    heroSlides: [
      { id: 'h-1', image: 'assets/hero/hero-1.webp', alt: 'Toyota Land Cruiser 76 Series at sunset' },
      { id: 'h-2', image: 'assets/hero/hero-2.webp', alt: 'Foton V9 on the beach at sunset' },
      { id: 'h-3', image: 'assets/hero/hero-3.webp', alt: 'Toyota Land Cruiser troop carrier ambulance' },
      { id: 'h-4', image: 'assets/hero/hero-4.webp', alt: 'Kia Sportage pair over Port Moresby at dusk' },
      { id: 'h-5', image: 'assets/hero/hero-5.webp', alt: 'Toyota Hilux Travo Overland — built for PNG' }
    ],
    content: {
      heroKicker: 'BRAVE GROUP (PNG) LTD · AUTOMOTIVE DIVISION',
      heroTitle: 'Premium vehicles. Built for Papua New Guinea.',
      heroSub: 'From the highlands to the coast, Brave Motors delivers dependable, dealer-backed vehicles with genuine after-sales support — so you can drive anywhere PNG takes you.',
      stats: [
        { value: '6+', label: 'Premium models in stock' },
        { value: '22', label: 'Provinces we serve' },
        { value: '100%', label: 'Dealer-backed support' },
        { value: '24/7', label: 'Enquiry response line' }
      ],
      aboutTitle: 'A dealership PNG can count on.',
      aboutBody: 'Brave Motors is the automotive division of Brave Group (PNG) Ltd — your trusted partner in construction, security and automation.\n\nWe supply hand-picked, PNG-ready vehicles to families, businesses, mining and government fleets across the country. Every vehicle we sell is selected for the realities of Papua New Guinea: rough roads, long distances and hard work.\n\nFrom your first enquiry to long after you drive away, our team backs you with honest advice, transparent pricing and genuine after-sales care. That is what it means to buy Brave.',
      aboutPoints: [
        'PNG-ready vehicles, inspected and prepared in-country',
        'Transparent pricing — no surprises, no pressure',
        'Fleet and business supply for mining, government and NGOs',
        'After-sales support, parts assistance and servicing guidance'
      ],
      visionTitle: 'The Brave Group vision.',
      visionStatement: 'To be Papua New Guinea’s most trusted partner — building, protecting and moving the nation through construction, security, automation and automotive excellence.',
      visionBody: 'Brave Group (PNG) Ltd was founded on a simple belief: Papua New Guineans deserve world-class service from a company that understands PNG. Our divisions work together to build the country’s future — constructing its infrastructure, securing its people and property, automating its industries, and keeping it moving with dependable vehicles.\n\nBrave Motors carries that vision onto the road. Every vehicle we deliver is a promise: that quality, honesty and service excellence belong to PNG.',
      visionPillars: [
        { title: 'Construction', text: 'Building PNG’s future with quality workmanship, dependable project delivery and local expertise.' },
        { title: 'Security & Automation', text: 'Protecting people, property and business with modern security systems and smart automation.' },
        { title: 'Motors', text: 'Moving the nation with premium, PNG-ready vehicles backed by genuine dealer support.' }
      ]
    },
    vehicles: [
      {
        id: 'v-lc70',
        name: 'Toyota Land Cruiser 70 Series',
        category: 'Heavy-Duty 4WD',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: true,
        accent: '#E5A33B',
        art: '4WD',
        image: '',
        specs: ['Turbo diesel', 'Part-time 4WD', 'Heavy-duty chassis', 'PNG terrain proven'],
        desc: 'The legend that built PNG. The Land Cruiser 70 Series is the benchmark for durability — trusted by mines, missions and families across every province. Unbreakable capability with genuine Toyota engineering.'
      },
      {
        id: 'v-lc76',
        name: 'Toyota Land Cruiser 76 Series Wagon',
        category: 'Heavy-Duty 4WD',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: true,
        accent: '#E11D2E',
        art: '4WD',
        image: '',
        specs: ['Turbo diesel', '5-door wagon', 'Seats 5+', 'Snorkel ready'],
        desc: 'All the toughness of the 70 Series in a family-and-crew wagon. The 76 Series carries people and payload deep into the highlands and back again — comfortably, reliably, every time.'
      },
      {
        id: 'v-lc79',
        name: 'Toyota Land Cruiser 79 Series',
        category: 'Heavy-Duty 4WD',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: true,
        accent: '#F08C1E',
        art: 'UTE',
        image: '',
        specs: ['Turbo diesel', 'Cab-chassis ute', 'Single & double cab', 'Workhorse payload'],
        desc: 'The ultimate working ute. The 79 Series cab-chassis hauls crews, tools and cargo through conditions that stop everything else. The first choice for PNG projects, plantations and fleets.'
      },
      {
        id: 'v-travo',
        name: 'Toyota Hilux Travo',
        category: 'Ute',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: false,
        accent: '#E5A33B',
        art: 'UTE',
        image: '',
        specs: ['Turbo diesel', 'Double cab', 'Modern styling', 'City to outback'],
        desc: 'The next generation of the world’s most trusted ute. Bold new styling, modern comfort and the Hilux DNA that PNG already knows — unstoppable reliability, now with serious road presence.'
      },
      {
        id: 'v-optima',
        name: 'Kia Optima',
        category: 'Sedan',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: false,
        accent: '#9AA3AF',
        art: 'SEDAN',
        image: '',
        specs: ['Executive sedan', 'Premium interior', 'Fuel efficient', 'City refined'],
        desc: 'Executive style for Port Moresby boardrooms and boulevards. The Kia Optima pairs sleek design with a refined, fuel-efficient drive — the smart choice for business and family alike.'
      },
      {
        id: 'v-fotonv9',
        name: 'Foton V9',
        category: 'Ute',
        year: '2025',
        price: 'POA',
        status: 'Available',
        featured: false,
        accent: '#2E6FE0',
        art: 'UTE',
        image: '',
        specs: ['Turbo diesel', 'Double cab 4WD', 'Bold street presence', 'Outstanding value'],
        desc: 'Big-truck attitude, smart price. The Foton V9 delivers head-turning looks, a commanding ride and serious capability — premium presence without the premium price tag.'
      }
    ],
    posts: [
      {
        id: 'p-1',
        title: 'Why the Land Cruiser 70 Series still rules PNG roads',
        author: 'Brave Motors Team',
        date: '2026-05-28',
        image: '',
        excerpt: 'Forty years on, no vehicle has earned the trust of Papua New Guinea like the 70 Series. Here’s why it remains the nation’s workhorse of choice.',
        body: 'Drive any road in Papua New Guinea — from the Highlands Highway to the coastal tracks of Milne Bay — and one silhouette appears more than any other: the Toyota Land Cruiser 70 Series.\n\nIts secret is simple. The 70 Series was engineered for places where a breakdown is not an inconvenience but an emergency. A rugged ladder chassis, proven turbo-diesel power and mechanical simplicity mean it can be maintained and repaired far from the city.\n\nFor mines, missions, NGOs and families alike, the calculation is the same: when the road gets hard, you want the vehicle that has already proven it can take it. That is why the 70 Series remains the first vehicle we recommend for serious PNG driving — and why it remains the backbone of the Brave Motors range.'
      },
      {
        id: 'p-2',
        title: '5 checks every PNG buyer should make before purchasing a 4WD',
        author: 'Brave Motors Team',
        date: '2026-05-12',
        image: '',
        excerpt: 'Buying a 4WD in PNG is a serious investment. These five checks protect you from expensive surprises.',
        body: 'A 4WD is one of the biggest purchases most PNG families and businesses will make. Before you commit, walk through these five checks:\n\n1. Service history — ask for documented servicing. A well-serviced engine outlasts a neglected one by years.\n\n2. Chassis and underbody — PNG conditions punish the underside. Look for rust, cracked mounts and damaged crossmembers.\n\n3. Drivetrain engagement — test 4WD high and low range. Engagement should be clean, with no grinding or slipping.\n\n4. Parts availability — choose models with strong parts support in PNG. A cheap vehicle with no parts becomes an expensive ornament.\n\n5. Dealer backing — buy from a dealer who answers the phone after the sale. After-sales support is worth more than any discount.\n\nAt Brave Motors every vehicle is inspected and PNG-prepared before delivery — and our team remains on call long after you drive away.'
      },
      {
        id: 'p-3',
        title: 'Brave Motors: a new standard for vehicle buying in PNG',
        author: 'Brave Group (PNG) Ltd',
        date: '2026-04-30',
        image: '',
        excerpt: 'Brave Group (PNG) Ltd launches its automotive division with a simple promise: premium vehicles, honest service, PNG-wide support.',
        body: 'Brave Group (PNG) Ltd is proud to introduce Brave Motors — a dealership built around a simple promise: premium vehicles, honest pricing and genuine support for every customer in Papua New Guinea.\n\nFor too long, PNG buyers have had to choose between quality and service. Brave Motors exists to end that compromise. Our range is hand-picked for PNG conditions, our pricing is transparent, and our after-sales team treats your vehicle like our reputation depends on it — because it does.\n\nWhether you are a family buying your first wagon, a company building a fleet, or a project manager who needs vehicles that simply cannot fail, Brave Motors is ready to serve you. Visit us, call us, or send an enquiry through this website — and experience what it means to buy Brave.'
      }
    ]
  };

  function deepMerge(base, over) {
    if (Array.isArray(base) || Array.isArray(over)) return over !== undefined ? over : base;
    if (typeof base === 'object' && base && typeof over === 'object' && over) {
      const out = {};
      Object.keys(base).forEach(k => { out[k] = deepMerge(base[k], over[k]); });
      Object.keys(over).forEach(k => { if (!(k in out)) out[k] = over[k]; });
      return out;
    }
    return over !== undefined ? over : base;
  }

  const Store = {
    defaults: DEFAULTS,
    load() {
      try {
        const raw = localStorage.getItem(DATA_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
        return deepMerge(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(raw));
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULTS));
      }
    },
    save(data) {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },
    reset() {
      localStorage.removeItem(DATA_KEY);
    },
    exportJSON() {
      return JSON.stringify({ site: this.load(), messages: this.messages() }, null, 2);
    },
    importJSON(text) {
      const parsed = JSON.parse(text);
      if (parsed.site) localStorage.setItem(DATA_KEY, JSON.stringify(parsed.site));
      if (parsed.messages) localStorage.setItem(MSG_KEY, JSON.stringify(parsed.messages));
    },
    messages() {
      try { return JSON.parse(localStorage.getItem(MSG_KEY) || '[]'); } catch (e) { return []; }
    },
    saveMessages(list) {
      localStorage.setItem(MSG_KEY, JSON.stringify(list));
    },
    addMessage(msg) {
      const list = this.messages();
      list.unshift(Object.assign({ id: 'm-' + Date.now(), at: new Date().toISOString(), read: false }, msg));
      this.saveMessages(list);
    },
    views() {
      return parseInt(localStorage.getItem(VIEWS_KEY) || '0', 10);
    },
    bumpViews() {
      localStorage.setItem(VIEWS_KEY, String(this.views() + 1));
    },
    session: {
      isAuthed() { return sessionStorage.getItem(SESSION_KEY) === 'ok'; },
      login() { sessionStorage.setItem(SESSION_KEY, 'ok'); },
      logout() { sessionStorage.removeItem(SESSION_KEY); }
    },
    uid(prefix) {
      return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
  };

  /* Premium typographic placeholder art for vehicles without a photo. */
  Store.vehicleArt = function (vehicle) {
    const accent = (vehicle && vehicle.accent) || '#E5A33B';
    const tag = (vehicle && vehicle.art) || '4WD';
    const name = ((vehicle && vehicle.name) || 'Brave Motors').toUpperCase();
    const line1 = name.length > 22 ? name.slice(0, name.lastIndexOf(' ', 22)) : name;
    const line2 = name.length > 22 ? name.slice(name.lastIndexOf(' ', 22) + 1) : '';
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">' +
      '<defs>' +
      '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#171B22"/><stop offset="1" stop-color="#0A0C0F"/>' +
      '</linearGradient>' +
      '<linearGradient id="flame" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#F6C544"/><stop offset=".55" stop-color="#F08C1E"/><stop offset="1" stop-color="#E11D2E"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="800" height="500" fill="url(#bg)"/>' +
      '<g opacity=".05"><text x="400" y="330" font-family="Arial Black, Arial, sans-serif" font-size="230" font-weight="900" text-anchor="middle" fill="#FFFFFF" letter-spacing="6">' + tag + '</text></g>' +
      '<path d="M0 470 L800 430 L800 500 L0 500 Z" fill="' + accent + '" opacity=".12"/>' +
      '<rect x="60" y="96" width="56" height="5" fill="url(#flame)"/>' +
      '<text x="60" y="140" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="5" fill="#9AA3AF">BRAVE MOTORS</text>' +
      '<text x="60" y="196" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="1" fill="#F4F1EA">' + line1 + '</text>' +
      (line2 ? '<text x="60" y="238" font-family="Arial Black, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="1" fill="#F4F1EA">' + line2 + '</text>' : '') +
      '<text x="60" y="' + (line2 ? 286 : 244) + '" font-family="Arial, sans-serif" font-size="15" letter-spacing="3" fill="' + accent + '">OFFICIAL PHOTOGRAPHY COMING SOON</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  Store.vehicleImage = function (vehicle) {
    return (vehicle && vehicle.image) ? vehicle.image : Store.vehicleArt(vehicle);
  };

  window.BMStore = Store;
})();
