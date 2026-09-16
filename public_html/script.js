// ============================================
// Mobile Menu Toggle
// ============================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isActive);
    });

// Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-dropdown-menu a');
    mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.mobile-nav-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.querySelectorAll('.mobile-nav-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
            const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }
});
}

// ============================================
// Mobile Curricula Dropdown
// ============================================
document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const dropdown = toggle.closest('.mobile-nav-dropdown');
        if (!dropdown) return;

        dropdown.classList.toggle('active');
        toggle.setAttribute('aria-expanded', dropdown.classList.contains('active'));
    });
});

// ============================================
// Smooth Scrolling
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '#home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const headerHeight = 70;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Check Availability Handler - Detailed Grade-Specific Content
// ============================================
const checkAvailabilityBtn = document.getElementById('checkAvailability');
const availabilityResults = document.getElementById('availabilityResults');

// Grade-specific teaching content
const gradeTeachingContent = {
    '1': {
        title: 'How we teach Grade 1',
        content: [
            'Learning is active and concrete: stories, pictures, manipulatives, short activities',
            'We build foundational literacy and numeracy through daily routines and repetition',
            'Students learn classroom habits: listening, turn-taking, asking questions',
            'Feedback is immediate and encouraging; mistakes are part of learning'
        ]
    },
    '2': {
        title: 'How we teach Grade 2',
        content: [
            'Learning is active and concrete: stories, pictures, manipulatives, short activities',
            'We build foundational literacy and numeracy through daily routines and repetition',
            'Students learn classroom habits: listening, turn-taking, asking questions',
            'Feedback is immediate and encouraging; mistakes are part of learning'
        ]
    },
    '3': {
        title: 'How we teach Grade 3',
        content: [
            'Students work with multi-step tasks and longer reading/writing pieces',
            'We teach note-taking basics and how to learn from feedback',
            'Practice becomes intentional: students learn common errors and build confidence',
            'Projects are short and structured to build presentation and collaboration skills'
        ]
    },
    '4': {
        title: 'How we teach Grade 4',
        content: [
            'Learning shifts from "doing" to thinking + explaining with clearer structure',
            'Students learn to plan answers, organise work, and improve quality',
            'Classroom discussions become more analytical: comparing ideas, giving reasons',
            'Assessments include short quizzes, application tasks, and small projects'
        ]
    },
    '5': {
        title: 'How we teach Grade 5',
        content: [
            'We strengthen independence: planning tasks, managing time, checking work quality',
            'Students practise higher-order tasks: explain, justify, compare, and infer',
            'We build transition readiness for middle school: subject-based thinking, stronger study habits',
            'Feedback includes rubrics and clear "next step" guidance'
        ]
    },
    '6': {
        title: 'How we teach Grade 6',
        content: [
            'Students transition to subject-based learning with clear routines and organisation',
            'We teach study methods explicitly: summarising, spaced revision, self-quizzing, error logs',
            'More emphasis on research, lab thinking, and structured problem-solving',
            'Support is targeted: small groups for gaps; extension tasks for advanced learners'
        ]
    },
    '7': {
        title: 'How we teach Grade 7',
        content: [
            'We develop abstract thinking: patterns, cause-effect, argument building, evidence-based reasoning',
            'Students handle longer assignments, plan work over time, and manage deadlines',
            'Practice shifts toward deeper questions: "why does this work?" and "what if?"',
            'Assessment includes structured written responses with clear marking criteria'
        ]
    },
    '8': {
        title: 'How we teach Grade 8',
        content: [
            'Students work with complexity: multi-concept questions, layered explanations, connected topics',
            'We strengthen analytical writing, working with data, and evaluating sources',
            'Discussions push reasoning and independent thinking',
            'Exam skills: understanding command words, structuring arguments, time allocation'
        ]
    },
    '9': {
        title: 'How we teach Grade 9',
        content: [
            'We build secondary-level depth and board/IGCSE foundations',
            'Lessons combine deep concept teaching with high-quality practice and application',
            'Students learn exam techniques: command words, structure, time management, showing working clearly',
            'Regular feedback with personal targets and revision plans'
        ]
    },
    '10': {
        title: 'How we teach Grade 10',
        content: [
            'Grade 10 is assessment-heavy, so we teach for calm consistency and strong outcomes',
            'Every topic follows a cycle: concept clarity → targeted practice → mixed review → timed practice',
            'Students complete regular mock tests, error logs, and personalised revision schedules',
            'We train exam skills: choosing questions, managing time, avoiding common mistakes, writing to marking schemes'
        ]
    },
    '11': {
        title: 'How we teach Grade 11',
        content: [
            'Content becomes dense and fast-paced; we teach structured learning and note-taking systems',
            'Focus on deep understanding: proofs, derivations, multi-step problem solving',
            'Regular topic tests with detailed feedback',
            'We build connections between concepts and across chapters'
        ]
    },
    '12': {
        title: 'How we teach Grade 12',
        content: [
            'Board exam preparation with systematic revision and past paper practice',
            'Emphasis on exam strategy: time management, question selection, mark maximisation',
            'Intensive doubt-clearing sessions',
            'Mock exams under real conditions with detailed analysis'
        ]
    }
};

// Curriculum-specific alignment content
const curriculumAlignmentContent = {
    'ib-pyp': [
        'Inquiry-based learning approach',
        'Transdisciplinary themes integration',
        'Learner profile attributes development',
        'Concept-driven curriculum alignment',
        'Action-oriented learning'
    ],
    'cbse': [
        'Strong concept foundations aligned to NCERT',
        'Periodic tests and application-based questions',
        'Competency-based practice with structured revision',
        'Focus on NCERT mastery + reference book practice'
    ],
    'icse': [
        'Greater depth in language and writing',
        'Clarity, accuracy, and detail in answers trained consistently',
        'Detailed explanations and strong language integration',
        'Internal assessment and practical readiness'
    ],
    'ib-myp': [
        'Criterion-based assessment (A, B, C, D) preparation',
        'ATL (Approaches to Learning) skills integration',
        'Inquiry questions and reflection journals',
        'Connections across subjects through theme-based units',
        'Performance tasks connected to real contexts'
    ],
    'igcse': [
        'Cambridge syllabus-objective alignment',
        'Command terms and structured response practice',
        'Past-paper style tasks and mark scheme awareness',
        'Skills progression with clear success criteria'
    ],
    'isc': [
        'In-depth subject mastery building on ICSE foundations',
        'Board exam + competitive exam preparation where relevant',
        'Comprehensive practice with previous years'
    ],
    'ib-dp': [
        'HL/SL differentiation in teaching depth',
        'IA (Internal Assessment) support and guidance',
        'Extended essay guidance for relevant subjects',
        'Analytical writing with evidence'
    ],
    'as-levels': [
        'Cambridge International syllabus coverage',
        'Topic-wise mastery with past paper intensive practice',
        'Mark scheme alignment and examiner expectations'
    ],
    'a-levels': [
        'Cambridge International syllabus coverage',
        'Topic-wise mastery with past paper intensive practice',
        'Mark scheme alignment and examiner expectations'
    ],
    'state-board': [
        'Telangana/AP State Board syllabus alignment',
        'Focus on textbook mastery and exam patterns',
        'Telugu medium support available if needed'
    ],
    'other': [
        'We adapt our teaching methodology to match your curriculum requirements',
        'Customised approach based on your board\'s specific needs'
    ]
};

const curriculumNames = {
    'ib-pyp': 'IB PYP',
    'cbse': 'CBSE',
    'ib-myp': 'IB MYP',
    'igcse': 'IGCSE',
    'icse': 'ICSE',
    'isc': 'ISC',
    'ib-dp': 'IB DP',
    'as-levels': 'AS Levels',
    'a-levels': 'A Levels',
    'state-board': 'State Board',
    'other': 'Other'
};

const subjectNames = {
    'all': 'All Subjects',
    'school-homework': 'School Homework',
    'maths': 'Maths',
    'english': 'English (Sentence formation + Phonetics + Writing skills)',
    'science': 'Science',
    'social-studies': 'Social Studies'
};

// ============================================
// Dynamic Dropdown Population Based on Grade
// ============================================
const finderGrade = document.getElementById('finder-grade');
const finderSubject = document.getElementById('finder-subject');
const finderCurriculum = document.getElementById('finder-curriculum');

// Define curriculum options by grade range
const curriculumOptionsByGrade = {
    '1-5': ['ib-pyp', 'cbse', 'icse', 'igcse', 'state-board', 'other'],
    '6-10': ['ib-myp', 'cbse', 'icse', 'igcse', 'state-board', 'other'],
    '11-12': ['ib-dp', 'isc', 'as-levels', 'a-levels', 'cbse', 'igcse', 'state-board', 'other']
};

// Define subject options by grade range
const subjectOptionsByGrade = {
    '1-5': ['all', 'school-homework', 'maths', 'english'],
    '6-10': ['all', 'maths', 'science'],
    '11-12': ['all', 'maths', 'science']
};

// Function to get grade range from grade number
function getGradeRange(grade) {
    const gradeNum = parseInt(grade);
    if (gradeNum >= 1 && gradeNum <= 5) return '1-5';
    if (gradeNum >= 6 && gradeNum <= 10) return '6-10';
    if (gradeNum >= 11 && gradeNum <= 12) return '11-12';
    return null;
}

// Function to update dropdown options
function updateDropdownOptions(selectElement, options, optionValues) {
    // Store current selection
    const currentValue = selectElement.value;
    
    // Clear existing options except the first one (placeholder)
    const placeholder = selectElement.querySelector('option[value=""]');
    selectElement.innerHTML = '';
    if (placeholder) {
        selectElement.appendChild(placeholder);
    }
    
    // Add new options
    options.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = optionValues[value] || value;
        selectElement.appendChild(option);
    });
    
    // Restore selection if it's still valid
    if (currentValue && options.includes(currentValue)) {
        selectElement.value = currentValue;
    } else {
        selectElement.value = '';
    }
}

// Function to update dropdowns based on selected grade
function updateDropdownsForGrade(grade) {
    if (!grade) {
        // Reset to show all options if no grade selected
        return;
    }
    
    const gradeRange = getGradeRange(grade);
    if (!gradeRange) return;
    
    // Update curriculum dropdown
    const curriculumOptions = curriculumOptionsByGrade[gradeRange];
    const curriculumOptionValues = {};
    curriculumOptions.forEach(key => {
        curriculumOptionValues[key] = curriculumNames[key] || key;
    });
    updateDropdownOptions(finderCurriculum, curriculumOptions, curriculumOptionValues);
    
    // Update subject dropdown
    const subjectOptions = subjectOptionsByGrade[gradeRange];
    const subjectOptionValues = {};
    subjectOptions.forEach(key => {
        subjectOptionValues[key] = subjectNames[key] || key;
    });
    updateDropdownOptions(finderSubject, subjectOptions, subjectOptionValues);
}

// Listen for grade selection changes
if (finderGrade && finderSubject && finderCurriculum) {
    finderGrade.addEventListener('change', (e) => {
        const selectedGrade = e.target.value;
        updateDropdownsForGrade(selectedGrade);
    });
}

if (checkAvailabilityBtn && availabilityResults) {
    checkAvailabilityBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const grade = document.getElementById('finder-grade').value;
        const subject = document.getElementById('finder-subject').value;
        const curriculum = document.getElementById('finder-curriculum').value;
        
        if (!grade || !subject || !curriculum) {
            alert('Please select all options (Grade, Subject, and Curriculum) to see what we offer.');
            return;
        }
        
        // Get content based on grade
        const gradeContent = gradeTeachingContent[grade];
        const curriculumName = curriculumNames[curriculum] || curriculum;
        const subjectName = subjectNames[subject] || subject;
        const curriculumAlignment = curriculumAlignmentContent[curriculum] || [];
        
        if (!gradeContent) {
            alert('Please select a valid grade.');
            return;
        }
        
        // Set confirmation message
        const confirmationEl = document.getElementById('resultsConfirmation');
        confirmationEl.textContent = `Yes, we offer ${subjectName} for ${curriculumName} Grade ${grade}`;
        
        // Set "How We Teach" title and content
        const howWeTeachTitleEl = document.getElementById('howWeTeachTitle');
        howWeTeachTitleEl.textContent = gradeContent.title;
        
        const howWeTeachEl = document.getElementById('resultsHowWeTeach');
        howWeTeachEl.innerHTML = '<ul>' + gradeContent.content.map(item => `<li>${item}</li>`).join('') + '</ul>';
        
        // Set curriculum alignment title and content
        const curriculumAlignmentTitleEl = document.getElementById('curriculumAlignmentTitle');
        curriculumAlignmentTitleEl.textContent = `Curriculum alignment: ${curriculumName}`;
        
        const curriculumAlignmentEl = document.getElementById('curriculumAlignment');
        if (curriculumAlignment && curriculumAlignment.length > 0) {
            curriculumAlignmentEl.innerHTML = '<ul>' + curriculumAlignment.map(item => `<li>${item}</li>`).join('') + '</ul>';
            document.getElementById('curriculumAlignmentSection').style.display = 'block';
            } else {
            document.getElementById('curriculumAlignmentSection').style.display = 'none';
        }
        
        // Show results panel with fade-in animation
        availabilityResults.style.display = 'block';
        availabilityResults.style.opacity = '0';
        availabilityResults.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            availabilityResults.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            availabilityResults.style.opacity = '1';
            availabilityResults.style.transform = 'translateY(0)';
        }, 10);
        
        // Smooth scroll to results
        setTimeout(() => {
            availabilityResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    });
}

// ============================================
// Contact Form Handler
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Store original submit handler function (make it globally accessible for tracking)
    window.handleFormSubmit = function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        if (!data.name || !data.phone) {
            alert('Please fill in Name and Phone fields.');
            return;
        }
        
        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual backend integration)
        setTimeout(() => {
            alert('Thank you! We will contact you soon. For immediate assistance, please call us at +91 73966 69430');
            contactForm.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    };
    
    // Add submit listener
    // Note: If form has onsubmit attribute with trackFormSubmission, that will fire first
    // and then call handleFormSubmit via the tracking function
    contactForm.addEventListener('submit', window.handleFormSubmit);
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            this.value = value;
        });
    }
}

// ============================================
// Header Scroll Effect
// ============================================
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ============================================
// Phone Click Tracking (for analytics)
// ============================================
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track phone clicks if analytics is set up
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                'event_category': 'Contact',
                'event_label': 'Phone Call'
            });
        }
    });
});

// ============================================
// Diagnostic Test Modal
// ============================================
const bookDiagnosticBtn = document.getElementById('bookDiagnosticBtn');
const bookDiagnosticFromResults = document.getElementById('bookDiagnosticFromResults');
const diagnosticModal = document.getElementById('diagnosticModal');
const closeModal = document.getElementById('closeModal');
const copyUpiBtn = document.getElementById('copyUpiBtn');

// Function to open modal
function openDiagnosticModal() {
    diagnosticModal.style.display = 'flex';
    setTimeout(() => {
        diagnosticModal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

if (bookDiagnosticBtn && diagnosticModal) {
    // Open modal from hero button
    bookDiagnosticBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openDiagnosticModal();
    });
}

// Open modal from results panel button
if (bookDiagnosticFromResults && diagnosticModal) {
    bookDiagnosticFromResults.addEventListener('click', (e) => {
        e.preventDefault();
        openDiagnosticModal();
    });
}

// Function to close modal
function closeModalFunc() {
    if (diagnosticModal) {
        diagnosticModal.classList.remove('active');
        setTimeout(() => {
            diagnosticModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
}

// Close modal handlers
if (closeModal) {
    closeModal.addEventListener('click', () => {
        closeModalFunc();
    });
}

// Close on overlay click
if (diagnosticModal) {
    diagnosticModal.addEventListener('click', (e) => {
        if (e.target === diagnosticModal) {
            closeModalFunc();
        }
    });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && diagnosticModal && diagnosticModal.classList.contains('active')) {
        closeModalFunc();
    }
});

// Copy UPI ID functionality
if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
        const upiId = 'sahalswastik@okhdfcbank';
        navigator.clipboard.writeText(upiId).then(() => {
            const originalText = copyUpiBtn.textContent;
            copyUpiBtn.textContent = 'Copied!';
            copyUpiBtn.classList.add('copied');
            
            setTimeout(() => {
                copyUpiBtn.textContent = originalText;
                copyUpiBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = upiId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyUpiBtn.textContent;
            copyUpiBtn.textContent = 'Copied!';
            copyUpiBtn.classList.add('copied');
            
            setTimeout(() => {
                copyUpiBtn.textContent = originalText;
                copyUpiBtn.classList.remove('copied');
            }, 2000);
        });
    });
}


// ============================================
// Grade Tabs Functionality
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const gradeTabs = document.querySelectorAll('.grade-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (gradeTabs.length > 0 && tabPanels.length > 0) {
        gradeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // Remove active class from all tabs and panels
                gradeTabs.forEach(t => t.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                const targetPanel = document.getElementById(targetTab);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }
});

// ============================================
// Reviews Carousel
// ============================================
let currentSlide = 0;
let carouselInterval = null;

function initCarousel() {
    const track = document.getElementById('reviewsTrack');
    const cards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || cards.length === 0) return;
    
    const cardsToShow = window.innerWidth > 768 ? 3 : (window.innerWidth > 480 ? 2 : 1);
    const totalSlides = Math.ceil(cards.length / cardsToShow);
    
    // Clear existing interval
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    function updateCarousel() {
        if (cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + 24; // card width + gap
        const offset = currentSlide * cardWidth * cardsToShow;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    window.moveCarousel = function(direction) {
        const newCards = document.querySelectorAll('.review-card');
        const newDots = document.querySelectorAll('.dot');
        const newCardsToShow = window.innerWidth > 768 ? 3 : (window.innerWidth > 480 ? 2 : 1);
        const newTotalSlides = Math.ceil(newCards.length / newCardsToShow);
        
        currentSlide += direction;
        
        if (currentSlide < 0) currentSlide = newTotalSlides - 1;
        if (currentSlide >= newTotalSlides) currentSlide = 0;
        
        const cardWidth = newCards[0] ? newCards[0].offsetWidth + 24 : 304;
        const offset = currentSlide * cardWidth * newCardsToShow;
        track.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        newDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Reset auto-advance timer
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => moveCarousel(1), 5000);
    };
    
    window.goToSlide = function(index) {
        currentSlide = index;
        updateCarousel();
        
        // Reset auto-advance timer
        clearInterval(carouselInterval);
        carouselInterval = setInterval(() => moveCarousel(1), 5000);
    };
    
    // Initialize dots click handlers (re-attach for dynamically created dots)
    dots.forEach((dot, index) => {
        // Remove existing listeners by cloning
        const newDot = dot.cloneNode(true);
        dot.parentNode.replaceChild(newDot, dot);
        newDot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance carousel every 5 seconds
    carouselInterval = setInterval(() => moveCarousel(1), 5000);
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentSlide = 0;
            updateCarousel();
        }, 250);
    });
    
    // Initialize carousel position
    updateCarousel();
}

// ============================================
// Google Reviews API Integration
// ============================================

// Configuration - Update these URLs based on your hosting platform
const API_ENDPOINTS = {
    // Try Vercel endpoint first, then Netlify, then fallback
    vercel: '/api/google-reviews',
    netlify: '/.netlify/functions/google-reviews',
    // Fallback: If using a different platform, set a custom endpoint URL here
    custom: null // e.g., 'https://your-domain.com/api/google-reviews'
};

// Google Reviews Link (fallback if API fails)
const GOOGLE_REVIEWS_LINK = 'https://www.google.com/maps/place/Ankuram+Tuition+Centre+%7C+Math+Tuition+%7C+Science+Tuition/@17.4193614,78.4002112,15z/data=!4m7!3m6!1s0x3bcb95a38d079133:0xd70d61a4ba6957b!8m2!3d17.4193614!4d78.4002112!16s%2Fg%2F11qg16b5t6!19sChIJM5EHjaOVyzsRe5WmSxrWcA0';

/**
 * Format review date from Unix timestamp or relative time
 */
function formatReviewDate(time, relativeTimeDescription) {
    if (relativeTimeDescription) {
        return relativeTimeDescription;
    }
    if (time) {
        const date = new Date(time * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return '';
}

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="star filled" aria-hidden="true">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="star half" aria-hidden="true">★</span>';
        } else {
            starsHTML += '<span class="star" aria-hidden="true">★</span>';
        }
    }
    
    return starsHTML;
}

/**
 * Generate reviewer avatar HTML
 */
function generateAvatar(authorName, profilePhotoUrl) {
    const firstLetter = authorName ? authorName.charAt(0).toUpperCase() : '?';
    
    if (profilePhotoUrl) {
        return `<div class="reviewer-photo">
                    <img src="${profilePhotoUrl}" alt="${authorName}" loading="lazy">
                </div>`;
    } else {
        return `<div class="reviewer-photo placeholder">
                    <span>${firstLetter}</span>
                </div>`;
    }
}

/**
 * Render review cards from API data
 */
function renderReviews(reviewsData) {
    const track = document.getElementById('reviewsTrack');
    const businessNameEl = document.getElementById('businessName');
    const reviewCountEl = document.getElementById('reviewCount');
    const ratingNumberEl = document.getElementById('ratingNumber');
    const ratingStarsEl = document.getElementById('ratingStars');
    const viewAllLink = document.getElementById('viewAllReviewsLink');
    const carouselContainer = document.getElementById('reviewsCarousel');
    const loadingEl = document.getElementById('reviewsLoading');
    const errorEl = document.getElementById('reviewsError');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track) return;
    
    // Hide loading, show carousel
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (carouselContainer) carouselContainer.style.display = 'flex';
    
    // Update business info
    if (businessNameEl && reviewsData.name) {
        businessNameEl.textContent = reviewsData.name;
    }
    
    if (reviewCountEl && reviewsData.user_ratings_total) {
        reviewCountEl.textContent = `${reviewsData.user_ratings_total} Reviews`;
    }
    
    if (ratingNumberEl && reviewsData.rating) {
        ratingNumberEl.textContent = reviewsData.rating.toFixed(1);
        ratingNumberEl.setAttribute('aria-label', `Rating ${reviewsData.rating.toFixed(1)} out of 5`);
    }
    
    if (ratingStarsEl && reviewsData.rating) {
        ratingStarsEl.innerHTML = generateStars(reviewsData.rating);
        ratingStarsEl.setAttribute('aria-label', `${reviewsData.rating.toFixed(1)} out of 5 stars`);
    }
    
    // Update view all link if URL is available
    if (viewAllLink && reviewsData.url) {
        viewAllLink.href = reviewsData.url;
    }
    
    // Clear existing cards
    track.innerHTML = '';
    
    // Render review cards
    const reviews = reviewsData.reviews || [];
    
    if (reviews.length === 0) {
        // Show empty state
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = '<p>No reviews available at this time.</p>';
        }
        if (carouselContainer) carouselContainer.style.display = 'none';
        return;
    }
    
    reviews.forEach((review, index) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        const reviewLink = review.author_url || reviewsData.url || GOOGLE_REVIEWS_LINK;
        const reviewDate = formatReviewDate(review.time, review.relative_time_description);
        
        reviewCard.innerHTML = `
            ${generateAvatar(review.author_name, review.profile_photo_url)}
            <div class="review-stars" aria-label="Rated ${review.rating} out of 5">
                ${generateStars(review.rating)}
            </div>
            <p class="review-text">"${review.text}"</p>
            <a href="${reviewLink}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="read-full">
                Read full review <span>›</span>
            </a>
            <div class="reviewer-info">
                <svg class="google-small" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="reviewer-name">${review.author_name || 'Anonymous'}</span>
                <span class="review-date">${reviewDate}</span>
            </div>
        `;
        
        track.appendChild(reviewCard);
    });
    
    // Generate carousel dots based on number of reviews
    if (dotsContainer) {
        const cardsToShow = window.innerWidth > 768 ? 3 : (window.innerWidth > 480 ? 2 : 1);
        const totalSlides = Math.ceil(reviews.length / cardsToShow);
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.addEventListener('click', () => {
                if (typeof goToSlide === 'function') {
                    goToSlide(i);
                }
            });
            // Keyboard accessibility
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (typeof goToSlide === 'function') {
                        goToSlide(i);
                    }
                }
            });
            dotsContainer.appendChild(dot);
        }
        
        if (totalSlides > 1) {
            dotsContainer.style.display = 'flex';
        } else {
            dotsContainer.style.display = 'none';
        }
    }
    
    // Re-initialize carousel with new cards
    setTimeout(() => {
        initCarousel();
    }, 100);
}

/**
 * Load Google Reviews from API
 */
async function loadGoogleReviews() {
    const loadingEl = document.getElementById('reviewsLoading');
    const errorEl = document.getElementById('reviewsError');
    const carouselContainer = document.getElementById('reviewsCarousel');
    
    // Show loading state
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (carouselContainer) carouselContainer.style.display = 'none';
    
    // Determine which endpoint to use
    let apiUrl = null;
    
    // Try custom endpoint first if set
    if (API_ENDPOINTS.custom) {
        apiUrl = API_ENDPOINTS.custom;
    }
    // Try Vercel endpoint
    else if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app')) {
        apiUrl = API_ENDPOINTS.vercel;
    }
    // Try Netlify endpoint
    else if (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('netlify.com')) {
        apiUrl = API_ENDPOINTS.netlify;
    }
    // Default to Vercel
    else {
        apiUrl = API_ENDPOINTS.vercel;
    }
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check for API errors
        if (data.error) {
            throw new Error(data.message || data.error);
        }
        
        // Render reviews
        renderReviews(data);
        
    } catch (error) {
        console.warn('Failed to load Google Reviews:', error);
        
        // Show error fallback
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <p>Unable to load reviews at this time.</p>
                <a href="${GOOGLE_REVIEWS_LINK}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="view-all-reviews">
                    See our Google reviews →
                </a>
            `;
        }
        
        // In development, log the error
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('Google Reviews API Error:', error);
            console.info('To enable Google Reviews:');
            console.info('1. Set up a serverless function (Vercel or Netlify)');
            console.info('2. Configure GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID environment variables');
            console.info('3. Deploy the function and update API_ENDPOINTS in script.js');
        }
    }
}

// ============================================
// Page Load
// ============================================
window.addEventListener('load', () => {
    console.log('ANKURAM Tuition Centre - Website loaded successfully');
    
    // Initialize carousel (for static fallback)
    initCarousel();
    
    // Load Google Reviews from API
    loadGoogleReviews();
});
