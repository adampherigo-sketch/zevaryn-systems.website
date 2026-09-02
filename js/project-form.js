document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.querySelector('[data-project-form]');
  const formStatus = document.querySelector('[data-form-status]');
  const submitButton = projectForm?.querySelector('button[type="submit"]');

  if (!projectForm || !formStatus || !submitButton) return;

  const resetStatusDetail = () => {
    const detail = formStatus.querySelector('.status-detail');
    if (detail) detail.remove();
  };

  const setStatus = (message, state) => {
    resetStatusDetail();
    formStatus.textContent = message;
    formStatus.dataset.state = state;
  };

  const setSubmittingState = isSubmitting => {
    submitButton.disabled = isSubmitting;
    submitButton.dataset.loading = isSubmitting ? 'true' : 'false';
    submitButton.textContent = isSubmitting ? 'SENDING REQUEST...' : 'SEND PROJECT REQUEST';
  };

  projectForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!projectForm.checkValidity()) {
      setStatus('Please complete the required fields before sending.', 'error');
      projectForm.reportValidity();
      return;
    }

    setSubmittingState(true);
    setStatus('Sending request...', 'pending');

    const formData = new FormData(projectForm);
    const encoded = new URLSearchParams(formData).toString();

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encoded
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setSubmittingState(false);
      setStatus('PROJECT REQUEST RECEIVED', 'success');
      const detail = document.createElement('span');
      detail.className = 'status-detail';
      detail.textContent = 'Thank you for reaching out to Zevaryn Systems. Your project details have been received and will be reviewed before the next step.';
      formStatus.appendChild(detail);

      formStatus.setAttribute('tabindex', '-1');
      formStatus.focus();
      projectForm.reset();

    } catch (error) {
      setSubmittingState(false);
      setStatus("WE COULDN'T SEND YOUR REQUEST", 'error');
      const detail = document.createElement('span');
      detail.className = 'status-detail';
      detail.textContent = 'Your information is still on this page. Please try again, or contact Zevaryn Systems directly at zevarynsystems@outlook.com.';
      formStatus.appendChild(detail);
      console.error('Project inquiry submission failed:', error);
    }
  });
});
