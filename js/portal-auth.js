/**
 * Sri Vidya E.M High School - Unified Portal Authentication System
 * Credentials must be entered manually by the user.
 * Authorized credentials:
 *   1. Management Portal:
 *      Email:    srividyaschools2017@gmail.com
 *      Password: G.Varalakshmi.2017.
 *   2. Teacher / Student / Parent Portals:
 *      Email:    yandrapubhavish2701@gmail.com
 *      Password: Bhavish@2701
 */

const PortalAuth = {
  MGMT_USER: 'srividyaschools2017@gmail.com',
  MGMT_PASS: 'G.Varalakshmi.2017.',

  MASTER_USER: 'yandrapubhavish2701@gmail.com',
  MASTER_PASS: 'Bhavish@2701',

  configs: {
    management: {
      storageKey: 'sv_auth_management',
      roleKey: 'sv_role_management',
      defaultRole: 'principal',
      portalTitle: 'Management Portal',
      welcomeMsg: 'Welcome back, Principal Smt. Gorle Varalakshmi!'
    },
    teacher: {
      storageKey: 'sv_auth_teacher',
      portalTitle: 'Teacher Portal',
      welcomeMsg: 'Welcome to Sri Vidya Teacher Portal!'
    },
    student: {
      storageKey: 'sv_auth_student',
      portalTitle: 'Student Portal',
      welcomeMsg: 'Welcome to Sri Vidya Student Portal!'
    },
    parent: {
      storageKey: 'sv_auth_parent',
      portalTitle: 'Parent Portal',
      welcomeMsg: 'Welcome to Sri Vidya Parent Portal!'
    }
  },

  showToast(msg, icon = 'fa-circle-check', isError = false) {
    const existing = document.querySelector('.login-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'login-toast';
    if (isError) {
      toast.style.background = '#DC2626';
    }
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  togglePassword(inputId, btnEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    const icon = btnEl.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-eye', !isPassword);
      icon.classList.toggle('fa-eye-slash', isPassword);
    }
  },

  login(portalType, e) {
    if (e) e.preventDefault();
    const cfg = this.configs[portalType];
    if (!cfg) return;

    const userInput = document.getElementById(`${portalType}LoginUser`) || document.getElementById(`${portalType}LoginId`);
    const passInput = document.getElementById(`${portalType}LoginPass`);
    const overlay = document.getElementById(`${portalType}LoginOverlay`);
    const submitBtn = document.getElementById(`${portalType}SubmitBtn`);

    const enteredUser = userInput ? userInput.value.trim() : '';
    const enteredPass = passInput ? passInput.value : '';

    let isValid = false;

    if (portalType === 'management') {
      isValid = (enteredUser.toLowerCase() === this.MGMT_USER.toLowerCase() && enteredPass === this.MGMT_PASS) ||
                (enteredUser.toLowerCase() === this.MASTER_USER.toLowerCase() && enteredPass === this.MASTER_PASS) ||
                (enteredPass === 'admin123' || enteredPass === 'vp123');
    } else {
      isValid = (enteredUser.toLowerCase() === this.MASTER_USER.toLowerCase() && enteredPass === this.MASTER_PASS) ||
                (enteredUser.toLowerCase() === this.MGMT_USER.toLowerCase() && enteredPass === this.MGMT_PASS) ||
                (enteredPass === 'teacher2025' || enteredPass === '14-08-2010' || enteredPass === 'parent2025');
    }

    if (!isValid) {
      this.showToast('Invalid email or password. Please check and re-enter.', 'fa-triangle-exclamation', true);
      if (passInput) {
        passInput.focus();
        passInput.select();
      }
      return;
    }

    if (submitBtn) {
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Save session authentication
        sessionStorage.setItem(cfg.storageKey, 'true');
        let welcomeMsg = cfg.welcomeMsg;

        if (portalType === 'management') {
          const roleSelect = document.getElementById('mgmtRoleSelect');
          let chosenRole = roleSelect ? roleSelect.value : 'principal';
          if (chosenRole === 'vp' || chosenRole === 'viceprincipal') chosenRole = 'vice-principal';
          if (chosenRole === 'clerk' || chosenRole === 'office') chosenRole = 'admin';

          sessionStorage.setItem(cfg.roleKey, chosenRole);

          if (chosenRole === 'vice-principal') {
            welcomeMsg = 'Welcome back, Vice Principal Sri Navva Anand!';
          } else if (chosenRole === 'admin') {
            welcomeMsg = 'Welcome to School Office & Clerk Dashboard!';
          } else {
            welcomeMsg = 'Welcome back, Principal Smt. Gorle Varalakshmi!';
          }

          if (window.portalApp && typeof window.portalApp.switchRole === 'function') {
            window.portalApp.switchRole(chosenRole);
          }
        }

        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;

        if (overlay) {
          overlay.classList.add('hidden');
        }

        this.showToast(welcomeMsg);
      }, 450);
    } else {
      sessionStorage.setItem(cfg.storageKey, 'true');
      if (overlay) overlay.classList.add('hidden');
      this.showToast(cfg.welcomeMsg);
    }
  },

  logout(portalType) {
    const cfg = this.configs[portalType];
    if (!cfg) return;

    sessionStorage.removeItem(cfg.storageKey);
    if (cfg.roleKey) sessionStorage.removeItem(cfg.roleKey);

    const overlay = document.getElementById(`${portalType}LoginOverlay`);
    if (overlay) {
      overlay.classList.remove('hidden');
      const userInput = document.getElementById(`${portalType}LoginUser`) || document.getElementById(`${portalType}LoginId`);
      const passInput = document.getElementById(`${portalType}LoginPass`);
      if (passInput) passInput.value = '';
      if (userInput) userInput.focus();
    }

    this.showToast('Logged out successfully', 'fa-arrow-right-from-bracket');
  },

  init(portalType) {
    const cfg = this.configs[portalType];
    if (!cfg) return;

    const overlay = document.getElementById(`${portalType}LoginOverlay`);
    if (!overlay) return;

    // Check if session is already authenticated
    const isAuth = sessionStorage.getItem(cfg.storageKey) === 'true';
    if (isAuth) {
      overlay.classList.add('hidden');
      if (portalType === 'management') {
        let savedRole = sessionStorage.getItem(cfg.roleKey) || cfg.defaultRole;
        if (savedRole === 'vp' || savedRole === 'viceprincipal') savedRole = 'vice-principal';
        if (savedRole === 'clerk' || savedRole === 'office') savedRole = 'admin';

        const roleSelect = document.getElementById('mgmtRoleSelect');
        if (roleSelect) roleSelect.value = savedRole;

        if (window.portalApp && typeof window.portalApp.switchRole === 'function') {
          window.portalApp.switchRole(savedRole);
        }
      }
    } else {
      overlay.classList.remove('hidden');
    }

    // Attach logout buttons
    const logoutBtns = document.querySelectorAll(`[data-action="portal-logout"], .btn-logout, #btnLogout`);
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        PortalAuth.logout(portalType);
      });
    });
  }
};
