const handleSelectPlan = (planId: string) => {
  if (isAdmin) return alert("Admin Master Access is active!");
  if (!user) return navigate('/login');

  // TRIGGER MOBILE DIALER AUTOMATICALLY
  window.location.href = "tel:*185#"; 

  // Store selected plan temporarily and go to checkout
  sessionStorage.setItem("pending_plan", planId);
  setTimeout(() => navigate('/cart'), 2000); 
};