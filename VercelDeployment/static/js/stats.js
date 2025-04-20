// Load Chart.js from CDN
document.addEventListener('DOMContentLoaded', function() {
    const statsButton = document.getElementById('show-stats-btn');
    const statsContent = document.querySelector('.stats-content');
    const totalVisitsEl = document.getElementById('total-visits');
    const todayVisitsEl = document.getElementById('today-visits');
    let visitChart = null;

    // Log visit when page loads
    logVisit();

    // Toggle stats visibility with animation
    statsButton.addEventListener('click', function() {
        const isHidden = statsContent.style.display === 'none';
        if (isHidden) {
            statsContent.style.display = 'block';
            setTimeout(() => {
                statsContent.classList.add('visible');
                loadStatistics();
            }, 10);
        } else {
            statsContent.classList.remove('visible');
            setTimeout(() => {
                statsContent.style.display = 'none';
            }, 500);
        }
    });

    async function logVisit() {
        try {
            await fetch('/api/logVisit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error logging visit:', error);
        }
    }

    async function loadStatistics() {
        try {
            const response = await fetch('/api/getStats');
            const data = await response.json();

            // Update counters with animation
            animateCounter(totalVisitsEl, data.totalVisits);
            animateCounter(todayVisitsEl, data.todayVisits);

            // Update chart
            updateChart(data.dailyStats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    function animateCounter(element, target) {
        const duration = 1500;
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const animate = () => {
            current += increment;
            if ((increment > 0 && current >= target) || 
                (increment < 0 && current <= target)) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.round(current);
            requestAnimationFrame(animate);
        };

        animate();
    }

    function updateChart(dailyStats) {
        const ctx = document.getElementById('visits-chart').getContext('2d');
        
        // Get dates for last 7 days
        const dates = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });

        if (visitChart) {
            visitChart.destroy();
        }

        visitChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Daily Visits',
                    data: dailyStats,
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--accent').trim(),
                    backgroundColor: 'rgba(60, 255, 226, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
});