window.quantumPiForgeIntegration = {
  version: '1.0.0',
  status: 'static-ready',
  openedAt: new Date().toISOString(),

  getInviteCode() {
    return 'onenoly11';
  },

  openProofStrip() {
    const target = document.getElementById('proof-strip');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
