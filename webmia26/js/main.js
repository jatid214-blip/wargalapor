/* ========================================
   WargaLapor — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initCategoryChips();
    initFeedFilters();
    initFAQ();
    initForm();
    initFileUpload();
    initBackToTop();
    initMapInteraction();
    initSmoothScroll();
    initReportDashboard();
    initAnalyticsDashboard();
});

/* ========================================
   Navbar
   ======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
        }
    });
}

/* ========================================
   Category Chips (Hero)
   ======================================== */
function initCategoryChips() {
    const chips = document.querySelectorAll('.category-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            // Could filter content here
        });
    });
}

/* ========================================
   Feed Filters
   ======================================== */
function initFeedFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const feedCards = document.querySelectorAll('.feed-card');
    const searchInput = document.getElementById('heroSearch');
    const categorySelect = document.getElementById('heroCategory');
    const regionSelect = document.getElementById('heroRegion');
    const searchButton = document.getElementById('heroSearchButton');
    let activeStatus = 'all';

    function updateFeed() {
        const query = searchInput?.value.trim().toLocaleLowerCase('id') || '';
        const category = categorySelect?.value || 'all';
        const region = regionSelect?.value || 'all';
        feedCards.forEach(card => {
            const matchesStatus = activeStatus === 'all' || card.dataset.status === activeStatus;
            const matchesCategory = category === 'all' || card.dataset.category === category;
            const matchesRegion = region === 'all' || card.textContent.includes(region);
            const matchesQuery = !query || card.textContent.toLocaleLowerCase('id').includes(query);
            const visible = matchesStatus && matchesCategory && matchesRegion && matchesQuery;
            card.style.display = visible ? '' : 'none';
            if (visible) card.style.animation = 'fadeInUp 0.4s ease forwards';
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeStatus = btn.dataset.filter;
            updateFeed();
        });
    });

    searchInput?.addEventListener('input', updateFeed);
    categorySelect?.addEventListener('change', updateFeed);
    regionSelect?.addEventListener('change', updateFeed);
    searchButton?.addEventListener('click', () => {
        updateFeed();
        document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' });
    });
    searchInput?.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton?.click();
        }
    });
}

/* ========================================
   FAQ Accordion
   ======================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const ans = faq.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            // Open clicked if wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* ========================================
   Form Handling
   ======================================== */
function initForm() {
    const form = document.getElementById('reportForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        
        // Validate
        const name = document.getElementById('reportName')?.value;
        const email = document.getElementById('reportEmail')?.value;
        const category = document.getElementById('reportCategory')?.value;
        const title = document.getElementById('reportTitle')?.value;
        const desc = document.getElementById('reportDesc')?.value;
        const agree = document.getElementById('reportAgree')?.checked;

        if (!name || !email || !category || !title || !desc) {
            showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
            return;
        }

        if (!agree) {
            showToast('Mohon centang persetujuan terlebih dahulu', 'error');
            return;
        }

        // Simulate submission
        const submitBtn = document.getElementById('submitReport');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast('Laporan berhasil dikirim! Nomor tracking: #WL-' + Math.floor(Math.random() * 90000 + 10000), 'success');
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Laporan';
            submitBtn.disabled = false;
        }, 2000);
    });
}

/* ========================================
   File Upload
   ======================================== */
function initFileUpload() {
    const uploadArea = document.getElementById('fileUpload');
    const fileInput = document.getElementById('reportFiles');
    
    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.background = 'var(--primary-50)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const names = Array.from(files).map(f => f.name).join(', ');
            uploadArea.querySelector('p').textContent = `${files.length} file dipilih: ${names}`;
            uploadArea.querySelector('i').className = 'fas fa-check-circle';
            uploadArea.querySelector('i').style.color = 'var(--success)';
        }
    }
}

/* ========================================
   Back to Top
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   Map Interaction
   ======================================== */
function initMapInteraction() {
    const regions = document.querySelectorAll('.map-region');
    const tooltip = document.getElementById('mapTooltip');
    
    if (!tooltip || regions.length === 0) return;

    const resolvedData = {
        'Jakarta Utara': '72%',
        'Jakarta Barat': '68%',
        'Jakarta Pusat': '78%',
        'Jakarta Timur': '75%',
        'Jakarta Selatan': '82%'
    };

    regions.forEach(region => {
        region.addEventListener('mouseenter', (e) => {
            const name = region.dataset.region;
            const count = region.dataset.count;
            
            document.getElementById('tooltipRegion').textContent = name;
            document.getElementById('tooltipCount').textContent = count + ' Laporan';
            document.getElementById('tooltipResolved').textContent = 'Terselesaikan: ' + (resolvedData[name] || '70%');
            
            tooltip.classList.add('visible');
        });

        region.addEventListener('mousemove', (e) => {
            const mapContainer = document.getElementById('interactiveMap');
            const rect = mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            tooltip.style.left = (x + 15) + 'px';
            tooltip.style.top = (y - 10) + 'px';
        });

        region.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   WargaLapor Report Dashboard
   ======================================== */
function initReportDashboard() {
    const form = document.getElementById('communityReportForm');
    if (!form) return;

    const categoryInput = document.getElementById('reportCategory');
    const sectorButtons = document.querySelectorAll('.sector-option');
    const description = document.getElementById('reportDesc');
    const descriptionCount = document.getElementById('descriptionCount');
    const evidenceInput = document.getElementById('reportEvidence');
    const evidenceLabel = document.getElementById('evidenceLabel');
    const searchInput = document.getElementById('reportSearch');
    const filterButtons = document.querySelectorAll('.status-filter');
    const reports = Array.from(document.querySelectorAll('.feed-report'));
    const emptyMessage = document.getElementById('emptyReports');
    let activeStatus = 'all';

    sectorButtons.forEach(button => {
        button.addEventListener('click', () => {
            sectorButtons.forEach(option => {
                const selected = option === button;
                option.classList.toggle('selected', selected);
                option.setAttribute('aria-pressed', String(selected));
            });
            categoryInput.value = button.dataset.category;
        });
    });

    description.addEventListener('input', () => {
        descriptionCount.textContent = `${description.value.length} / 500 karakter`;
    });

    evidenceInput.addEventListener('change', () => {
        const files = Array.from(evidenceInput.files || []);
        const oversizedFile = files.find(file => file.size > 10 * 1024 * 1024);
        if (oversizedFile) {
            evidenceInput.value = '';
            evidenceLabel.textContent = 'Unggah bukti';
            showToast('Ukuran setiap foto maksimal 10 MB', 'error');
            return;
        }
        evidenceLabel.textContent = files.length
            ? `${files.length} foto dipilih`
            : 'Unggah bukti';
    });

    function filterReports() {
        const query = searchInput.value.trim().toLocaleLowerCase('id');
        let visibleCount = 0;
        reports.forEach(report => {
            const matchesStatus = activeStatus === 'all' || report.dataset.status === activeStatus;
            const matchesSearch = !query || report.textContent.toLocaleLowerCase('id').includes(query);
            const visible = matchesStatus && matchesSearch;
            report.hidden = !visible;
            if (visible) visibleCount += 1;
        });
        emptyMessage.hidden = visibleCount > 0;
    }

    searchInput.addEventListener('input', filterReports);
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(option => option.classList.toggle('active', option === button));
            activeStatus = button.dataset.status;
            filterReports();
        });
    });

    document.querySelectorAll('.privacy-choice input').forEach(input => {
        input.addEventListener('change', () => {
            const selectedValue = document.querySelector('.privacy-choice input:checked')?.value;
            document.querySelectorAll('.privacy-choice').forEach(choice => {
                const choiceInput = choice.querySelector('input');
                choice.classList.toggle('selected', choiceInput.value === selectedValue);
            });
        });
    });

    document.querySelectorAll('.support-button').forEach(button => {
        button.addEventListener('click', () => {
            const count = Number(button.dataset.count);
            const supported = button.classList.toggle('supported');
            const updatedCount = count + (supported ? 1 : -1);
            button.dataset.count = String(updatedCount);
            button.querySelector('span').textContent = updatedCount;
            button.setAttribute('aria-pressed', String(supported));
        });
    });

    const locateButton = document.getElementById('locateReport');
    locateButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
            showToast('Browser ini tidak mendukung fitur lokasi', 'error');
            return;
        }
        locateButton.disabled = true;
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('reportCoordinates').textContent =
                `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
            locateButton.disabled = false;
            showToast('Koordinat lokasi berhasil diperbarui', 'success');
        }, error => {
            locateButton.disabled = false;
            const message = error.code === error.PERMISSION_DENIED
                ? 'Izin lokasi ditolak. Izinkan akses lokasi di pengaturan browser.'
                : error.code === error.TIMEOUT
                    ? 'Waktu pencarian lokasi habis. Silakan coba lagi.'
                    : 'Lokasi tidak dapat diperoleh. Periksa pengaturan perangkat Anda.';
            showToast(message, 'error');
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    });

    document.getElementById('mergeReports').addEventListener('click', () => {
        showToast('Laporan serupa ditampilkan untuk ditinjau sebelum digabungkan.', 'success');
    });

    document.getElementById('loadMoreReports').addEventListener('click', event => {
        const report = document.createElement('article');
        report.className = 'feed-report report-investigation';
        report.dataset.category = 'lingkungan';
        report.dataset.status = 'process';
        report.innerHTML = `
            <div class="report-card-top">
                <div><span class="ticket-id">#WJKT-2025-0719</span><span class="investigation-pill"><i class="fas fa-magnifying-glass"></i> Verifikasi lapangan</span><span class="department-pill">Dinas Sumber Daya Air</span></div>
                <span class="anonymous-pill"><i class="fas fa-clock"></i> Pembaruan hari ini</span>
            </div>
            <h3>Saluran Drainase Tersumbat Menjelang Musim Hujan</h3>
            <p class="report-location"><i class="fas fa-location-dot"></i> Jl. Kemang Raya, Jakarta Selatan <span>•</span> Ditangani petugas wilayah</p>
            <p class="report-description">Pemeriksaan dan pembersihan saluran dijadwalkan setelah laporan warga diverifikasi.</p>`;
        event.currentTarget.before(report);
        reports.push(report);
        event.currentTarget.remove();
        filterReports();
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const submitButton = form.querySelector('.submit-report');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim laporan...';
        window.setTimeout(() => {
            const ticket = `#WL-${Math.floor(10000 + Math.random() * 90000)}`;
            showToast(`Laporan berhasil disiapkan. Nomor pelacakan: ${ticket}`, 'success');
            form.reset();
            descriptionCount.textContent = '0 / 500 karakter';
            evidenceLabel.textContent = 'Unggah bukti';
            categoryInput.value = 'infrastruktur';
            sectorButtons.forEach(button => {
                const selected = button.dataset.category === 'infrastruktur';
                button.classList.toggle('selected', selected);
                button.setAttribute('aria-pressed', String(selected));
            });
            document.querySelectorAll('.privacy-choice').forEach(choice => {
                choice.classList.toggle('selected', choice.querySelector('input').checked);
            });
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim laporan resmi <span>(terhubung ke SLA 112)</span>';
        }, 700);
    });
}

/* ========================================
   WargaLapor Analytics Dashboard
   ======================================== */
function initAnalyticsDashboard() {
    const exportButton = document.getElementById('exportAnalytics');
    const printButtons = document.querySelectorAll('#printAnalytics, #printInsight');
    const table = document.querySelector('.analytics-table');

    if (exportButton && table) {
        exportButton.addEventListener('click', () => {
            const rows = [
                ['Matriks Kinerja Wilayah Administratif'],
                Array.from(table.rows[0].cells, cell => cell.textContent.trim()),
                ...Array.from(table.tBodies[0].rows, row =>
                    Array.from(row.cells, cell => cell.textContent.trim())
                )
            ];
            const csv = rows
                .map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(','))
                .join('\r\n');
            const file = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'wargalapor-matriks-kinerja-wilayah.csv';
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    printButtons.forEach(button => {
        button.addEventListener('click', () => window.print());
    });
}

/* ========================================
   Toast Notification
   ======================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
