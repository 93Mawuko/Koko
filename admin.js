document.addEventListener('DOMContentLoaded', function() {
    // Charger les statistiques
    loadStats();
    
    // Charger les derniers articles
    loadRecentPosts();
    
    // Charger les derniers commentaires
    loadRecentComments();
    
    // Charger l'activité récente
    loadRecentActivity();
    
    // Gestion du dropdown utilisateur
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            this.querySelector('.dropdown-content').classList.toggle('show');
        });
    }
    
    // Fermer le dropdown quand on clique ailleurs
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
});

// Charger les statistiques
function loadStats() {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const comments = getAllComments();
    
    document.getElementById('total-posts').textContent = posts.length;
    document.getElementById('total-comments').textContent = comments.length;
    document.getElementById('total-users').textContent = '3'; // Valeur statique pour la démo
    document.getElementById('total-views').textContent = '1,245'; // Valeur statique pour la démo
}

// Charger les derniers articles
function loadRecentPosts() {
    const postsContainer = document.getElementById('recent-posts');
    if (!postsContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const recentPosts = posts.slice(0, 5).reverse(); // Les 5 plus récents
    
    postsContainer.innerHTML = '';
    
    if (recentPosts.length === 0) {
        postsContainer.innerHTML = '<tr><td colspan="6" class="text-center">Aucun article pour le moment</td></tr>';
        return;
    }
    
    recentPosts.forEach(post => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${post.title}</td>
            <td>${post.author || 'Admin'}</td>
            <td>${post.category}</td>
            <td>${formatDate(post.date)}</td>
            <td class="status-published">Publié</td>
            <td>
                <div class="table-actions">
                    <a href="../editor.html?edit=${post.id}" class="btn-table btn-edit-table" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="../post.html?id=${post.id}" class="btn-table btn-view-table" title="Voir">
                        <i class="fas fa-eye"></i>
                    </a>
                    <button class="btn-table btn-delete-table" title="Supprimer" data-id="${post.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        postsContainer.appendChild(row);
    });
    
    // Gestion des boutons de suppression
    document.querySelectorAll('.btn-delete-table').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = parseInt(this.getAttribute('data-id'));
            if (confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
                const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
                const updatedPosts = posts.filter(p => p.id !== postId);
                localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
                loadRecentPosts();
                loadStats();
                alert('Article supprimé avec succès !');
            }
        });
    });
}

// Charger les derniers commentaires
function loadRecentComments() {
    const commentsContainer = document.getElementById('recent-comments');
    if (!commentsContainer) return;
    
    const comments = getAllComments().slice(0, 5).reverse(); // Les 5 plus récents
    
    commentsContainer.innerHTML = '';
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<tr><td colspan="6" class="text-center">Aucun commentaire pour le moment</td></tr>';
        return;
    }
    
    comments.forEach(comment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comment.name}</td>
            <td>${truncateText(comment.text, 50)}</td>
            <td>Article #${comment.postId}</td>
            <td>${formatDate(comment.date)}</td>
            <td class="status-published">Approuvé</td>
            <td>
                <div class="table-actions">
                    <button class="btn-table btn-edit-table" title="Approuver">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-table btn-delete-table" title="Supprimer" data-id="${comment.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        commentsContainer.appendChild(row);
    });
    
    // Gestion des boutons de suppression
    document.querySelectorAll('.btn-delete-table').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentId = parseInt(this.getAttribute('data-id'));
            if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
                deleteComment(commentId);
                loadRecentComments();
                loadStats();
                alert('Commentaire supprimé avec succès !');
            }
        });
    });
}

// Charger l'activité récente
function loadRecentActivity() {
    const activityContainer = document.getElementById('activity-feed');
    if (!activityContainer) return;
    
    // Simuler des activités
    const activities = [
        {
            type: 'post',
            user: 'Jean Dupont',
            action: 'a publié un nouvel article',
            target: 'Mon premier article',
            date: new Date().toISOString()
        },
        {
            type: 'comment',
            user: 'Marie Martin',
            action: 'a commenté l\'article',
            target: 'Conseils pour les voyageurs',
            date: new Date(Date.now() - 3600000).toISOString() // Il y a 1 heure
        },
        {
            type: 'user',
            user: 'Pierre Durand',
            action: 's\'est inscrit sur le blog',
            target: '',
            date: new Date(Date.now() - 86400000).toISOString() // Il y a 1 jour
        }
    ];
    
    activityContainer.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        
        let icon = '';
        let iconClass = '';
        
        switch(activity.type) {
            case 'post':
                icon = 'fa-newspaper';
                iconClass = 'blue';
                break;
            case 'comment':
                icon = 'fa-comment';
                iconClass = 'green';
                break;
            case 'user':
                icon = 'fa-user';
                iconClass = 'orange';
                break;
        }
        
        activityElement.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-meta">
                    <span class="activity-user">${activity.user}</span>
                    <span class="activity-time">${formatTimeAgo(activity.date)}</span>
                </div>
                <div class="activity-text">
                    ${activity.action} ${activity.target ? `<a href="#">${activity.target}</a>` : ''}
                </div>
            </div>
        `;
        activityContainer.appendChild(activityElement);
    });
}

// Fonctions utilitaires
function getAllComments() {
    // Cette fonction récupère tous les commentaires de tous les posts
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    let allComments = [];
    
    posts.forEach(post => {
        const comments = JSON.parse(localStorage.getItem(`post_${post.id}_comments`)) || [];
        comments.forEach(comment => {
            allComments.push({
                ...comment,
                postId: post.id
            });
        });
    });
    
    return allComments.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function deleteComment(commentId) {
    // Cette fonction supprime un commentaire de n'importe quel post
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    posts.forEach(post => {
        const comments = JSON.parse(localStorage.getItem(`post_${post.id}_comments`)) || [];
        const updatedComments = comments.filter(c => c.id !== commentId);
        localStorage.setItem(`post_${post.id}_comments`, JSON.stringify(updatedComments));
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `il y a quelques secondes`;
    }
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}