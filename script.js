lucide.createIcons();

const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
});
overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
});

// ACTIVITY TABS
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
    });
});

// Chart defaults
Chart.defaults.color = '#888888';
Chart.defaults.font.family = "'DM Sans', sans-serif";

// BAR CHART
const barCtx = document.getElementById('barChart').getContext('2d');
const barGrad = barCtx.createLinearGradient(0, 0, 0, 240);
barGrad.addColorStop(0, '#FFCC00'); // top
barGrad.addColorStop(1, '#FF6200'); // bottom

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const vals = [600, 7100, 9800, 6400, 8200, 11320];
const maxVal = Math.max(...vals); 

// Target ratio height (~85% for max volume)
const targetMax = maxVal / 0.85;

const colors = vals.map((_, i) => months[i] === 'Mar' ? barGrad : '#2A2A2A');

new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: months,
        datasets: [{
            data: vals,
            backgroundColor: colors,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#161616',
                borderColor: '#2A2A2A',
                borderWidth: 1,
                titleColor: '#F5F5F5',
                bodyColor: '#F5F5F5',
                padding: 10,
                displayColors: false,
                callbacks: { label: ctx => '₹ ' + ctx.parsed.y.toLocaleString() }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: targetMax,
                grid: { color: '#222222', drawBorder: false },
                ticks: { padding: 10 },
                border: { display: false }
            },
            x: {
                grid: { display: false, drawBorder: false },
                border: { display: false }
            }
        }
    }
});

// DONUT CHART (Custom Canvas)
const dCanvas = document.getElementById('donutCanvas');

function drawDoubleDonut(canvas) {
    if(!canvas) return;
    const padding = 20;
    const minD = Math.min(canvas.parentElement.clientWidth, 250);
    const DPR = window.devicePixelRatio || 1;
    
    canvas.width  = minD * DPR;
    canvas.height = minD * DPR;
    canvas.style.width  = minD + 'px';
    canvas.style.height = minD + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(DPR, DPR);

    const cx = minD / 2;
    const cy = minD / 2;

    const OR = (minD/2) - padding;
    const OW = OR * 0.25; 
    const IR = OR - OW - 4;
    const IW = IR * 0.22;
    const startAngle = -Math.PI / 2;

    // Outer Back
    ctx.beginPath();
    ctx.arc(cx, cy, OR, 0, Math.PI * 2);
    ctx.lineWidth = OW;
    ctx.strokeStyle = '#2A2A2A';
    ctx.stroke();

    // Outer Fill (Income)
    const oGrad = ctx.createLinearGradient(cx-OR, cy, cx+OR, cy);
    oGrad.addColorStop(0, '#FF4400');
    oGrad.addColorStop(0.5, '#FF6200');
    oGrad.addColorStop(1, '#FFCC00');

    ctx.beginPath();
    ctx.arc(cx, cy, OR, startAngle, startAngle + Math.PI*2 * 0.75);
    ctx.lineWidth = OW;
    ctx.strokeStyle = oGrad;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner Back
    ctx.beginPath();
    ctx.arc(cx, cy, IR, 0, Math.PI * 2);
    ctx.lineWidth = IW;
    ctx.strokeStyle = '#2A2A2A';
    ctx.lineCap = 'butt';
    ctx.stroke();

    // Inner Fill (Expenses)
    const iGrad = ctx.createLinearGradient(cx-IR, cy, cx+IR, cy);
    iGrad.addColorStop(0, '#1a4d00');
    iGrad.addColorStop(0.5, '#22C55E');
    iGrad.addColorStop(1, '#bbff00');

    ctx.beginPath();
    ctx.arc(cx, cy, IR, startAngle, startAngle + Math.PI*2 * 0.45);
    ctx.lineWidth = IW;
    ctx.strokeStyle = iGrad;
    ctx.lineCap = 'round';
    ctx.stroke();
}

drawDoubleDonut(dCanvas);
window.addEventListener('resize', () => drawDoubleDonut(dCanvas));
