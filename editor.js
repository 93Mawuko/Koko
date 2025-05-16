document.addEventListener('DOMContentLoaded', function() {
    // Initialiser Quill Editor
    const quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        },
        placeholder: 'Écrivez votre article ici...',
        theme: 'snow'
    });
    
    // Vérifier si nous sommes en mode édition
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.has('edit');
    const postId = editMode ? parseInt(urlParams.get('edit')) : null;
    
    // Charger les données du post en mode édition
    if (editMode && postId) {
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const post = posts.find(p => p.id === postId);
        
        if (post) {
            document.getElementById('post-title').value = post.title;
            document.getElementById('post-category').value = post.category;
            document.getElementById('post-tags').value = post.tags.join(', ');
            quill.root.innerHTML = post.content;
            
            // Afficher l'image existante
            if (post.image) {
                const imagePreview = document.getElementById('image-preview');
                imagePreview.innerHTML = `<img src="${post.image}" alt="Preview">`;
                imagePreview.style.display = 'block';
            }
            
            // Mettre à jour le bouton de publication
            document.getElementById('publish-btn').textContent = 'Mettre à jour';
        } else {
            alert('Article non trouvé !');
            window.location.href = 'editor.html';
        }
    }
    
    // Gestion de l'upload d'image
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            alert('Veuillez sélectionner une image valide.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });
    
    // Gestion de la programmation de publication
    const scheduleCheckbox = document.getElementById('post-schedule');
    const scheduleDate = document.getElementById('schedule-date');
    
    scheduleCheckbox.addEventListener('change', function() {
        if (this.checked) {
            scheduleDate.style.display = 'block';
        } else {
            scheduleDate.style.display = 'none';
        }
    });
    
    // Gestion du formulaire
    const postForm = document.getElementById('post-form');
    
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const title = document.getElementById('post-title').value.trim();
        const category = document.getElementById('post-category').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
        const content = quill.root.innerHTML;
        const featured = document.getElementById('featured-post').checked;
        const allowComments = document.getElementById('allow-comments').checked;
        const schedule = document.getElementById('post-schedule').checked;
        const publishDate = schedule ? document.getElementById('post-date').value : new Date().toISOString();
        
        // Validation
        if (!title) {
            alert('Veuillez entrer un titre pour votre article.');
            return;
        }
        
        if (!category) {
            alert('Veuillez sélectionner une catégorie.');
            return;
        }
        
        if (quill.getText().trim().length < 50) {
            alert('Le contenu de votre article est trop court. Veuillez écrire au moins 50 caractères.');
            return;
        }
        
        // Récupérer l'image (simulation - dans une vraie app, il faudrait uploader le fichier)
        let imageUrl = '';
        if (imagePreview.style.display === 'block') {
            const img = imagePreview.querySelector('img');
            imageUrl = img ? img.src : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
        } else if (editMode) {
            const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
            const post = posts.find(p => p.id === postId);
            imageUrl = post ? post.image : '';
        }
        
        // Créer ou mettre à jour le post
        const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        const excerpt = truncateText(quill.getText().trim(), 200);
        
        if (editMode && postId) {
            // Mise à jour de l'article existant
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                posts[postIndex] = {
                    ...posts[postIndex],
                    title,
                    category,
                    tags,
                    content,
                    excerpt,
                    image: imageUrl,
                    featured,
                    allowComments,
                    date: publishDate
                };
            }
        } else {
            // Création d'un nouvel article
            const newPost = {
                id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
                title,
                excerpt,
                content,
                category,
                tags,
                image: imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                date: publishDate,
                author: 'Jean Dupont', // Dans une vraie app, on utiliserait l'utilisateur connecté
                featured,
                allowComments
            };
            posts.push(newPost);
        }
        
        // Sauvegarder
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Redirection
        alert(editMode ? 'Article mis à jour avec succès !' : 'Article publié avec succès !');
        window.location.href = editMode ? `post.html?id=${postId}` : 'index.html';
    });
    
    // Gestion du bouton "Enregistrer comme brouillon"
    document.getElementById('save-draft').addEventListener('click', function() {
        alert('Fonctionnalité de brouillon à implémenter !');
    });
    
    // Fonction utilitaire pour tronquer le texte
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
});