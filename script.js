// ==================== CONFIGURAÇÃO DAS IMAGENS ====================
// IMPORTANTE: Substitua 'SEU_USUARIO' e 'SEU_REPOSITORIO' pelos seus dados do GitHub
// Exemplo: se seu GitHub é 'github.com/oTHRIP/OTH', use:
// GITHUB_USERNAME = 'oTHRIP'
// REPO_NAME = 'OTH'

const GITHUB_USERNAME = 'oTHRIP';  // ← Coloque seu username do GitHub aqui
const REPO_NAME = 'OTH';            // ← Coloque o nome do seu repositório aqui

// URLs das imagens do Friend Chat (já organizadas)
const friendChatImages = [
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/friendchat1.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/friendchat2.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/friendchat3.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/friendchat4.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/friendchat5.png`
];

// URLs das imagens dos Modelos 3D (adicione aqui quando tiver as imagens)
const modelsImages = [
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/model1.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/model2.png`,
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/images/model3.png`
    // Adicione mais imagens conforme necessário
    // Se não tiver imagens ainda, os placeholders serão usados
];

// ==================== SLIDER FUNCTIONALITY ====================
let currentSlides = {
    friendChat: 0,
    models: 0
};

function createSlider(sliderId, images, containerId, dotsId) {
    const container = document.getElementById(containerId);
    const dotsContainer = document.getElementById(dotsId);
    
    if (!container) return;
    
    container.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    // Verificar se há imagens válidas
    let validImages = images.filter(img => img && img !== '');
    
    if (validImages.length === 0) {
        // Usar placeholders se não houver imagens
        validImages = [
            'https://via.placeholder.com/500x280/6B6BFF/FFFFFF?text=3D+Model+1',
            'https://via.placeholder.com/500x280/9F6EFF/FFFFFF?text=3D+Model+2',
            'https://via.placeholder.com/500x280/D166FF/FFFFFF?text=3D+Model+3'
        ];
    }
    
    // Add images
    validImages.forEach((imgUrl, index) => {
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Image ${index + 1}`;
        img.onerror = function() {
            console.log(`Erro ao carregar: ${imgUrl}`);
            this.src = 'https://via.placeholder.com/500x280/FF6B6B/FFFFFF?text=Image+Not+Found';
        };
        container.appendChild(img);
    });
    
    // Add dots
    validImages.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(sliderId, index);
        dotsContainer.appendChild(dot);
    });
    
    // Store images count for reference
    window[`${sliderId}ImageCount`] = validImages.length;
    
    // Update dots on slide change
    updateDots(sliderId);
    
    // Set initial position
    updateSliderPosition(sliderId);
}

function updateSliderPosition(sliderId) {
    const container = document.getElementById(`${sliderId}Images`);
    if (!container) return;
    
    const currentSlide = currentSlides[sliderId];
    const slideWidth = container.clientWidth;
    container.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

function updateDots(sliderId) {
    const dotsContainer = document.getElementById(`${sliderId}Dots`);
    if (!dotsContainer) return;
    
    const dots = dotsContainer.children;
    const currentSlide = currentSlides[sliderId];
    
    for (let i = 0; i < dots.length; i++) {
        if (i === currentSlide) {
            dots[i].classList.add('active');
        } else {
            dots[i].classList.remove('active');
        }
    }
}

function nextSlide(sliderId) {
    const images = sliderId === 'friendChat' ? friendChatImages : modelsImages;
    const imageCount = sliderId === 'friendChat' ? friendChatImages.length : modelsImages.length;
    if (imageCount === 0) return;
    
    currentSlides[sliderId] = (currentSlides[sliderId] + 1) % imageCount;
    updateSliderPosition(sliderId);
    updateDots(sliderId);
}

function prevSlide(sliderId) {
    const images = sliderId === 'friendChat' ? friendChatImages : modelsImages;
    const imageCount = sliderId === 'friendChat' ? friendChatImages.length : modelsImages.length;
    if (imageCount === 0) return;
    
    currentSlides[sliderId] = (currentSlides[sliderId] - 1 + imageCount) % imageCount;
    updateSliderPosition(sliderId);
    updateDots(sliderId);
}

function goToSlide(sliderId, index) {
    currentSlides[sliderId] = index;
    updateSliderPosition(sliderId);
    updateDots(sliderId);
}

// Handle window resize to maintain slider position
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateSliderPosition('friendChat');
        updateSliderPosition('models');
    }, 100);
});

// ==================== MODAL DE CONTATO ====================
const modal = document.getElementById('contactModal');
const contactBtn = document.getElementById('contactBtn');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toastMessage');

if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function showToast(msg) {
    toast.textContent = msg || '📬 Message sent successfully!';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const message = document.getElementById('userMessage').value;
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', message);
        formData.append('_subject', `Contact from ${name} - Portfolio`);
        formData.append('_replyto', email);
        
        try {
            const response = await fetch('https://formsubmit.co/ajax/Henthaliss@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showToast('✅ Message sent! I will reply soon.');
                contactForm.reset();
                modal.style.display = 'none';
            } else {
                throw new Error('Error sending');
            }
        } catch (error) {
            window.location.href = `mailto:Henthaliss@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            showToast('📧 Opening your email client');
            contactForm.reset();
            modal.style.display = 'none';
        }
    });
}

// Initialize sliders when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Verificar se as imagens existem
    console.log('Carregando imagens do Friend Chat...');
    createSlider('friendChat', friendChatImages, 'friendChatImages', 'friendChatDots');
    
    console.log('Carregando imagens dos Modelos 3D...');
    createSlider('models', modelsImages, 'modelsImages', 'modelsDots');
    
    console.log('Site carregado com sucesso!');
});

// Função auxiliar para testar se as imagens estão carregando
function checkImagesLoaded() {
    console.log('Friend Chat images:', friendChatImages.length);
    console.log('3D Models images:', modelsImages.length);
}

// Executar verificação
checkImagesLoaded();
