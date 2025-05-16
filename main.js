// Fonctions utilitaires
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Gestion du menu hamburger
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Initialiser les posts sur la page d'accueil
    if (document.getElementById('posts-container')) {
        loadPosts();
    }
    
    // Initialiser le post sur la page de détail
    if (document.getElementById('post-content')) {
        loadPostContent();
        loadRelatedPosts();
    }
    
    // Gestion de la newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            // Simuler l'envoi
            setTimeout(() => {
                alert('Merci pour votre abonnement à notre newsletter !');
                this.reset();
            }, 500);
        });
    }
});

// Charger les posts depuis le localStorage (simulation)
function loadPosts() {
    // Cette partie serait remplacée par une requête AJAX dans une vraie application
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    // Récupérer les posts depuis le localStorage ou utiliser des données par défaut
    let posts = JSON.parse(localStorage.getItem('blogPosts')) || [
        {
            id: 1,
            title: 'Mon premier article',
            excerpt: 'Ceci est un exemple de premier article sur notre blog moderne.',
            content: '<h2>Introduction</h2><p>Ceci est le contenu complet de mon premier article.</p>',
            category: 'technology',
            tags: ['blog', 'premier'],
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            date: new Date().toISOString(),
            author: 'Jean Dupont',
            featured: true,
            allowComments: true
        },
        {
            id: 2,
            title: 'Conseils pour les voyageurs',
            excerpt: 'Découvrez mes meilleurs conseils pour voyager en toute sérénité.',
            content: '<h2>Préparation</h2><p>Comment bien préparer son voyage.</p>',
            category: 'travel',
            tags: ['voyage', 'conseils'],
            image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            date: new Date(Date.now() - 86400000).toISOString(), // Hier
            author: 'Marie Martin',
            featured: false,
            allowComments: true
        },
        {
            id: 3,
            title: 'Recette de cuisine facile',
            excerpt: 'Une délicieuse recette que vous pouvez préparer en moins de 30 minutes.',
            content: '<h2>Ingrédients</h2><p>Liste des ingrédients...</p>',
            category: 'food',
            tags: ['cuisine', 'recette'],
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            date: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
            author: 'Pierre Durand',
            featured: true,
            allowComments: true
        }
    ];
    
    // Sauvegarder les posts dans localStorage pour les réutiliser
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Afficher les posts
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${truncateText(post.excerpt, 150)}</p>
                <a href="post.html?id=${post.id}" class="post-read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Charger le contenu d'un post spécifique
function loadPostContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        window.location.href = 'index.html';
        return;
    }
    
    // Afficher le post
    const postContent = document.getElementById('post-content');
    postContent.innerHTML = `
        <div class="post-header">
            <div class="post-meta">
                <span class="post-category">${post.category}</span>
                <span>${formatDate(post.date)} • 5 min de lecture</span>
            </div>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
        </div>
        <div class="post-content">
            ${post.content}
        </div>
    `;
    
    // Mettre à jour le titre de la page
    document.title = `${post.title} | Blog Moderne`;
    
    // Initialiser les likes
    let likes = parseInt(localStorage.getItem(`post_${postId}_likes`)) || 0;
    document.getElementById('like-count').textContent = likes;
    
    // Vérifier si l'utilisateur a déjà liké
    const liked = localStorage.getItem(`post_${postId}_liked`) === 'true';
    if (liked) {
        document.getElementById('like-btn').classList.add('liked');
    }
    
    // Gestion du bouton like
    document.getElementById('like-btn').addEventListener('click', function() {
        if (liked) return;
        
        likes++;
        localStorage.setItem(`post_${postId}_likes`, likes);
        localStorage.setItem(`post_${postId}_liked`, 'true');
        document.getElementById('like-count').textContent = likes;
        this.classList.add('liked');
    });
    
    // Gestion du bouton supprimer (seulement en mode admin)
    const deleteBtn = document.getElementById('delete-post');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
                const updatedPosts = posts.filter(p => p.id !== postId);
                localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
                alert('Article supprimé avec succès !');
                window.location.href = 'index.html';
            }
        });
    }
    
    // Charger les commentaires
    loadComments(postId);
}

// Charger les articles similaires
function loadRelatedPosts() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (!postId) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const currentPost = posts.find(p => p.id === postId);
    
    if (!currentPost) return;
    
    // Filtrer les articles de la même catégorie (exclure l'article actuel)
    const relatedPosts = posts.filter(p => p.category === currentPost.category && p.id !== postId).slice(0, 3);
    const relatedContainer = document.getElementById('related-posts');
    
    if (!relatedContainer || relatedPosts.length === 0) return;
    
    relatedContainer.innerHTML = '';
    relatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${truncateText(post.excerpt, 100)}</p>
                <a href="post.html?id=${post.id}" class="post-read-more">Lire la suite <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        relatedContainer.appendChild(postElement);
    });
}