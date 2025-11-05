<template>
  <footer class="cyberpunk-footer text-light py-5 mt-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="d-flex align-items-center mb-3">
            <i class="fas fa-graduation-cap text-primary me-2 fs-4"></i>
            <span class="fw-bold fs-4">TutorConnect</span>
          </div>
          <p class="text-muted">
            Connecting students with the best tutors and tuition centres in Singapore. 
            Find your perfect match for academic success.
          </p>
          <div class="d-flex gap-3">
            <span class="text-light footer-link-disabled">
              <i class="fab fa-facebook-f"></i>
            </span>
            <span class="text-light footer-link-disabled">
              <i class="fab fa-twitter"></i>
            </span>
            <span class="text-light footer-link-disabled">
              <i class="fab fa-instagram"></i>
            </span>
            <span class="text-light footer-link-disabled">
              <i class="fab fa-linkedin-in"></i>
            </span>
          </div>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h5 class="fw-bold mb-3">For Students</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">
                Find Tutors
              </span>
            </li>
          </ul>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h5 class="fw-bold mb-3">For Tutors</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Become a Tutor</span>
            </li>
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Success Stories</span>
            </li>
          </ul>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h5 class="fw-bold mb-3">Company</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">About Us</span>
            </li>
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Blog</span>
            </li>
          </ul>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h5 class="fw-bold mb-3">Support</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Help Center</span>
            </li>
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Contact Us</span>
            </li>
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Privacy Policy</span>
            </li>
            <li class="mb-2">
              <span class="text-muted text-decoration-none footer-link-disabled">Terms of Service</span>
            </li>
          </ul>
        </div>
      </div>
      
      <hr class="my-4">
      
      <div class="row align-items-center">
        <div class="col-md-12">
          <p class="text-muted mb-0">
            &copy; 2024 TutorConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
footer a:hover {
  color: var(--primary-color) !important;
  transition: color 0.3s ease;
}

.fab {
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.fab:hover {
  transform: translateY(-2px);
  color: var(--primary-color) !important;
}

/* Disabled footer links styling */
.footer-link-disabled {
  cursor: default !important;
  opacity: 0.7;
  pointer-events: none;
}

.footer-link-disabled:hover {
  color: inherit !important;
  transform: none !important;
}
</style>
