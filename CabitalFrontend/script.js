
const API_BASE = 'http://localhost:8080';
const TOKEN_KEY = 'cabital_jwt';

const modelsByType = {
  'Car': ['Maruti 800', 'Swift', 'Innova', 'Bolero', 'Dzire'],
  'Van': ['OMNI', 'EECO', 'Innova Crysta'],
  'carrier vehicles': ['Tata ACE', 'Maximo', 'Dost', 'ACE EV'],
  'Bikes': ['XL Super', 'Hero Splendor', 'Pulsar', 'Royal Enfield']
};

// Fade in/out animation is now handled purely by CSS keyframes
// Text 'Rent Drive Explore' will appear and disappear continuously


const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);
const saveName = (name) => localStorage.setItem('cabital_name', name);
const getName = () => localStorage.getItem('cabital_name');
const clearName = () => localStorage.removeItem('cabital_name');

const requireAuth = () => {
  const token = getToken();
  if (!token) {
    alert('Login required to continue booking');
    window.location.href = 'login.html';
    return null;
  }
  return token;
};

const combineDateTime = (date, time) => `${date}T${time}`;

const redirectToBooking = (payload) => {
  const params = new URLSearchParams(payload);
  window.location.href = `bookvehicle.html?${params.toString()}`;
};

const populateModelSelect = (type, selectEl) => {
  if (!selectEl) return;
  const models = modelsByType[type] || [];
  selectEl.innerHTML = '';
  models.forEach((m) => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    selectEl.appendChild(opt);
  });
};

const initHomeBooking = () => {
  const vehicleButtons = document.querySelectorAll('.vehicle');
  const modelSelect = document.getElementById('vehicle-model');
  const findBtn = document.getElementById('subbtn');

  if (!vehicleButtons.length || !modelSelect || !findBtn) return;

  vehicleButtons.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      vehicleButtons.forEach((b) => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const type = e.currentTarget.textContent.trim();
      document.getElementById('booking-text').innerText = `Booking Vehicle: ${type}`;
      populateModelSelect(type, modelSelect);
    })
  );

  findBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const vehicleBtn = document.querySelector('.vehicle.active');
    const vehicleType = vehicleBtn ? vehicleBtn.textContent.trim() : '';
    const model = modelSelect.value;
    const pickupLocation = document.getElementById('location')?.value.trim();
    const dropLocation = document.getElementById('droploc')?.value.trim();
    const startDate = document.getElementById('picdate')?.value;
    const endDate = document.getElementById('retdate')?.value;
    const startTime = document.getElementById('picktime')?.value || '07:00';
    const endTime = document.getElementById('rettime')?.value || '10:00';

    if (!vehicleType) return alert('Please select a vehicle type');
    if (!model) return alert('Please select a vehicle model');
    if (!pickupLocation) return alert('Please enter a pickup location');
    if (!dropLocation) return alert('Please enter a drop location');
    if (!startDate || !endDate) return alert('Please select pickup and return dates');

    redirectToBooking({
      type: vehicleType,
      model,
      pickupLocation,
      dropLocation,
      startDate,
      startTime,
      endDate,
      endTime
    });
  });
};

const initVehicleCards = () => {
  const type = document.body?.dataset?.vehicleType;
  if (!type) return;
  const buttons = document.querySelectorAll('.car-card button, .car-card a.btn');
  buttons.forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.car-card');
      const model = card?.querySelector('h4')?.textContent || 'Preferred model';
      const today = new Date().toISOString().split('T')[0];
      redirectToBooking({
        type,
        model,
        pickupLocation: '',
        dropLocation: '',
        startDate: today,
        endDate: today,
        startTime: '07:00',
        endTime: '10:00'
      });
    })
  );
};

let currentBooking = null;

const renderVehicles = (vehicles) => {
  const list = document.getElementById('vehicles-list');
  const hint = document.getElementById('available-hint');
  if (!list) return;
  list.innerHTML = '';
  if (!vehicles || !vehicles.length) {
    if (hint) hint.textContent = 'No vehicles match this date/time. Try another slot.';
       return;
   }
  vehicles.forEach((v) => {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
      <img src="${v.thumbnailUrl || 'https://via.placeholder.com/140x90?text=Vehicle'}" alt="${v.model}">
      <div>
        <h4>${v.make || ''} ${v.model}</h4>
        <div class="vehicle-meta">
          <span class="pill">${v.type}</span>
          <span class="pill">${v.location || 'Any location'}</span>
        </div>
        <p class="price">₹${v.basePricePerDay}/day</p>
        <button class="cta" data-vid="${v.id}">Book Now</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => createBooking(v.id));
    list.appendChild(card);
  });
};

const readBookingForm = () => {
  const value = (id) => document.getElementById(id)?.value?.trim() || '';
  return {
    type: value('vehicle-type'),
    model: value('vehicle-model'),
    pickupLocation: value('pickup-location'),
    dropLocation: value('drop-location'),
    startDate: value('start-date'),
    startTime: value('start-time'),
    endDate: value('end-date'),
    endTime: value('end-time'),
    contactName: value('contact-name'),
    contactPhone: value('contact-phone')
  };
};

const searchVehicles = async () => {
  const form = readBookingForm();
  if (!form.startDate || !form.endDate) return alert('Select dates to search');
  if (!form.pickupLocation || !form.dropLocation) return alert('Enter pickup and drop locations');
  if (!form.contactName || !form.contactPhone) return alert('Enter contact name and phone');
  
  try {
    const searchBtn = document.getElementById('search-available');
    if (searchBtn) {
      searchBtn.disabled = true;
      searchBtn.textContent = 'Processing...';
    }
    
    // Get all vehicles of the selected type (without date filtering)
    const params = new URLSearchParams({
      type: form.type || ''
    });
    
    const res = await fetch(`${API_BASE}/api/vehicles/search?${params.toString()}`);
    
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Check availability';
    }
    
    if (!res.ok) {
      const error = await res.text();
      alert('Unable to load vehicles: ' + error);
      return;
    }
    
    const data = await res.json();
    
    // If no vehicles found, show message and suggestion
    if (!data || data.length === 0) {
      const list = document.getElementById('vehicles-list');
      const hint = document.getElementById('available-hint');
      if (list) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No vehicles available for selected type. Please try another vehicle type.</div>';
      }
      if (hint) {
        hint.textContent = 'No vehicles found for this type. Try selecting another type.';
      }
      return;
    }
    
    renderVehicles(data);
  } catch (e) {
    console.error('Search error:', e);
    alert('Network error: ' + e.message);
    const searchBtn = document.getElementById('search-available');
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.textContent = 'Check availability';
    }
  }
};

const showPricePanel = (booking) => {
  const panel = document.getElementById('price-panel');
  const summary = document.getElementById('price-summary');
  if (!panel || !summary) return;
  summary.innerHTML = `
    <div class="label">Booking ID</div><div class="summary-value">#${booking.id}</div>
    <div class="label">Vehicle</div><div class="summary-value">${booking.vehicleMake} ${booking.vehicleModel}</div>
    <div class="label">Pickup</div><div class="summary-value">${booking.pickupLocation}</div>
    <div class="label">Drop</div><div class="summary-value">${booking.dropLocation}</div>
    <div class="label">Start</div><div class="summary-value">${booking.startDateTime}</div>
    <div class="label">End</div><div class="summary-value">${booking.endDateTime}</div>
    <div class="label">Total</div><div class="summary-value">₹${booking.totalPrice}</div>
  `;
  panel.classList.remove('hidden');
};

const createBooking = async (vehicleId) => {
  const token = requireAuth();
  if (!token) return;
  const form = readBookingForm();
  if (!form.pickupLocation || !form.dropLocation) return alert('Enter pickup and drop locations');
  if (!form.startDate || !form.endDate) return alert('Select pickup and return dates');
  if (!form.contactName) return alert('Enter contact name');
  if (!form.contactPhone) return alert('Enter contact phone');
  
  const payload = {
    vehicleId,
    pickupLocation: form.pickupLocation,
    dropLocation: form.dropLocation,
    startDateTime: combineDateTime(form.startDate, form.startTime || '07:00'),
    endDateTime: combineDateTime(form.endDate, form.endTime || '10:00'),
    contactName: form.contactName,
    contactPhone: form.contactPhone
  };

  try {
    console.debug('Create booking payload:', payload);
    console.debug('Using token:', token);
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) {
      const error = await res.text();
      console.error('Booking response status:', res.status, res.statusText, 'body:', error);
      return alert('Booking failed: ' + error + ' (status ' + res.status + ')');
    }
    currentBooking = await res.json();
    
    // Hide search section and show booking details
    const bookingWrapper = document.querySelector('.booking-wrapper');
    if (bookingWrapper) {
      bookingWrapper.style.display = 'none';
    }
    
    showPricePanel(currentBooking);
    document.getElementById('price-panel')?.classList.remove('hidden');
    document.getElementById('qr-panel')?.classList.add('hidden');
    
    // Scroll to price panel
    document.getElementById('price-panel')?.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    console.error('Booking error:', e);
    alert('Network error: ' + e.message);
  }
};

const proceedToPay = async () => {
  if (!currentBooking) return alert('No booking selected');
  const token = requireAuth();
  if (!token) return;
  
  try {
    document.getElementById('proceed-to-pay').disabled = true;
    document.getElementById('proceed-to-pay').textContent = 'Generating QR...';
    
    const res = await fetch(`${API_BASE}/api/payments/qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId: currentBooking.id, amount: currentBooking.totalPrice })
    });
    
    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) {
      const error = await res.text();
      alert('Unable to generate QR: ' + error);
      document.getElementById('proceed-to-pay').disabled = false;
      document.getElementById('proceed-to-pay').textContent = 'Proceed to Pay';
      return;
    }
    
    const data = await res.json();
    const qrImage = document.getElementById('qr-image');
    const qrMessage = document.getElementById('qr-message');
    
    if (qrImage) qrImage.src = data.qrBase64;
    if (qrMessage) qrMessage.textContent = `Booking successful! Please pay ₹${currentBooking.totalPrice} using the QR code below.`;
    
    document.getElementById('price-panel')?.classList.add('hidden');
    document.getElementById('qr-panel')?.classList.remove('hidden');
    document.getElementById('qr-panel')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('proceed-to-pay').disabled = false;
    document.getElementById('proceed-to-pay').textContent = 'Proceed to Pay';
  } catch (e) {
    console.error('Payment error:', e);
    alert('Network error: ' + e.message);
    document.getElementById('proceed-to-pay').disabled = false;
    document.getElementById('proceed-to-pay').textContent = 'Proceed to Pay';
  }
};

const confirmPayment = async () => {
  if (!currentBooking) return alert('No booking found');
  const token = requireAuth();
  if (!token) return;
  
  try {
    document.getElementById('confirm-payment').disabled = true;
    document.getElementById('confirm-payment').textContent = 'Processing...';
    
    const reference = `QR-${Date.now()}`;
    const res = await fetch(`${API_BASE}/api/bookings/${currentBooking.id}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ paymentReference: reference })
    });
    
    if (res.status === 401) return handleUnauthorized();
    if (!res.ok) {
      const error = await res.text();
      alert('Could not confirm payment: ' + error);
      document.getElementById('confirm-payment').disabled = false;
      document.getElementById('confirm-payment').textContent = 'Payment done? Confirm & continue';
      return;
    }
    
    const booking = await res.json();
    window.location.href = `booking-success.html?bookingId=${booking.id}`;
  } catch (e) {
    console.error('Payment confirmation error:', e);
    alert('Network error: ' + e.message);
    document.getElementById('confirm-payment').disabled = false;
    document.getElementById('confirm-payment').textContent = 'Payment done? Confirm & continue';
  }
};

const prefillFromParams = () => {
  const params = new URLSearchParams(window.location.search);
  const startDateEl = document.getElementById('start-date');
  const endDateEl = document.getElementById('end-date');
  if (!params.toString() && !startDateEl && !endDateEl) return;
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  };
  setVal('vehicle-type', params.get('type'));
  setVal('vehicle-model', params.get('model'));
  setVal('pickup-location', params.get('pickupLocation'));
  setVal('drop-location', params.get('dropLocation'));
  setVal('start-date', params.get('startDate'));
  setVal('end-date', params.get('endDate'));
  setVal('start-time', params.get('startTime'));
  setVal('end-time', params.get('endTime'));
  // sensible defaults if nothing passed
  const today = new Date().toISOString().split('T')[0];
  if (startDateEl && !startDateEl.value) startDateEl.value = today;
  if (endDateEl && !endDateEl.value) endDateEl.value = today;
  const banner = document.getElementById('prefill-banner');
  if (banner) banner.classList.remove('hidden');
};

const initBookVehiclePage = () => {
  const searchBtn = document.getElementById('search-available');
  const proceedBtn = document.getElementById('proceed-to-pay');
  const confirmBtn = document.getElementById('confirm-payment');
  
  if (searchBtn) {
    prefillFromParams();
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchVehicles();
    });
  }
  
  if (proceedBtn) {
    proceedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      proceedToPay();
    });
  }
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confirmPayment();
    });
  }
  
  // Add back button functionality
  window.goBackToSearch = () => {
    currentBooking = null;
    const bookingWrapper = document.querySelector('.booking-wrapper');
    if (bookingWrapper) {
      bookingWrapper.style.display = 'grid';
    }
    document.getElementById('price-panel')?.classList.add('hidden');
    document.getElementById('qr-panel')?.classList.add('hidden');
    window.scrollTo(0, 0);
  };
};

const handleUnauthorized = () => {
  alert('Login required to continue booking');
  window.location.href = 'login.html';
};

const loadBookingSuccess = async () => {
  const grid = document.getElementById('success-grid');
  if (!grid) return;
  
  const bookingId = new URLSearchParams(window.location.search).get('bookingId');
  if (!bookingId) {
    grid.innerHTML = '<p style="grid-column: 1/-1; color: red;">Please provide a bookingId in the URL.</p>';
    return;
  }
  
  const token = getToken();
  if (!token) {
    grid.innerHTML = '<p style="grid-column: 1/-1; color: red;">Login required. <a href="login.html">Go to login</a></p>';
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.status === 401) {
      grid.innerHTML = '<p style="grid-column: 1/-1; color: red;">Session expired. <a href="login.html">Login again</a></p>';
      return;
    }
    
    if (!res.ok) {
      const error = await res.text();
      grid.innerHTML = '<p style="grid-column: 1/-1; color: red;">Unable to load booking: ' + error + '</p>';
      return;
    }
    
    const b = await res.json();
    grid.innerHTML = `
      <div class="label">Booking ID</div><div class="summary-value">#${b.id}</div>
      <div class="label">Vehicle</div><div class="summary-value">${b.vehicleMake} ${b.vehicleModel} (${b.vehicleType})</div>
      <div class="label">Pickup</div><div class="summary-value">${b.pickupLocation}</div>
      <div class="label">Drop</div><div class="summary-value">${b.dropLocation}</div>
      <div class="label">Start</div><div class="summary-value">${b.startDateTime}</div>
      <div class="label">Return</div><div class="summary-value">${b.endDateTime}</div>
      <div class="label">Total</div><div class="summary-value">₹${b.totalPrice}</div>
      <div class="label">Payment Ref</div><div class="summary-value">${b.paymentReference || '-'}</div>
    `;
    
    const chip = document.getElementById('status-chip');
    if (chip) {
      chip.textContent = b.status;
      chip.style.backgroundColor = b.status === 'CONFIRMED' ? '#4CAF50' : '#FFC107';
      chip.style.color = b.status === 'CONFIRMED' ? '#fff' : '#000';
    }
    
    const note = document.getElementById('status-note');
    if (note) {
      note.textContent = b.status === 'CONFIRMED'
        ? 'Payment received. Your vehicle is reserved.'
        : 'Awaiting payment confirmation.';
    }
  } catch (e) {
    console.error('Load booking error:', e);
    grid.innerHTML = '<p style="grid-column: 1/-1; color: red;">Network error: ' + e.message + '</p>';
  }
};

const initCounters = () => {
  const animate = (id, start, end, speed) => {
    const el = document.getElementById(id);
    if (!el) return;
    let current = start;
    const step = () => {
      const inc = Math.ceil((end - current) / 100);
      if (current < end) {
        current += inc;
        el.textContent = `${current}+`;
        setTimeout(step, speed);
      } else {
        el.textContent = `${end}+`;
      }
    };
    step();
  };
  animate('counter1', 1000, 4500, 1);
  animate('counter2', 1000, 2750, 1);
  animate('counter3', 100, 450, 1);
  animate('counter4', 1, 12, 250);
};

document.addEventListener('DOMContentLoaded', () => {
  // update header auth UI
  const updateAuthHeader = () => {
    const name = getName();
    const signupBtn = document.getElementById('signup');
    if (!signupBtn) return;
    if (name) {
      // show greeting and logout
      signupBtn.textContent = `Hi, ${name}`;
      signupBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm('Logout?')) {
          clearToken();
          clearName();
          window.location.reload();
        }
      };
      // remove link wrapper if present
      if (signupBtn.parentElement && signupBtn.parentElement.tagName.toLowerCase() === 'a') {
        const parent = signupBtn.parentElement;
        parent.replaceWith(signupBtn);
      }
    } else {
      // ensure it links to login page
      signupBtn.textContent = 'Sign up/Login';
      signupBtn.onclick = null;
      // if not wrapped in <a>, add link
      if (!(signupBtn.parentElement && signupBtn.parentElement.tagName.toLowerCase() === 'a')) {
        const wrapper = document.createElement('a');
        wrapper.href = 'login.html';
        signupBtn.replaceWith(wrapper);
        wrapper.appendChild(signupBtn);
      }
    }
  };
  updateAuthHeader();
  initHomeBooking();
  initVehicleCards();
  initBookVehiclePage();
  loadBookingSuccess();
  initCounters();
});
