feather.replace()

;(function(){
  // DOM refs
  const form = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const fileInfo = document.getElementById('fileInfo');
  const progressArea = document.getElementById('progressArea');
  const progressFill = document.getElementById('progressFill');
  const progressBar = document.getElementById('progressBar');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');

  // modal
  const modal = document.getElementById('confirmModal');
  const modalYes = document.getElementById('confirmYes');
  const modalNo = document.getElementById('confirmNo');

  // Validation settings
  const MAX_BYTES = 20 * 1024 * 1024; // 20MB
  const ALLOWED_EXT = ['pdf','doc','docx','ppt','pptx','png','jpg','jpeg'];
  const ALLOWED_MIME = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ];

  let uploadInProgress = false;
  let lastFocused = null;

  // Helper: show toast (type: 'success'|'error')
  function showToast(message, type = 'success'){
    if (!toast || !toastIcon || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('success','error');
    toast.classList.add(type);
    
    // Update icon
    toastIcon.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-feather', type === 'success' ? 'check' : 'alert-circle');
    toastIcon.appendChild(i);
    feather.replace();
    
    toast.classList.add('show');
    
    // Clear existing timeout
    if (toast._timeout) clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // File preview logic
  function renderFilePreview(file){
    if (!fileInfo || !file) return;
    
    fileInfo.innerHTML = '';
    
    const name = file.name;
    const sizeKB = Math.round(file.size / 1024);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const ext = (name.split('.').pop() || '').toLowerCase();
    const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

    // Create preview card
    const previewCard = document.createElement('div');
    previewCard.className = 'file-preview-card';

    // File icon or image preview
    const iconContainer = document.createElement('div');
    iconContainer.className = 'file-preview-icon';
    
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      iconContainer.appendChild(img);
    } else {
      const icon = document.createElement("i");
      icon.setAttribute("data-feather", "file-text");
      iconContainer.appendChild(icon);
    }
    previewCard.appendChild(iconContainer);

    // File details
    const fileDetails = document.createElement('div');
    fileDetails.className = 'file-details';
    fileDetails.innerHTML = `
      <h4>${name}</h4>
      <p>${displaySize} • ${ext.toUpperCase()} format</p>
    `;
    previewCard.appendChild(fileDetails);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'file-remove-btn';
    removeBtn.innerHTML = '<i data-feather="x" style="width: 20px; height: 20px;"></i>';
    removeBtn.onclick = () => {
      fileInput.value = '';
      fileInfo.innerHTML = '';
    };
    previewCard.appendChild(removeBtn);

    fileInfo.appendChild(previewCard);
    feather.replace();
  }

  // Validation
  function validateFields(){
    const title = form.title.value?.trim();
    if (!title || title.length < 3) {
      showToast('Title is required (minimum 3 characters).', 'error');
      form.title.focus();
      return false;
    }
    
    if (!form.category.value) {
      showToast('Please select a category.', 'error');
      form.category.focus();
      return false;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
      showToast('Please choose a file to upload.', 'error');
      dropZone.focus();
      return false;
    }

    const file = fileInput.files[0];
    
    // Size check
    if (file.size > MAX_BYTES) {
      showToast('File is too large. Maximum size is 20MB.', 'error');
      return false;
    }

    // Type check
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const mimeValid = ALLOWED_MIME.includes(file.type);
    const extValid = ALLOWED_EXT.includes(ext);
    
    if (!mimeValid && !extValid) {
      showToast('Unsupported file type. Please upload PDF, DOC, DOCX, PPT, PPTX, PNG, or JPG files.', 'error');
      return false;
    }

    return true;
  }

  /* ---------- Dropzone & file input events ---------- */
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        renderFilePreview(fileInput.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        renderFilePreview(fileInput.files[0]);
      }
    });
  }

  /* ---------- Modal logic ---------- */
  function openModal(){
    if (!validateFields()) return false;
    if (uploadInProgress) return false;
    
    lastFocused = document.activeElement;
    modal.classList.add('show');
    
    // Focus first button
    setTimeout(() => {
      if (modalYes) modalYes.focus();
    }, 100);
    
    // Add event listeners
    document.addEventListener('keydown', modalKeyHandler);
    return true;
  }

  function closeModal(){
    modal.classList.remove('show');
    document.removeEventListener('keydown', modalKeyHandler);
    
    // Return focus
    setTimeout(() => {
      if (lastFocused) lastFocused.focus();
    }, 100);
  }

  function modalKeyHandler(e){
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
  }

  if (modalYes && modalNo) {
    modalYes.addEventListener('click', () => {
      closeModal();
      startUploadProcess();
    });

    modalNo.addEventListener('click', () => {
      closeModal();
    });
  }

  /* ---------- Form submit ---------- */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  /* ---------- Upload simulation ---------- */
  function startUploadProcess(){
    if (uploadInProgress) return;
    uploadInProgress = true;

    // Show progress area
    progressArea.classList.add('visible');
    progressFill.style.width = '0%';

    // Update button state
    submitBtn.innerHTML = '<i data-feather="loader" style="animation: spin 1s linear infinite;"></i> Uploading...';
    submitBtn.disabled = true;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;
      
      progressFill.style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Success
        setTimeout(() => {
          showToast('Upload successful! Your file is pending admin review and will be published soon.', 'success');
          
          // Reset form
          form.reset();
          fileInfo.innerHTML = '';
          
          // Reset button
          submitBtn.innerHTML = '<i data-feather="upload"></i> Upload File';
          submitBtn.disabled = false;
          
          // Hide progress
          setTimeout(() => {
            progressArea.classList.remove('visible');
            progressFill.style.width = '0%';
            uploadInProgress = false;
            feather.replace();
          }, 1000);
        }, 500);
      }
    }, 200);
  }

  /* ---------- Browse link click handler ---------- */
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('browse-link')) {
      e.preventDefault();
      if (fileInput) fileInput.click();
    }
  });

  // Initialize
  console.log('Enhanced upload script initialized successfully');

})();