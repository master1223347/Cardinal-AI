document.getElementById('upload-btn').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        uploadImage(file);
    }
});

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    showToast('Uploading image...', 'info');
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerText = '';

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        if (data.result) {
            showToast('Image analyzed successfully!', 'success');
            document.getElementById('result').innerText = data.result;
        } else {
            showToast('Error analyzing image.', 'error');
            document.getElementById('result').innerText = 'Error analyzing image.';
        }
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        showToast('An error occurred.', 'error');
        document.getElementById('result').innerText = 'An error occurred.';
    });
}

// Smooth scroll when clicking 'Upload' button
document.querySelector('.btn-primary').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#upload-section').scrollIntoView({ behavior: 'smooth' });
  });
  