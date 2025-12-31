document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // 3D Tilt Effect for Project Cards
    const cards = document.querySelectorAll('.polaroid');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Confetti Click
    document.addEventListener('click', (e) => {
        // Only trigger if clicking directly on body or non-interactive elements
        if (e.target.tagName === 'BODY' || e.target.id === 'hero') {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // Tech Tag Interaction
    const techTags = document.querySelectorAll('.tech-tag');

    techTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            // Toggle active fill state
            const isActive = tag.classList.toggle('active');
            const percent = tag.dataset.percent;

            if (isActive) {
                tag.style.setProperty('--progress-width', `${percent}%`);
            } else {
                tag.style.setProperty('--progress-width', '0%');
            }
        });
    });

    // Draggable Sticker Physics
    const sticker = document.getElementById('draggable-sticker');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    sticker.addEventListener('mousedown', dragStart);
    sticker.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === sticker) {
            isDragging = true;
            sticker.style.transition = 'none'; // distinct drag feel
            sticker.style.zIndex = '1000';
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        sticker.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // snap back feel
        // Optional: Add throw physics here later if requested
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, sticker);
        }
    }

    function setTranslate(xPos, yPos, el) {
        // Keep the rotation while dragging
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotate(15deg) scale(1.1)`;
    }
});

// --- Draggable Sticker Logic (End) --- 

function createSparkle(x, y) {
    const colors = ['#000', '#FFEB3B', '#E0F7FA']; // Updated colors to match theme
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '8px';
    sparkle.style.height = '8px';
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.transform = 'rotate(45deg)'; // Square diamond shape
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'flyAndFade 0.8s forwards';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 800);
}

// Add dynamic keyframes
const style = document.createElement('style');
style.innerHTML = `
    @keyframes flyAndFade {
        0% { transform: translate(-50%, -50%) scale(1) rotate(45deg); opacity: 1; }
        100% { transform: translate(calc(-50% + ${Math.random() * 40 - 20}px), -100px) scale(0) rotate(90deg); opacity: 0; }
    }
`;
document.head.appendChild(style);


