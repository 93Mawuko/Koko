// Charger les commentaires
function loadComments(postId) {
    const commentsContainer = document.getElementById('comments-list');
    const commentsCount = document.getElementById('comments-count');
    
    if (!commentsContainer || !commentsCount) return;
    
    // Récupérer les commentaires depuis le localStorage
    const comments = JSON.parse(localStorage.getItem(`post_${postId}_comments`)) || [];
    
    // Mettre à jour le compteur
    commentsCount.textContent = `(${comments.length})`;
    
    // Afficher les commentaires
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-avatar">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random" alt="${comment.name}">
                </div>
                <div>
                    <div class="comment-author">${comment.name}</div>
                    <div class="comment-date">${formatDate(comment.date)}</div>
                </div>
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <a href="#" class="reply-btn">Répondre</a>
                <a href="#" class="report-btn">Signaler</a>
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });
    
    // Gestion du formulaire de commentaire
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const text = document.getElementById('comment-text').value.trim();
            
            // Validation
            if (!name || !email || !text) {
                alert('Veuillez remplir tous les champs du formulaire.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Créer le nouveau commentaire
            const newComment = {
                id: Date.now(),
                name,
                email,
                text,
                date: new Date().toISOString(),
                approved: true // Dans une vraie app, on pourrait avoir un système de modération
            };
            
            // Sauvegarder le commentaire
            const comments = JSON.parse(localStorage.getItem(`post_${postId}_comments`)) || [];
            comments.push(newComment);
            localStorage.setItem(`post_${postId}_comments`, JSON.stringify(comments));
            
            // Recharger les commentaires
            loadComments(postId);
            
            // Réinitialiser le formulaire
            commentForm.reset();
            
            // Remercier l'utilisateur
            alert('Merci pour votre commentaire !');
        });
    }
}

// Fonction utilitaire pour formater la date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fonction utilitaire pour valider l'email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialiser les commentaires si on est sur une page de post
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));
    
    if (postId) {
        loadComments(postId);
    }
});