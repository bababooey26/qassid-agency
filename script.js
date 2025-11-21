document.addEventListener('DOMContentLoaded', () => {


    const langButtons = document.querySelectorAll('#lang-toggle-btn, #mobile-lang-toggle-btn');
    const htmlEl = document.documentElement;
 
    if (langButtons.length > 0) {
        const pcBtnText = document.querySelector('#lang-toggle-btn .lang-switcher-text');
        const mobileBtnText = document.querySelector('#mobile-lang-toggle-btn .lang-switcher-text');
        
        const isArabicPage = htmlEl.lang.startsWith('ar');
        const initialText = isArabicPage ? 'English' : 'Arabic'; 

        if (pcBtnText) pcBtnText.textContent = initialText;
        if (mobileBtnText) mobileBtnText.textContent = initialText;
    }

  
     const marqueeContent = document.querySelector('.marquee-content');
     if (marqueeContent) {
         const wrapper = document.querySelector('.marquee-wrapper');
         if (wrapper) {
             wrapper.addEventListener('mouseenter', () => {
                 marqueeContent.style.animationPlayState = 'paused';
             });
             wrapper.addEventListener('mouseleave', () => {
                  marqueeContent.style.animationPlayState = 'running';
             });
         }
     }

     let lastScrollTop = 0;
     const header = document.querySelector('.main-header');
     const scrollThreshold = 100;
     const heroSection = document.querySelector('.hero-section'); 
     const bodyEl = document.body; 

     const setHeroPadding = () => {
         if (header && heroSection) {
             const headerHeight = header.offsetHeight;
             heroSection.style.paddingTop = `${headerHeight}px`;
         }
     };
     setHeroPadding();
     window.addEventListener('resize', setHeroPadding);
     window.addEventListener('scroll', function() {
       let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
       if (header) {
         if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
           bodyEl.classList.add('scrolled-down');
         } else {
            bodyEl.classList.remove('scrolled-down');
         }
       }
       lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
     }, false);

    const setupIntersectionObserver = () => {
         if (window.sectionObserver) {
             window.sectionObserver.disconnect();
         }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    const delay = entry.target.dataset.delay;
                    if (delay) {
                        entry.target.style.transitionDelay = delay;
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
         window.sectionObserver = observer;
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'none';
            el.style.transitionDelay = '0s';
            observer.observe(el);
        });
    };
    setupIntersectionObserver();


    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuCloseBtn = document.getElementById('mobile-menu-close'); 
    const overlay = document.getElementById('mobile-menu-overlay'); 

    const closeMenu = () => {
        menuToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        if (overlay) overlay.classList.remove('open'); 
        bodyEl.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    };
    
    const openMenu = () => {
        menuToggle.classList.add('open');
        mobileMenu.classList.add('open');
        if (overlay) overlay.classList.add('open');
        bodyEl.classList.add('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    };

    if(menuToggle && mobileMenu && menuCloseBtn && overlay) { 
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menuToggle.classList.contains('open');
            if (isOpen) {
                closeMenu(); 
            } else {
                openMenu(); 
            }
        });
        menuCloseBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu); 
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }


    const initCarousel = (originalItemCount) => {
        const carouselTrack = document.querySelector('.carousel-track');
        
        if (carouselTrack) { 
            const allLogos = document.querySelectorAll('.clients-grid .client-logo-box');
            if (allLogos.length === 0) return; 

            const paginationContainer = document.querySelector('.carousel-pagination');
            
          
            const loopResetColumn = originalItemCount; 

           
            const originalColumns = Math.ceil(originalItemCount / 3);
            const visibleDots = Math.min(12, originalColumns); 

         
            let dots = [];
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
                for (let i = 0; i < visibleDots; i++) { 
                    const dot = document.createElement('button');
                    dot.classList.add('pagination-dot');
                    if (i === 0) dot.classList.add('active');
                    
                    dot.addEventListener('click', () => {
                        moveToStep(i);
                        resetAutoPlay(); 
                    });
                    paginationContainer.appendChild(dot);
                    dots.push(dot);
                }
            }

            let currentStep = 0;
            let autoPlayInterval;
            let isTransitioning = false;

            const moveToStep = (stepIndex, animate = true) => {
                const clientLogoBox = document.querySelector('.client-logo-box');
                if (!clientLogoBox) return; 
                
                const gap = 5.5; 
                const boxWidth = clientLogoBox.getBoundingClientRect().width;
                const columnWidth = boxWidth + gap;
                const totalScrollDistance = columnWidth * stepIndex;
                
                if (!animate) {
                    carouselTrack.style.transition = 'none';
                } else {
                    carouselTrack.style.transition = 'transform 0.7s cubic-bezier(.16,1,.3,1)';
                    isTransitioning = true;
                }
                
                carouselTrack.style.transform = 'translateX(-' + totalScrollDistance + 'px)';
                currentStep = stepIndex;

             
                if (dots.length > 0) {
                    const dotIndex = stepIndex % dots.length;
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === dotIndex);
                    });
                }
            };

        
            carouselTrack.addEventListener('transitionend', () => {
                isTransitioning = false;
  
                if (currentStep >= loopResetColumn) {
                    const resetIndex = currentStep - loopResetColumn;
                    moveToStep(resetIndex, false); 
                  
                    void carouselTrack.offsetWidth; 
                }
            });

            const playAuto = () => {
                clearInterval(autoPlayInterval);
                autoPlayInterval = setInterval(() => {
                    moveToStep(currentStep + 1);
                }, 3000); 
            };

            const resetAutoPlay = () => {
                clearInterval(autoPlayInterval);
                playAuto();
            };

       
            moveToStep(0);
            playAuto();     
        }
    };

    const autoLoadNewLogos = () => {
        const grid = document.querySelector('.clients-grid');
        if (!grid) return;

        const hardcodedLogos = grid.querySelectorAll('.client-logo-box');
        const existingCount = hardcodedLogos.length;
        
        let index = existingCount + 1; 
        const folderPath = 'cst/'; 
        const maxCheck = 300; 

        function loadNextImage() {
            const imgNum = index < 10 ? '0' + index : index;
            const imgSrc = `${folderPath}${imgNum}.png`;
            const img = new Image();
            
            img.onload = function() {
                const box = document.createElement('div');
                box.className = 'client-logo-box';
                const htmlImg = document.createElement('img');
                htmlImg.src = imgSrc;
                htmlImg.alt = 'Partner Logo ' + imgNum;
                box.appendChild(htmlImg);
                grid.appendChild(box);
                index++;
                if (index < maxCheck) {
                    loadNextImage();
                } else {
                    finalizeGrid(index - 1); 
                }
            };

            img.onerror = function() {
                finalizeGrid(index - 1); 
            };

            img.src = imgSrc;
        }

        function finalizeGrid(totalRealImages) {
            const allCurrentLogos = Array.from(grid.querySelectorAll('.client-logo-box'));
            
    
            for (let j = 0; j < 10; j++) {
                allCurrentLogos.forEach(logoBox => {
                    const clone = logoBox.cloneNode(true);
                    grid.appendChild(clone);
                });
            }

            initCarousel(totalRealImages);
        }

        loadNextImage();
    };

    autoLoadNewLogos();


  
    const counterSection = document.querySelector('.framer-fru8lp');
    
    if (counterSection) {
        const counters = [
            { selector: '.framer-ap9h0b-container .framer-etnrh3-container div', end: 50, suffix: '+' },
            { selector: '.framer-65r8v1-container .framer-etnrh3-container div', end: 95, suffix: '٪' },
            { selector: '.framer-6yz8gd-container .framer-rnq1xt-container div', end: 300, suffix: '+' },
            { selector: '.framer-3r6m9g-container .framer-rnq1xt-container div', end: 6, suffix: 'K+' }, 
            { selector: '.framer-c5j3qk-container .framer-rnq1xt-container div', end: 2.5, suffix: 'k', decimals: 1 }, 
            { selector: '.framer-yy8zy-container .framer-rnq1xt-container div', end: 1, suffix: 'K+' }, 
            { selector: '.framer-ucq894-container .framer-rnq1xt-container div', end: 8.5, suffix: 'K+', decimals: 1 }, 
            { selector: '.framer-xqet7u-container .framer-rnq1xt-container div', end: 250, suffix: '+' },
            { selector: '.stats-card:nth-child(1) .card-number span:first-child', end: 300, suffix: '+' }, 
            { selector: '.stats-card:nth-child(2) .card-number span:first-child', end: 6, suffix: 'K+' },  
            { selector: '.stats-card:nth-child(3) .card-number span:first-child', end: 2.5, suffix: 'k', decimals: 1 }, 
        ];

        const animateCountUp = (el, end, suffix = '', decimals = 0, duration = 2000) => {
            let startTime = null;
            let start = 0; 
            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                let currentNum = progress * (end - start) + start;
                let numStr;
                if (decimals > 0) {
                    numStr = currentNum.toFixed(decimals);
                } else {
                    numStr = Math.floor(currentNum);
                }
                
                if (el.tagName !== 'SPAN') {
                     el.textContent = numStr + suffix;
                } else {
                     el.textContent = numStr;
                }

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                     if (decimals > 0) {
                         if (el.tagName !== 'SPAN') el.textContent = end.toFixed(decimals) + suffix;
                         else el.textContent = end.toFixed(decimals);
                    } else {
                         if (el.tagName !== 'SPAN') el.textContent = end + suffix;
                         else el.textContent = end;
                    }
                    if (suffix && el.nextElementSibling && el.nextElementSibling.tagName === 'SPAN') {
                        el.nextElementSibling.textContent = suffix;
                    }
                }
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const el = document.querySelector(counter.selector);
                        if (el) {
                            try {
                                animateCountUp(el, counter.end, counter.suffix || '', counter.decimals || 0);
                            } catch(e) {
                                console.error("Counter animation failed for", el, e);
                            }
                        }
                    });
                    observer.unobserve(counterSection); 
                }
            });
        }, {
            threshold: 0.3 
        });

        observer.observe(counterSection);
    }
  

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    document.body.appendChild(toast);
    
    let toastTimer;
    function showToast(message, isSuccess = true) {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = isSuccess ? 'success show' : 'error show';
        toastTimer = setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }
    
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxJuE6Cy9KVLb9phWE6HU86eMrgrWVk7l3PV_bVKiKFyk3cTQNEOt_mLOkSeQkOOzE4og/exec"; 
    const contactForm = document.querySelector('.contact-form'); 
    
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]'); 
        const originalButtonHTML = submitButton.innerHTML; 
    
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            submitButton.disabled = true;
            const isEnglishForm = document.documentElement.lang === 'en'; 
            submitButton.innerHTML = isEnglishForm ? '<span>Sending...</span>' : '<span>...جاري الإرسال</span>';
        
            const formData = new FormData(contactForm);
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    contactForm.reset(); 
                    const successMessage = isEnglishForm ? 'Sent Successfully!' : '!تم الإرسال بنجاح';
                    showToast(successMessage, true); 
                } else {
                    throw new Error(data.error || 'Unknown error occurred');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                const errorMessage = isEnglishForm ? 'Error. Try Again.' : 'حدث خطأ. حاول مرة أخرى.';
                showToast(errorMessage, false); 
            })
            .finally(() => {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonHTML;
                }, 500); 
            });
        });
    }
    
  
    const navItems = document.querySelectorAll('.service-item-link-v6');
    const images = document.querySelectorAll('.service-image');
    const isMobile = () => window.innerWidth <= 809;

    function activateImage(targetId) {
        images.forEach(img => img.classList.remove('active'));
        const targetImage = document.querySelector(`.service-image[data-preview="${targetId}"]`);
        if (targetImage) {
            targetImage.classList.add('active');
        }
    }
    activateImage('panel-1');

    navItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        item.addEventListener('mouseenter', () => {
            if (!isMobile()) { 
                activateImage(targetId);
            }
        });
        item.addEventListener('click', (e) => {
            if (isMobile()) { 
                e.preventDefault(); 
                activateImage(targetId);
            }
        });
    });


    if (typeof gsap !== 'undefined') {
        const intro = document.querySelector(".intro-screen");
        const text = document.querySelector(".intro-text");
        
        if (intro && text) {
            const letters = text.textContent.split("");
            text.textContent = "";
            letters.forEach((letter) => {
                const span = document.createElement("span");
                span.textContent = letter;
                text.appendChild(span);
            });

            gsap.to(".intro-text span", {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
            });

            gsap.to(intro, {
                yPercent: -100,
                duration: 1.5,
                delay: 1.5,
                ease: "power4.inOut",
                onComplete: () => intro.remove()
            });
        }
    }
}); 

function toggleServiceItem(item) {
     if (!item) return;
     const currentlyOpen = item.classList.contains('open');
     document.querySelectorAll('.service-item.open').forEach(openItem => {
         if (openItem !== item) {
             openItem.classList.remove('open');
         }
     });
     item.classList.toggle('open', !currentlyOpen);
}
