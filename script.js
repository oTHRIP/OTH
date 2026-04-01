// ==================== FUNÇÃO PARA CARREGAR IMAGENS ====================
async function loadImagesSimple(folderPath, containerId, dotsContainerId, maxAttempts = 30) {
    const container = document.getElementById(containerId);
    const dotsContainer = document.getElementById(dotsContainerId);
    const loadedImages = [];
    
    container.innerHTML = '';

    // 🔥 IMPORTANTE: corrige espaços automaticamente
    folderPath = folderPath.replace(/ /g, '%20');

    for (let i = 1; i <= maxAttempts; i++) {
        let found = false;
        const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

        for (const ext of extensions) {
            const imgUrl = `${folderPath}/${i}.${ext}`;

            try {
                const imgTest = new Image();
                const loaded = await new Promise((resolve) => {
                    imgTest.onload = () => resolve(true);
                    imgTest.onerror = () => resolve(false);
                    imgTest.src = imgUrl;

                    // 🔥 aumentei tempo (GitHub é lento)
                    setTimeout(() => resolve(false), 1500);
                });

                if (loaded) {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = `Imagem ${i}`;
                    container.appendChild(img);
                    loadedImages.push(imgUrl);
                    found = true;
                    break;
                }
            } catch(e) {}
        }

        if (!found && loadedImages.length > 0) break;
    }

    // 🔥 fallback com nomes comuns
    if (loadedImages.length === 0) {
        const commonNames = ['image', 'img', 'photo', 'picture'];

        for (const name of commonNames) {
            for (let num = 1; num <= 10; num++) {
                for (const ext of ['jpg', 'png', 'webp']) {
                    const imgUrl = `${folderPath}/${name}${num}.${ext}`;

                    try {
                        const imgTest = new Image();
                        const loaded = await new Promise((resolve) => {
                            imgTest.onload = () => resolve(true);
                            imgTest.onerror = () => resolve(false);
                            imgTest.src = imgUrl;
                            setTimeout(() => resolve(false), 1000);
                        });

                        if (loaded) {
                            const img = document.createElement('img');
                            img.src = imgUrl;
                            img.alt = `${name} ${num}`;
                            container.appendChild(img);
                            loadedImages.push(imgUrl);
                        }
                    } catch(e) {}
                }
            }
            if (loadedImages.length > 0) break;
        }
    }

    // ==================== DOTS ====================
    dotsContainer.innerHTML = '';
    for (let i = 0; i < loadedImages.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dotsContainer.appendChild(dot);
    }

    // ==================== FALLBACK FINAL ====================
    if (loadedImages.length === 0) {
        container.innerHTML = `
            <img src="https://picsum.photos/500/280?random=1" alt="Placeholder 1">
            <img src="https://picsum.photos/500/280?random=2" alt="Placeholder 2">
            <img src="https://picsum.photos/500/280?random=3" alt="Placeholder 3">
        `;
        dotsContainer.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    } else if (loadedImages.length === 1) {
        container.style.animation = 'none';
    } else {
        const duration = Math.max(12, loadedImages.length * 4);
        container.style.animation = `slideSlow ${duration}s infinite ease-in-out`;
    }
}


// ==================== MODAL DE CONTATO ====================
const modal = document.getElementById('contactModal');
const contactBtn = document.getElementById('contactBtn');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toastMessage');

contactBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

function showToast(msg) {
    toast.textContent = msg || '📬 Mensagem enviada com sucesso!';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const message = document.getElementById('userMessage').value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
        const response = await fetch('https://formspree.io/f/mayvlpwa', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showToast('✅ Mensagem enviada!');
            contactForm.reset();
            modal.style.display = 'none';
        } else {
            throw new Error();
        }
    } catch (error) {
        window.location.href = `mailto:Henthaliss@gmail.com?subject=Contato de ${name}&body=Nome: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMensagem:%0D%0A${message}`;
        showToast('📧 Abrindo email...');
        contactForm.reset();
        modal.style.display = 'none';
    }
});


// ==================== INICIAR ====================
window.addEventListener('DOMContentLoaded', () => {
    // 🔥 MUITO IMPORTANTE: sem espaço nas pastas
    loadImagesSimple('Friend-chat-imagens', 'friendChatImages', 'friendChatDots', 25);
    loadImagesSimple('3D-model-imagens', 'modelsImages', 'modelsDots', 25);
});
