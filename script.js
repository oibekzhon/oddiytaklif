const BOT_TOKEN = '8921578186:AAG9si120ac3Ym1fcYB093Ty7J5zIQgbJ4w';
const CHAT_ID = '6541217455';

const state = {
    date: '',
    time: '',
    location: '',
    drink: '',
    sweet: '',
    flower: '',
    music: ''
};

function goStep(id) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    el.classList.add('active');
    window.scrollTo(0, 0);

    if (id === 'step-dresscode') buildDressCode();
    if (id === 'step-confirm') buildSummary();
}

function nextFromDatetime() {
    const d = document.getElementById('date-input').value;
    const t = document.getElementById('time-input').value;
    if (!d) { alert("Iltimos, sanani tanlang 📅"); return; }
    if (!t) { alert("Iltimos, vaqtni tanlang ⏰"); return; }
    state.date = d;
    state.time = t;
    goStep('step-location');
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date-input').min = today;
});

function selectLocation(el, name) {
    document.querySelectorAll('.loc-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    state.location = name;
    document.getElementById('loc-btn').disabled = false;
}

function selectOpt(el, group) {

    el.closest('.question-block').querySelectorAll('.opt-btn').forEach(b => b.classList.remove('picked'));
    el.classList.add('picked');
    state[group] = el.textContent.trim();
    checkAllPicked();
}

function checkAllPicked() {
    const allAnswered = state.drink && state.sweet && state.flower && state.music;
    document.getElementById('q-btn').disabled = !allAnswered;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('q-btn').disabled = true;
});

function buildDressCode() {
    const loc = state.location || '';
    const tips = {
        'Shinam qahvaxona ☕': {
            emoji: '👗',
            text: 'Qahvaxona uchun engil va qulay kiyinish tavsiya etiladi. Casual-chic uslub juda ideal — masalan, qulay ko\'ylak yoki yoqimli bluzka. <strong>Va albatta, tabassumingizni unutmang!</strong> ☕✨'
        },
        'Istirohat bog\'ida sayr 🌿': {
            emoji: '👟',
            text: 'Bog\'da sayr uchun qulay poyafzal va yengil kiyim tavsiya etiladi. Sport-elegant uslub ideal — masalan, yengil ko\'ylak va qulay krossovkalar. <strong>Toza havo uchun ochiq rang kiyimlar juda yaxshi!</strong> 🌿🌸'
        },
        'Kino tomosha 🎬': {
            emoji: '🎭',
            text: 'Kino uchun juda rasmiy kiyinish shart emas — ammo chiroyli va tartibli ko\'rinish yaxshi ta\'sir qoldiradi. Oddiy elegant uslub: qulay shim + yoqimli ko\'ylak. <strong>Asosiysi — o\'zingizni qulay his qiling!</strong> 🎬💫'
        },
        'Restoran kechkisi 🍽️': {
            emoji: '🥂',
            text: 'Restoran uchun smart-casual uslub mukammal tanlov. Chiroyli ko\'ylak yoki elegant libos kiyish tavsiya etiladi. <strong>Bu oqshom siz eng chiroyli bo\'lasiz!</strong> 🍽️✨'
        }
    };

    const tip = tips[loc] || {
        emoji: '✨',
        text: 'Eng muhimi — o\'zingizni qulay va chiroyli his qilishingiz. <strong>Tabassumingiz eng yaxshi bezak!</strong>'
    };

    document.getElementById('dresscode-text').innerHTML = `
    <span class="dc-emoji">${tip.emoji}</span>
    ${tip.text}
  `;
}

function buildSummary() {
    const dateStr = formatDate(state.date);
    document.getElementById('summary-box').innerHTML = `
    📅 <strong>Sana:</strong> ${dateStr}<br>
    ⏰ <strong>Vaqt:</strong> ${state.time}<br>
    📍 <strong>Joy:</strong> ${state.location}<br>
    ☕ <strong>Ichimlik:</strong> ${state.drink}<br>
    🍰 <strong>Shirinlik:</strong> ${state.sweet}<br>
    🌹 <strong>Gullar:</strong> ${state.flower} rang<br>
    🎵 <strong>Musiqa:</strong> ${state.music}
  `;
}

function formatDate(d) {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`;
}

async function confirm() {
    const dateStr = formatDate(state.date);
    const msgs = [
        `🎉 Ajoyib! Demak, ${dateStr} kuni soat ${state.time}da hayotimdagi eng chiroyli uchrashuv bo'lib o'tadi. Intizorlik bilan kutaman!`,
        `✅ Muvaffaqiyatli band qilindi! Endi bu kun mening taqvimimda "Eng baxtli kun" deb yozib qo'yiladi. 💌`,
        `🌸 Rahmat! Va'da beraman — bu uchrashuv siz uchun unutilmas va juda yoqimli o'tadi.`
    ];
    const finalMsg = msgs[Math.floor(Math.random() * msgs.length)];
    document.getElementById('final-msg').textContent = finalMsg;

    goStep('step-final');
    startCountdown();
    await sendToTelegram(dateStr);
}

async function sendToTelegram(dateStr) {
    const msg =
        `💌 *Yangi uchrashuv tasdiqlandi!*

📅 *Sana:* ${dateStr}
⏰ *Vaqt:* ${state.time}
📍 *Joy:* ${state.location}

☕ *Ichimlik:* ${state.drink}
🍰 *Shirinlik:* ${state.sweet}
🌹 *Gullar:* ${state.flower} rang
🎵 *Musiqa:* ${state.music}

✅ _Qiz tasdiqladiki, uchrashuv bo'lib o'tadi!_`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: msg,
                parse_mode: 'Markdown'
            })
        });
    } catch (e) {
        console.warn('Telegram error:', e);
    }
}

let countdownInterval = null;

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    function tick() {
        const now = new Date();
        const target = new Date(`${state.date}T${state.time}:00`);
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById('cnt-days').textContent = '00';
            document.getElementById('cnt-hours').textContent = '00';
            document.getElementById('cnt-mins').textContent = '00';
            document.getElementById('cnt-secs').textContent = '00';
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cnt-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cnt-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cnt-mins').textContent = String(mins).padStart(2, '0');
        document.getElementById('cnt-secs').textContent = String(secs).padStart(2, '0');
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

function openSurprise() {
    const flower = state.flower || 'Qizil';
    const sweet = state.sweet || 'Shokoladli tort 🍰';

    const flowerEmojis = {
        'Qizil 🌹': '🌹🌹🌹',
        'Pushti 🌸': '🌸🌸🌸',
        'Oq 🤍': '🤍🌼🤍',
        'Sariq 🌻': '🌻🌻🌻'
    };
    const flowerDisplay = flowerEmojis[flower] || '🌹🌹🌹';

    const box = document.getElementById('surprise-reveal');
    box.classList.remove('hidden');
    box.innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:0.5rem">${flowerDisplay}</div>
    <div style="font-size:1.5rem">${sweet.split(' ').slice(-1)[0] || '🍰'}</div>
    <p>Uchrashuv kuni sizga ${flower.split(' ')[0].toLowerCase()} rang gullar va ${sweet.split(/[^\w\s]/)[0].trim()} olib kelaman! 🎁</p>
  `;

    document.querySelector('.btn-surprise').disabled = true;
    document.querySelector('.btn-surprise').style.opacity = '0.5';
}